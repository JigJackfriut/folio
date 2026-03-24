'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getThreadById } from '@/lib/queries/threads'
import { sendMessage, revealEcho } from '@/lib/mutations/threads'

const serif = 'EB Garamond, Georgia, serif'

function timeAgo(date: string): string {
  const hours = Math.floor((Date.now() - new Date(date).getTime()) / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function ThreadPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [thread, setThread] = useState<any>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [revealing, setRevealing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)

      const data = await getThreadById(supabase, id)
      if (!data) { setLoading(false); return }
      setThread(data)
      setLoading(false)
    }
    load()
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread?.messages])

  useEffect(() => {
    const channel = supabase
      .channel(`thread-${id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `thread_id=eq.${id}`,
      }, payload => {
        setThread((prev: any) => prev ? {
          ...prev,
          messages: [...(prev.messages ?? []), payload.new],
        } : prev)
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [id])

  const handleSend = async () => {
    if (!message.trim() || !userId || sending) return
    setSending(true)
    setError('')

    const content = message.trim()
    setMessage('')

    try {
      await sendMessage(supabase, id, userId, content)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send')
      setMessage(content)
    } finally {
      setSending(false)
      inputRef.current?.focus()
    }
  }

  const handleReveal = async () => {
    if (revealing) return
    setRevealing(true)
    try {
      await revealEcho(supabase, id)
      setThread((prev: any) => prev ? { ...prev, echo_revealed: true } : prev)
    } finally {
      setRevealing(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
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

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '20px', color: '#c8b8e8' }}>
          thread not found.
        </p>
        <button
          type="button"
          onClick={() => router.push('/inbox')}
          className="font-mono text-[11px] uppercase tracking-widest mt-4"
          style={{ color: '#9b85e8', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← back to inbox
        </button>
      </div>
    )
  }

  const otherPerson = thread.initiator_id === userId
    ? thread.recipient
    : thread.initiator

  const messages = [...(thread.messages ?? [])].sort(
    (a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const hasEchoTags = thread.echo_tags && thread.echo_tags.length > 0
  const echoRevealed = thread.echo_revealed

  return (
    <main className="min-h-screen flex flex-col">
      <div className="w-full max-w-xl mx-auto flex flex-col flex-1">

        {/* Header */}
        <div
          className="flex-shrink-0 px-5 pt-14 pb-4"
          style={{ borderBottom: '1px solid #2a1f42' }}
        >
          <button
            type="button"
            onClick={() => router.push('/inbox')}
            className="font-mono text-[11px] uppercase tracking-widest mb-3 block"
            style={{ color: '#9b85e8', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← inbox
          </button>
          <p style={{
            fontFamily: serif,
            fontStyle: 'italic',
            fontSize: '22px',
            color: '#f0eaff',
            marginBottom: '4px',
          }}>
            {otherPerson?.handle || otherPerson?.display_name || 'someone'}
          </p>
          {thread.post?.headline && (
            <p style={{
              fontFamily: serif,
              fontStyle: 'italic',
              fontSize: '13px',
              color: '#8a7aaa',
            }}>
              re: {thread.post.headline}
            </p>
          )}
        </div>

        {/* Echo reveal banner */}
        {hasEchoTags && (
          <div
            className="flex-shrink-0 mx-4 mt-4 rounded-2xl overflow-hidden"
            style={{
              background: echoRevealed
                ? 'rgba(200,146,42,0.08)'
                : 'rgba(109,75,195,0.08)',
              border: `1px solid ${echoRevealed
                ? 'rgba(200,146,42,0.3)'
                : 'rgba(109,75,195,0.25)'}`,
            }}
          >
            {echoRevealed ? (
              <div className="px-5 py-4">
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.14em] mb-2"
                  style={{ color: '#c8922a' }}
                >
                  you share something
                </p>
                <div className="flex flex-wrap gap-2">
                  {thread.echo_tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="font-mono text-[10px] rounded-full px-3 py-1"
                      style={{
                        background: 'rgba(200,146,42,0.12)',
                        border: '1px solid rgba(200,146,42,0.3)',
                        color: '#c8922a',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleReveal}
                disabled={revealing}
                className="w-full px-5 py-4 text-left"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1"
                  style={{ color: '#9b85e8' }}
                >
                  ◎ you share something hidden
                </p>
                <p style={{
                  fontFamily: serif,
                  fontStyle: 'italic',
                  fontSize: '14px',
                  color: '#c8b8e8',
                }}>
                  tap to reveal your echo tags — only visible here.
                </p>
              </button>
            )}
          </div>
        )}

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          style={{ minHeight: 0 }}
        >
          {messages.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <p style={{
                fontFamily: serif,
                fontStyle: 'italic',
                fontSize: '16px',
                color: '#6a5a88',
              }}>
                say something.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {messages.map((msg: any, i: number) => {
              const isMe = msg.sender_id === userId
              const prevMsg = messages[i - 1]
              const showTime = !prevMsg ||
                new Date(msg.created_at).getTime() -
                new Date(prevMsg.created_at).getTime() > 1000 * 60 * 15

              return (
                <div key={msg.id}>
                  {showTime && (
                    <p
                      className="text-center font-mono text-[9px] uppercase tracking-widest my-3"
                      style={{ color: '#6a5a88' }}
                    >
                      {timeAgo(msg.created_at)}
                    </p>
                  )}
                  <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      style={{
                        maxWidth: '78%',
                        padding: '10px 14px',
                        borderRadius: isMe
                          ? '18px 18px 4px 18px'
                          : '18px 18px 18px 4px',
                        background: isMe ? '#6d4bc3' : '#1e1530',
                        border: isMe ? 'none' : '1px solid #2e2040',
                      }}
                    >
                      <p style={{
                        fontFamily: serif,
                        fontSize: '16px',
                        color: isMe ? '#ffffff' : '#f0eaff',
                        lineHeight: 1.6,
                      }}>
                        {msg.content}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div ref={bottomRef} />
        </div>

        {/* Composer */}
        <div
          className="flex-shrink-0 px-4 py-3"
          style={{
            borderTop: '1px solid #2a1f42',
            background: 'rgba(27,19,40,0.95)',
            backdropFilter: 'blur(12px)',
            paddingBottom: 'calc(env(safe-area-inset-bottom) + 80px)',
          }}
        >
          {error && (
            <p className="font-mono text-[10px] mb-2" style={{ color: '#f87171' }}>
              {error}
            </p>
          )}
          <div className="flex items-end gap-3">
            <textarea
              ref={inputRef}
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="write something..."
              rows={1}
              className="flex-1 outline-none resize-none rounded-2xl"
              style={{
                background: '#1e1530',
                border: '1px solid #3a2b58',
                padding: '10px 14px',
                fontFamily: serif,
                fontSize: '16px',
                color: '#f0eaff',
                lineHeight: 1.5,
                maxHeight: '120px',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#6d4bc3' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#3a2b58' }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || sending}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: message.trim() ? '#6d4bc3' : '#2a1f42',
                border: 'none',
                cursor: message.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.15s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                stroke={message.trim() ? '#fff' : '#4a3b68'} strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
          <p
            className="font-mono text-[9px] mt-2 text-center"
            style={{ color: '#4a3b68' }}
          >
            enter to send · shift+enter for new line
          </p>
        </div>

      </div>
    </main>
  )
}
