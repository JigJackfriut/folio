'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getInboxData } from '@/lib/queries/threads'
import { acceptThread, declineThread } from '@/lib/mutations/threads'

function timeAgo(date: string): string {
  const hours = Math.floor((Date.now() - new Date(date).getTime()) / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

const serif = 'EB Garamond, Georgia, serif'

export default function InboxPage() {
  const supabase = createClient()
  const router = useRouter()

  const [threads, setThreads] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [acting, setActing] = useState<string | null>(null)

const load = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  setUserId(user.id)
  const data = await getInboxData(supabase, user.id)
  setThreads(data)
  setLoading(false)

  // Mark all threads as read — viewing inbox is the read event
  const now = new Date().toISOString()
  const threadIds = data
    .filter(t => t.recipient_id === user.id)
    .map(t => t.id)

  if (threadIds.length > 0) {
    await supabase
      .from('threads')
      .update({ recipient_read_at: now })
      .in('id', threadIds)
  }

  const initiatorThreadIds = data
    .filter(t => t.initiator_id === user.id)
    .map(t => t.id)

  if (initiatorThreadIds.length > 0) {
    await supabase
      .from('threads')
      .update({ initiator_read_at: now })
      .in('id', initiatorThreadIds)
  }
}
    load()
  }, [])

  // Real-time — update inbox when new threads or messages arrive
  useEffect(() => {
    if (!userId) return

    const threadChannel = supabase
      .channel('inbox-threads')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'threads',
        filter: `recipient_id=eq.${userId}`,
      }, async () => {
        const data = await getInboxData(supabase, userId)
        setThreads(data)
      })
      .subscribe()

    const msgChannel = supabase
      .channel('inbox-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, async payload => {
        // Update last message in the relevant thread
        setThreads(prev => prev.map(t => {
          if (t.id !== payload.new.thread_id) return t
          const already = t.messages?.some((m: any) => m.id === payload.new.id)
          if (already) return t
          return {
            ...t,
            messages: [...(t.messages ?? []), payload.new],
          }
        }))
      })
      .subscribe()

    return () => {
      supabase.removeChannel(threadChannel)
      supabase.removeChannel(msgChannel)
    }
  }, [userId])

  const isThreadUnread = (thread: any) => {
    if (!userId) return false
    const lastMsg = thread.messages?.[thread.messages.length - 1]
    if (!lastMsg) return false
    // If last message is from the other person, it's unread
    if (lastMsg.sender_id === userId) return false
    const isInitiator = thread.initiator_id === userId
    const myLastRead = isInitiator
      ? thread.initiator_read_at
      : thread.recipient_read_at
    if (!myLastRead) return true
    return new Date(lastMsg.created_at) > new Date(myLastRead)
  }

  const incomingPending = threads.filter(t =>
    t.status === 'pending' && t.recipient_id === userId
  )
  const outgoingPending = threads.filter(t =>
    t.status === 'pending' && t.initiator_id === userId
  )
  const open = threads.filter(t => t.status === 'open')
  const totalCount = incomingPending.length + outgoingPending.length + open.length

  const handleAccept = async (threadId: string) => {
    setActing(threadId)
    try {
      await acceptThread(supabase, threadId)
      setThreads(prev => prev.map(t =>
        t.id === threadId ? { ...t, status: 'open' } : t
      ))
      router.push(`/thread/${threadId}`)
    } catch {
      setActing(null)
    }
  }

  const handleDecline = async (threadId: string) => {
    setActing(threadId)
    try {
      await declineThread(supabase, threadId)
      setThreads(prev => prev.filter(t => t.id !== threadId))
    } catch {
      setActing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 rounded-full border-2 animate-spin"
          style={{ borderColor: '#3a2b58', borderTopColor: '#6d4bc3' }} />
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="w-full max-w-xl mx-auto">

        {/* Header */}
        <div className="px-5 pt-14 pb-4" style={{ borderBottom: '1px solid #2a1f42' }}>
          <div className="flex items-center gap-3">
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '30px', color: '#f0eaff' }}>
              inbox
            </p>
            {incomingPending.length > 0 && (
              <div
                style={{
                  background: '#c8922a',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  marginTop: '4px',
                }}
              >
                <span className="font-mono" style={{ fontSize: '10px', color: '#fff', fontWeight: 700 }}>
                  {incomingPending.length} new
                </span>
              </div>
            )}
          </div>
        </div>

        {totalCount === 0 && (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: '#c8b8e8', marginBottom: '8px' }}>
              nothing yet.
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: '#8a7aaa' }}>
              replies to your post will appear here
            </p>
          </div>
        )}

        {/* Incoming — someone replied to you */}
        {incomingPending.length > 0 && (
          <div className="pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] px-5 mb-3" style={{ color: '#c3b3ff' }}>
              reply requests — {incomingPending.length}
            </p>
            <div className="flex flex-col gap-3 px-4">
              {incomingPending.map(thread => {
                const firstMsg = thread.messages?.[0]
                const isExpanded = expandedPost === thread.id
                const senderPost = thread.initiator_post

                return (
                  <div
                    key={thread.id}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: '#1e1530',
                      border: '1px solid #6d4bc3',
                    }}
                  >
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {/* Unread dot */}
                          <div style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: '#c8922a',
                            flexShrink: 0,
                          }} />
                          <span
                            className="font-mono text-[10px] rounded-full"
                            style={{
                              padding: '3px 10px',
                              background: 'rgba(109,75,195,0.15)',
                              border: '1px solid rgba(109,75,195,0.3)',
                              color: '#c3b3ff',
                              letterSpacing: '0.06em',
                            }}
                          >
                            someone replied
                          </span>
                        </div>
                        <span className="font-mono text-[10px]" style={{ color: '#9b85e8' }}>
                          {timeAgo(thread.created_at)}
                        </span>
                      </div>

                      {firstMsg && (
                        <p style={{
                          fontFamily: serif,
                          fontStyle: 'italic',
                          fontSize: '19px',
                          color: '#f0eaff',
                          lineHeight: 1.6,
                          marginBottom: '16px',
                        }}>
                          "{firstMsg.content}"
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => setExpandedPost(isExpanded ? null : thread.id)}
                        className="flex items-center gap-2"
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: isExpanded ? '#f0eaff' : '#c3b3ff',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        <span style={{
                          display: 'inline-block',
                          transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                        }}>→</span>
                        {isExpanded ? 'hide their post' : 'read their post'}
                      </button>
                    </div>

                    {/* Their post expanded */}
                    {isExpanded && senderPost && (
                      <div
                        className="rounded-xl mx-4 mb-4 px-4 py-4"
                        style={{ background: '#160f24', border: '1px solid #3a2b58' }}
                      >
                        <p style={{
                          fontFamily: serif,
                          fontStyle: 'italic',
                          fontSize: '18px',
                          color: '#f0eaff',
                          lineHeight: 1.5,
                          marginBottom: '10px',
                        }}>
                          {senderPost.headline}
                        </p>
                        <p style={{
                          fontFamily: serif,
                          fontSize: '15px',
                          color: '#c8b8e8',
                          lineHeight: 1.7,
                          marginBottom: '12px',
                          display: '-webkit-box',
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: 'vertical' as const,
                          overflow: 'hidden',
                        }}>
                          {senderPost.post_body}
                        </p>
                        {senderPost.tag_names?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {senderPost.tag_names.map((tag: string) => (
                              <span
                                key={tag}
                                className="font-mono text-[10px] rounded-full px-2.5 py-0.5"
                                style={{ border: '1px solid #3a2b58', color: '#9b85e8' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 px-5 pb-5">
                      <button
                        type="button"
                        onClick={() => handleDecline(thread.id)}
                        disabled={acting === thread.id}
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '10px 18px',
                          borderRadius: '20px',
                          border: '1px solid #4a3b6a',
                          background: 'transparent',
                          color: '#c8b8e8',
                          cursor: 'pointer',
                        }}
                      >
                        decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(thread.id)}
                        disabled={acting === thread.id}
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          padding: '10px 18px',
                          borderRadius: '20px',
                          border: 'none',
                          background: '#6d4bc3',
                          color: '#ffffff',
                          cursor: 'pointer',
                          flex: 1,
                        }}
                      >
                        {acting === thread.id ? 'opening...' : 'open thread →'}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Outgoing — you replied, waiting */}
        {outgoingPending.length > 0 && (
          <div className="pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] px-5 mb-3" style={{ color: '#c3b3ff' }}>
              waiting for reply — {outgoingPending.length}
            </p>
            <div className="flex flex-col gap-3 px-4">
              {outgoingPending.map(thread => {
                const firstMsg = thread.messages?.[0]
                const theirPost = thread.post

                return (
                  <div
                    key={thread.id}
                    className="rounded-2xl"
                    style={{ background: '#1a1530', border: '1px solid #2a1f42', padding: '18px 20px' }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="font-mono text-[10px] rounded-full"
                        style={{
                          padding: '3px 10px',
                          background: 'transparent',
                          border: '1px solid #4a3b6a',
                          color: '#c3b3ff',
                          letterSpacing: '0.06em',
                        }}
                      >
                        you replied
                      </span>
                      <span className="font-mono text-[10px]" style={{ color: '#9b85e8' }}>
                        {timeAgo(thread.created_at)}
                      </span>
                    </div>

                    {theirPost && (
                      <p style={{
                        fontFamily: serif,
                        fontStyle: 'italic',
                        fontSize: '15px',
                        color: '#c8b8e8',
                        lineHeight: 1.5,
                        marginBottom: '10px',
                      }}>
                        re: {theirPost.headline}
                      </p>
                    )}

                    {firstMsg && (
                      <p style={{
                        fontFamily: serif,
                        fontSize: '17px',
                        color: '#f0eaff',
                        lineHeight: 1.65,
                        borderLeft: '2px solid #6d4bc3',
                        paddingLeft: '14px',
                        marginBottom: '14px',
                      }}>
                        "{firstMsg.content}"
                      </p>
                    )}

                    <p style={{
                      fontFamily: serif,
                      fontStyle: 'italic',
                      fontSize: '14px',
                      color: '#9b85e8',
                    }}>
                      waiting for them to open it.
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Open threads */}
        {open.length > 0 && (
          <div className="pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] px-5 mb-3" style={{ color: '#c3b3ff' }}>
              open threads — {open.length}
            </p>
            <div className="flex flex-col gap-2 px-4">
              {open.map(thread => {
                const lastMsg = thread.messages?.[thread.messages.length - 1]
                const otherPerson = thread.initiator_id === userId
                  ? thread.recipient
                  : thread.initiator
                const unread = isThreadUnread(thread)

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => router.push(`/thread/${thread.id}`)}
                    className="rounded-2xl text-left w-full"
                    style={{
                      background: unread ? '#1e1a2e' : '#1e1530',
                      border: `1px solid ${unread ? '#4a3b6a' : '#2e2040'}`,
                      padding: '16px 20px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6d4bc3' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = unread ? '#4a3b6a' : '#2e2040' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {unread && (
                          <div style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: '#c8922a',
                            flexShrink: 0,
                          }} />
                        )}
                        <span
                          className="font-mono text-[11px]"
                          style={{ color: unread ? '#f0eaff' : '#c3b3ff', fontWeight: unread ? 700 : 400 }}
                        >
                          {otherPerson?.handle || otherPerson?.display_name || 'someone'}
                        </span>
                      </div>
                      {lastMsg && (
                        <span className="font-mono text-[10px]" style={{ color: '#9b85e8' }}>
                          {timeAgo(lastMsg.created_at)}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p style={{
                        fontFamily: serif,
                        fontSize: '15px',
                        color: unread ? '#e0d0f8' : '#c8b8e8',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical' as const,
                        overflow: 'hidden',
                      }}>
                        {lastMsg.content}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ height: '80px' }} />
      </div>
    </main>
  )
}
