'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const serif = 'EB Garamond, Georgia, serif'

export default function WritePage() {
  const supabase = createClient()
  const router = useRouter()

  const [headline, setHeadline] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('posts')
        .select('id, headline, post_body')
        .eq('author_id', user.id)
        .eq('status', 'active')
        .single()

      if (data) {
        setPostId(data.id)
        setHeadline(data.headline ?? '')
        setBody(data.post_body ?? '')
      }

      setLoading(false)
    }
    load()
  }, [])

  const handleSave = async () => {
    if (!headline.trim()) return
    setSaving(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      if (postId) {
        const { error } = await supabase
          .from('posts')
          .update({
            headline: headline.trim(),
            post_body: body.trim(),
          })
          .eq('id', postId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('posts')
          .insert({
            author_id: user.id,
            headline: headline.trim(),
            post_body: body.trim(),
            seeking: 'something_real',
            status: 'active',
          })

        if (error) throw error
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
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

        <div className="px-5 pt-14 pb-4" style={{ borderBottom: '1px solid #2a1f42' }}>
          <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '30px', color: '#f0eaff' }}>
            {postId ? 'edit your post.' : 'write your post.'}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest mt-1" style={{ color: '#8a7aaa' }}>
            {postId ? 'changes save immediately' : 'this is what people see in the feed'}
          </p>
        </div>

        <div className="px-5 pt-8">

          {/* Headline */}
          <div className="mb-8">
            <div className="flex items-end justify-between mb-2">
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: '#8a7aaa' }}>
                headline
              </p>
              <p className="font-mono text-[10px]"
                style={{ color: headline.length > 100 ? '#c8922a' : '#5a4b78' }}>
                {headline.length}/120
              </p>
            </div>
            <input
              type="text"
              value={headline}
              onChange={e => setHeadline(e.target.value)}
              maxLength={120}
              placeholder="looking for someone who..."
              className="w-full bg-transparent outline-none"
              style={{
                fontFamily: serif,
                fontStyle: 'italic',
                fontSize: '22px',
                color: '#f0eaff',
                borderBottom: '1px solid #3a2b58',
                paddingBottom: '10px',
                lineHeight: 1.4,
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderBottomColor = '#6d4bc3' }}
              onBlur={e => { e.currentTarget.style.borderBottomColor = '#3a2b58' }}
            />
          </div>

          {/* Body */}
          <div className="mb-8">
            <div className="flex items-end justify-between mb-2">
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: '#8a7aaa' }}>
                your post
              </p>
              <p className="font-mono text-[10px]" style={{ color: '#5a4b78' }}>
                {body.length}/2000
              </p>
            </div>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              maxLength={2000}
              rows={8}
              placeholder="tell them about yourself. write like a person."
              className="w-full bg-transparent outline-none resize-none"
              style={{
                fontFamily: serif,
                fontSize: '17px',
                color: '#c8b8e8',
                lineHeight: 1.75,
                borderBottom: '1px solid #3a2b58',
                paddingBottom: '10px',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => { e.currentTarget.style.borderBottomColor = '#6d4bc3' }}
              onBlur={e => { e.currentTarget.style.borderBottomColor = '#3a2b58' }}
            />
          </div>

          {error && (
            <p className="font-mono text-[10px] mb-4" style={{ color: '#f87171' }}>{error}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: '#8a7aaa', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              ← back
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!headline.trim() || saving}
              className="font-mono text-[10px] font-bold uppercase tracking-widest rounded-full transition-all"
              style={{
                padding: '10px 28px',
                background: saved ? '#2a4a2a' : headline.trim() ? '#6d4bc3' : 'rgba(109,75,195,0.2)',
                color: saved ? '#6ee7a0' : headline.trim() ? '#fff' : '#4a3b68',
                border: saved ? '1px solid #2a5a2a' : 'none',
                cursor: headline.trim() ? 'pointer' : 'not-allowed',
              }}
            >
              {saving ? 'saving...' : saved ? 'saved ✓' : 'save →'}
            </button>
          </div>
        </div>

        <div style={{ height: '80px' }} />
      </div>
    </main>
  )
}
