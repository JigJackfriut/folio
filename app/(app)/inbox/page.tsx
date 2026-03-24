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

export default function InboxPage() {
  const supabase = createClient()
  const router = useRouter()

  const [threads, setThreads] = useState<any[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedPost, setExpandedPost] = useState<string | null>(null)
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const data = await getInboxData(supabase, user.id)
      setThreads(data)
      setLoading(false)
    }
    load()
  }, [])

  const pending = threads.filter(t =>
    t.status === 'pending' && t.recipient_id === userId
  )
  const open = threads.filter(t => t.status === 'open')

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
        <div
          className="px-5 pt-14 pb-4"
          style={{ borderBottom: '1px solid #2a1f42' }}
        >
          <p style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '30px',
            color: '#f0eaff',
          }}>
            inbox
          </p>
        </div>

        {threads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 px-8 text-center">
            <p style={{
              fontFamily: 'EB Garamond, Georgia, serif',
              fontStyle: 'italic',
              fontSize: '20px',
              color: '#5a4b78',
              marginBottom: '8px',
            }}>
              nothing yet.
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#3a2b58' }}>
              replies to your post will appear here
            </p>
          </div>
        )}

        {/* Reply requests */}
        {pending.length > 0 && (
          <div className="pt-5">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.14em] px-5 mb-3"
              style={{ color: '#5a4b78' }}
            >
              reply requests — {pending.length}
            </p>

            <div className="flex flex-col gap-3 px-4">
              {pending.map(thread => {
                const firstMsg = thread.messages?.[0]
                const isExpanded = expandedPost === thread.id
                const senderPost = thread.post

                return (
                  <div
                    key={thread.id}
                    className="rounded-2xl overflow-hidden"
                    style={{ background: '#1e1530', border: '1px solid #2e2040' }}
                  >
                    {/* Message */}
                    <div className="px-5 pt-5 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span
                          className="font-mono text-[10px] uppercase tracking-widest"
                          style={{ color: '#5a4b78' }}
                        >
                          anonymous
                        </span>
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: '#3a2b58' }}
                        >
                          {timeAgo(thread.created_at)}
                        </span>
                      </div>

                      {firstMsg && (
                        <p style={{
                          fontFamily: 'EB Garamond, Georgia, serif',
                          fontStyle: 'italic',
                          fontSize: '17px',
                          color: '#e0d0f8',
                          lineHeight: 1.6,
                          marginBottom: '14px',
                        }}>
                          "{firstMsg.content}"
                        </p>
                      )}

                      {/* Toggle their post */}
                      <button
                        type="button"
                        onClick={() => setExpandedPost(isExpanded ? null : thread.id)}
                        className="font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                        style={{
                          color: isExpanded ? '#9b85e8' : '#5a4b78',
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
                        }}>
                          →
                        </span>
                        {isExpanded ? 'hide their post' : 'read their post'}
                      </button>
                    </div>

                    {/* Their post — expanded */}
                    {isExpanded && senderPost && (
                      <div
                        className="px-5 py-4 mx-4 mb-4 rounded-xl"
                        style={{ background: '#160f24', border: '1px solid #2a1f42' }}
                      >
                        <p style={{
                          fontFamily: 'EB Garamond, Georgia, serif',
                          fontStyle: 'italic',
                          fontSize: '17px',
                          color: '#f0eaff',
                          lineHeight: 1.5,
                          marginBottom: '10px',
                        }}>
                          {senderPost.headline}
                        </p>
                        <p style={{
                          fontFamily: 'EB Garamond, Georgia, serif',
                          fontSize: '14px',
                          color: '#9080b0',
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
                                className="font-mono text-[9px] rounded-full px-2 py-0.5"
                                style={{ border: '1px solid #2a1f42', color: '#5a4b78' }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions — always visible */}
                    <div
                      className="flex gap-2 px-5 pb-5"
                    >
                      <button
                        type="button"
                        onClick={() => handleDecline(thread.id)}
                        disabled={acting === thread.id}
                        className="font-mono text-[10px] uppercase tracking-widest rounded-full transition-all"
                        style={{
                          padding: '8px 18px',
                          background: 'transparent',
                          border: '1px solid #3a2b58',
                          color: '#5a4b78',
                          cursor: 'pointer',
                        }}
                      >
                        decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAccept(thread.id)}
                        disabled={acting === thread.id}
                        className="font-mono text-[10px] uppercase tracking-widest rounded-full transition-all flex-1"
                        style={{
                          padding: '8px 18px',
                          background: '#6d4bc3',
                          border: 'none',
                          color: '#fff',
                          cursor: 'pointer',
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

        {/* Open threads */}
        {open.length > 0 && (
          <div className="pt-6">
            <p
              className="font-mono text-[9px] uppercase tracking-[0.14em] px-5 mb-3"
              style={{ color: '#5a4b78' }}
            >
              open threads — {open.length}
            </p>

            <div className="flex flex-col gap-2 px-4">
              {open.map(thread => {
                const lastMsg = thread.messages?.[thread.messages.length - 1]
                const otherPerson = thread.initiator_id === userId
                  ? thread.recipient
                  : thread.initiator

                return (
                  <button
                    key={thread.id}
                    type="button"
                    onClick={() => router.push(`/thread/${thread.id}`)}
                    className="rounded-2xl text-left transition-colors w-full"
                    style={{
                      background: '#1e1530',
                      border: '1px solid #2e2040',
                      padding: '16px 20px',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#4a3b6a' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2040' }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: '#9b85e8' }}
                      >
                        {otherPerson?.handle || otherPerson?.display_name || 'someone'}
                      </span>
                      {lastMsg && (
                        <span
                          className="font-mono text-[10px]"
                          style={{ color: '#3a2b58' }}
                        >
                          {timeAgo(lastMsg.created_at)}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p style={{
                        fontFamily: 'EB Garamond, Georgia, serif',
                        fontSize: '14px',
                        color: '#7060a0',
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
