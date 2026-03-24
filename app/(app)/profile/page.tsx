'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const serif = 'EB Garamond, Georgia, serif'

export default function ProfilePage() {
  const supabase = createClient()
  const router = useRouter()

  const [profile, setProfile] = useState<any>(null)
  const [post, setPost] = useState<any>(null)
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [hibernating, setHibernating] = useState(false)
  const [togglingHibernation, setTogglingHibernation] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [{ data: profileData }, { data: postData }, { data: tagData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('posts').select('*').eq('author_id', user.id).eq('status', 'active').single(),
        supabase.from('profile_tags').select('tag_name, tier').eq('profile_id', user.id),
      ])

      setProfile(profileData)
      setPost(postData)
      setTags(tagData ?? [])
      setHibernating(!!profileData?.hibernating_at)
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleHibernation = async () => {
    if (!profile) return
    setTogglingHibernation(true)
    const now = hibernating ? null : new Date().toISOString()

    const { error } = await supabase
      .from('profiles')
      .update({ hibernating_at: now })
      .eq('id', profile.id)

    if (!error) setHibernating(!hibernating)
    setTogglingHibernation(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-5 h-5 rounded-full border-2 animate-spin"
          style={{ borderColor: '#3a2b58', borderTopColor: '#6d4bc3' }} />
      </div>
    )
  }

  const publicTags = tags.filter(t => t.tier === 'public')
  const echoTags = tags.filter(t => t.tier === 'echo')

  return (
    <main className="min-h-screen">
      <div className="w-full max-w-xl mx-auto">

        {/* Header */}
        <div className="px-5 pt-14 pb-4" style={{ borderBottom: '1px solid #2a1f42' }}>
          <div className="flex items-start justify-between">
            <div>
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '30px', color: '#f0eaff' }}>
                {profile?.handle || profile?.display_name || 'you'}
              </p>
              <p className="font-mono text-[10px] mt-1" style={{ color: '#8a7aaa' }}>
                {[
                  profile?.age,
                  profile?.location_display,
                ].filter(Boolean).join(' · ')}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="font-mono text-[10px] uppercase tracking-widest mt-2"
              style={{ color: '#5a4b78', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              log out
            </button>
          </div>
        </div>

        <div className="px-5 pt-6 flex flex-col gap-5">

          {/* Your post */}
          <div
            className="rounded-2xl p-5"
            style={{ background: '#1e1530', border: '1px solid #2e2040' }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#8a7aaa' }}>
                your post
              </p>
              <button
                type="button"
                onClick={() => router.push('/write')}
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#9b85e8', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                edit →
              </button>
            </div>

            {post ? (
              <>
                <p style={{
                  fontFamily: serif, fontStyle: 'italic',
                  fontSize: '18px', color: '#f0eaff', lineHeight: 1.5, marginBottom: '10px',
                }}>
                  {post.headline}
                </p>
                <p style={{
                  fontFamily: serif, fontSize: '15px', color: '#c8b8e8',
                  lineHeight: 1.7,
                  display: '-webkit-box', WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                }}>
                  {post.post_body}
                </p>
              </>
            ) : (
              <button
                type="button"
                onClick={() => router.push('/write')}
                style={{
                  fontFamily: serif, fontStyle: 'italic',
                  fontSize: '16px', color: '#5a4b78',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                you haven't written a post yet. write one →
              </button>
            )}
          </div>

          {/* Public tags */}
          {publicTags.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{ background: '#1e1530', border: '1px solid #2e2040' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: '#8a7aaa' }}>
                public tags
              </p>
              <div className="flex flex-wrap gap-2">
                {publicTags.map(t => (
                  <span
                    key={t.tag_name}
                    className="font-mono text-[10px] rounded-full px-3 py-1"
                    style={{ border: '1px solid #3a2b58', color: '#c3b3ff', background: 'rgba(109,75,195,0.08)' }}
                  >
                    {t.tag_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Echo tags */}
          {echoTags.length > 0 && (
            <div
              className="rounded-2xl p-5"
              style={{ background: '#1e1530', border: '1px solid #2e2040' }}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8a7aaa' }}>
                echo tags
              </p>
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '13px', color: '#6a5a88', marginBottom: '12px' }}>
                hidden from everyone — revealed only inside a shared thread.
              </p>
              <div className="flex flex-wrap gap-2">
                {echoTags.map(t => (
                  <span
                    key={t.tag_name}
                    className="font-mono text-[10px] rounded-full px-3 py-1"
                    style={{ border: '1px solid rgba(200,146,42,0.3)', color: '#c8922a', background: 'rgba(200,146,42,0.08)' }}
                  >
                    {t.tag_name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hibernation */}
          <div
            className="rounded-2xl p-5"
            style={{ background: '#1e1530', border: '1px solid #2e2040' }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#8a7aaa' }}>
                  hibernation
                </p>
                <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '14px', color: '#c8b8e8', lineHeight: 1.6 }}>
                  {hibernating
                    ? 'your post is hidden from the feed. open threads stay open.'
                    : 'hide your post from the feed without losing your threads.'
                  }
                </p>
              </div>
              <button
                type="button"
                onClick={handleHibernation}
                disabled={togglingHibernation}
                className="flex-shrink-0 rounded-full transition-colors duration-200"
                style={{
                  width: '44px', height: '24px',
                  background: hibernating ? '#6d4bc3' : '#2a1f42',
                  border: 'none', cursor: 'pointer', position: 'relative',
                }}
              >
                <span
                  className="absolute rounded-full bg-white transition-all duration-200"
                  style={{
                    width: '18px', height: '18px',
                    top: '3px', left: hibernating ? '23px' : '3px',
                  }}
                />
              </button>
            </div>
          </div>

          {/* Danger zone — log out */}
          <div
            className="rounded-2xl p-5"
            style={{ background: '#1a1020', border: '1px solid #2a1f42' }}
          >
            <button
              type="button"
              onClick={handleLogout}
              className="w-full font-mono text-[11px] uppercase tracking-widest"
              style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              log out
            </button>
          </div>

        </div>

        <div style={{ height: '80px' }} />
      </div>
    </main>
  )
}
