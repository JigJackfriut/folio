'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getPostsForFeed } from '@/lib/queries/posts'
import { getCurrentProfile, getProfileTags } from '@/lib/queries/profiles'
import { updateCrossedTags } from '@/lib/mutations/profiles'
import { rankAndSignalPosts } from '@/lib/matching/score'
import type { PostWithSignal } from '@/lib/types'

export function useFeed() {
  const [posts, setPosts] = useState<PostWithSignal[]>([])
  const [crossedTags, setCrossedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const [profile, profileTags] = await Promise.all([
        getCurrentProfile(supabase, user.id),
        getProfileTags(supabase, user.id),
      ])

      if (!profile) throw new Error('Profile not found')

      const saved = profile.crossed_tags ?? []
      setCrossedTags(saved)

      const publicTags = profileTags
        .filter(t => t.tier === 'public')
        .map(t => t.tag_name)

      const echoTags = profileTags
        .filter(t => t.tier === 'echo')
        .map(t => t.tag_name)

      const raw = await getPostsForFeed(supabase, user.id, saved)

      const ranked = rankAndSignalPosts(raw, {
        userId: user.id,
        intentType: profile.intent_type,
        connectionPref: profile.connection_pref ?? 'both',
        publicTags,
        echoTags,
      })

      setPosts(ranked)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const toggleCrossedTag = useCallback(async (tag: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updated = crossedTags.includes(tag)
      ? crossedTags.filter(t => t !== tag)
      : [...crossedTags, tag]

    setCrossedTags(updated)

    // Filter posts locally — instant UI update
    setPosts(prev =>
      prev.filter(post =>
        !(post.tag_names ?? []).some(t => updated.includes(t))
      )
    )

    // Persist to Supabase in background
    await updateCrossedTags(supabase, user.id, updated)
  }, [crossedTags])

  return { posts, crossedTags, loading, error, refresh: load, toggleCrossedTag }
}
