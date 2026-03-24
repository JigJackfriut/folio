'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getPostById } from '@/lib/queries/posts'
import { logInteraction } from '@/lib/mutations/interactions'
import type { PostWithAuthor } from '@/lib/types'

function timeAgo(date: string): string {
  const hours = Math.floor((Date.now() - new Date(date).getTime()) / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const supabase = createClient()

  const [post, setPost] = useState<PostWithAuthor | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [reply, setReply] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isOwnPost, setIsOwnPost] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      setCurrentUserId(user.id)

      const data = await getPostById(supabase, id)
      if (!data) { setNotFound(true); setLoading(false); return }

      setPost(data as PostWithAuthor)
      setIsOwnPost(data.author_id === user.id)
      setLoading(false)

      logInteraction(supabase, user.id, id, 'view')
    }
    load()
  }, [id])

  const handleSendReply = async () => {
    if (!reply.trim() || !post || !currentUserId) return
    setSending(true)
    setError('')

    try {
      const { data: thread, error: threadErr } = await supabase
        .from('threads')
        .insert({
          post_id: post.id,
          initiator_id: currentUserId,
          recipient_id: post.author_id,
          status: 'pending',
        })
        .select('id')
        .single()

      if (threadErr) throw threadErr

      const { error: msgErr } = await supabase
        .from('messages')
        .insert({
          thread_id: thread.id,
          sender_id: currentUserId,
          content: reply.trim(),
        })

      if (msgErr) throw msgErr

      logInteraction(supabase, currentUserId, post.id, 'reply')
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div
          className="w-5 h-5 rounded-full border-2 animate-spin"
          style={{ borderColor: '#3a2b58', borderTopColor: '#6d4bc3' }}
        />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <p style={{
          fontFamily: 'EB Garamond, Georgia, serif',
          fontStyle: 'italic',
          fontSize: '22px',
          color: '#5a4b78',
          marginBottom: '8px',
        }}>
          this post no longer exists.
        </p>
        <button
          type="button"
          onClick={() => router.push('/feed')}
          className="font-mono text-[11px] uppercase tracking-widest mt-4"
          style={{ color: '#6d4bc3', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          ← back to feed
        </button>
      </div>
    )
  }

  if (!post) return null

  return (
    <main className="min-h-screen">
      <div className="w-full max-w-xl mx-auto">

        {/* Back */}
        <div className="px-5 pt-14 pb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="font-mono text-[11px] uppercase tracking-widest transition-colors"
            style={{ color: '#6a5a88', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ← back
          </button>
        </div>

        <div className="px-5">

          {/* Meta — no handle shown */}
          <p className="font-mono text-[10px] mb-5" style={{ color: '#4a3b68' }}>
            {[
              post.author?.age ? `${post.author.age}` : null,
              post.author?.location_display ?? null,
              timeAgo(post.created_at),
            ].filter(Boolean).join(' · ')}
          </p>

          {/* Headline */}
          <div
            className="mb-5"
            style={{ borderLeft: '2px solid #4a3b6a', paddingLeft: '16px' }}
          >
            <p style={{
              fontFamily: 'EB Garamond, Georgia, serif',
              fontStyle: 'italic',
              fontSize: '24px',
              color: '#f0eaff',
              lineHeight: 1.4,
            }}>
              {post.headline}
            </p>
          </div>

          {/* Body */}
          <p
            className="mb-6"
            style={{
              fontFamily: 'EB Garamond, Georgia, serif',
              fontSize: '17px',
              color: '#c8b8e8',
              lineHeight: 1.75,
            }}
          >
            {post.post_body}
          </p>

          {/* Tags */}
          {post.tag_names && post.tag_names.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tag_names.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[10px] rounded-full px-2.5 py-1"
                  style={{ border: '1px solid #2e2040', color: '#7a6b9a' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Divider */}
          <div style={{ height: '1px', background: '#2a1f42', marginBottom: '28px' }} />

          {/* Reply section */}
          {isOwnPost ? (
            <div
              className="rounded-2xl px-5 py-4 text-center"
              style={{ background: '#1e1530', border: '1px solid #2e2040' }}
            >
              <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: '#4a3b68' }}>
                this is your post
              </p>
            </div>
          ) : sent ? (
            <div
              className="rounded-2xl px-5 py-8 text-center"
              style={{ background: '#1a2a1a', border: '1px solid #2a4a2a' }}
            >
              <p style={{
                fontFamily: 'EB Garamond, Georgia, serif',
                fontStyle: 'italic',
                fontSize: '22px',
                color: '#f0eaff',
                marginBottom: '8px',
              }}>
                sent.
              </p>
              <p
                className="font-mono text-[10px] leading-relaxed"
                style={{ color: '#4a6a4a' }}
              >
                your name stays hidden until they choose to open it.
              </p>
              <button
                type="button"
                onClick={() => router.push('/feed')}
                className="font-mono text-[10px] uppercase tracking-widest mt-6 block mx-auto"
                style={{ color: '#6a5a88', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← back to feed
              </button>
            </div>
          ) : (
            <div>
              <p
                className="font-mono text-[10px] uppercase tracking-widest mb-1"
                style={{ color: '#6a5a88' }}
              >
                send a reply
              </p>
              <p style={{
                fontFamily: 'EB Garamond, Georgia, serif',
                fontStyle: 'italic',
                fontSize: '14px',
                color: '#4a3b68',
                marginBottom: '14px',
              }}>
                your name stays hidden until they open the thread.
              </p>
              <textarea
                value={reply}
                onChange={e => setReply(e.target.value)}
                placeholder="say something worth opening."
                rows={5}
                className="w-full outline-none resize-none rounded-xl"
                style={{
                  background: '#1e1530',
                  border: '1px solid #2e2040',
                  padding: '14px 16px',
                  fontFamily: 'EB Garamond, Georgia, serif',
                  fontSize: '16px',
                  color: '#f0eaff',
                  lineHeight: 1.65,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#4a3b6a' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#2e2040' }}
              />

              {error && (
                <p className="font-mono text-[10px] mt-2" style={{ color: '#f87171' }}>
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between mt-3">
                <p className="font-mono text-[10px]" style={{ color: '#3a2b58' }}>
                  {reply.length > 0 && `${reply.length} chars`}
                </p>
                <button
                  type="button"
                  onClick={handleSendReply}
                  disabled={!reply.trim() || sending}
                  className="font-mono text-[11px] font-bold uppercase tracking-widest rounded-full transition-all"
                  style={{
                    padding: '10px 24px',
                    background: reply.trim() && !sending ? '#6d4bc3' : 'rgba(109,75,195,0.2)',
                    color: reply.trim() && !sending ? '#ffffff' : '#4a3b68',
                    border: 'none',
                    cursor: reply.trim() && !sending ? 'pointer' : 'not-allowed',
                  }}
                >
                  {sending ? 'sending...' : 'send →'}
                </button>
              </div>
            </div>
          )}

        </div>

        <div style={{ height: '80px' }} />
      </div>
    </main>
  )
}
