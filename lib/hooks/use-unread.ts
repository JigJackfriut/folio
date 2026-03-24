'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useUnread() {
  const [unreadCount, setUnreadCount] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  const fetchUnread = async (uid: string) => {
    // Pending threads where you are the recipient
    const { count: pendingCount } = await supabase
      .from('threads')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_id', uid)
      .eq('status', 'pending')

    // Open threads with unread messages
    const { data: openThreads } = await supabase
      .from('threads')
      .select('id, initiator_id, recipient_id, initiator_read_at, recipient_read_at')
      .eq('status', 'open')
      .or(`initiator_id.eq.${uid},recipient_id.eq.${uid}`)

    let unreadThreads = 0
    if (openThreads) {
      for (const thread of openThreads) {
        const isInitiator = thread.initiator_id === uid
        const myLastRead = isInitiator
          ? thread.initiator_read_at
          : thread.recipient_read_at

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('thread_id', thread.id)
          .neq('sender_id', uid)
          .gt('created_at', myLastRead ?? '1970-01-01')

        if ((count ?? 0) > 0) unreadThreads++
      }
    }

    setUnreadCount((pendingCount ?? 0) + unreadThreads)
  }

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      await fetchUnread(user.id)
    }
    init()
  }, [])

  // Real-time — watch for new messages and new threads
  useEffect(() => {
    if (!userId) return

    const msgChannel = supabase
      .channel('unread-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => { fetchUnread(userId) })
      .subscribe()

    const threadChannel = supabase
      .channel('unread-threads')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'threads',
        filter: `recipient_id=eq.${userId}`,
      }, () => { fetchUnread(userId) })
      .subscribe()

    return () => {
      supabase.removeChannel(msgChannel)
      supabase.removeChannel(threadChannel)
    }
  }, [userId])

  const markThreadRead = async (threadId: string) => {
    if (!userId) return
    const now = new Date().toISOString()

    const { data: thread } = await supabase
      .from('threads')
      .select('initiator_id')
      .eq('id', threadId)
      .single()

    if (!thread) return

    const field = thread.initiator_id === userId
      ? 'initiator_read_at'
      : 'recipient_read_at'

    await supabase
      .from('threads')
      .update({ [field]: now })
      .eq('id', threadId)

    if (userId) await fetchUnread(userId)
  }

  return { unreadCount, markThreadRead }
}
