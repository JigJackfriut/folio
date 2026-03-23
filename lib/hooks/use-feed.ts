'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getFeedPosts } from '@/lib/queries/posts'
import { updateCrossedTags } from '@/lib/mutations/profiles'
import type { PostWithSignal } from '@/lib/types'

const PAGE_SIZE = 50

export function useFeed() {
  const [allPosts, setAllPosts] = useState<PostWithSignal[]>([])
  const [crossedTags, setCrossedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const supabase = createClient()

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const [{ data: profile }, data] = await Promise.all([
        supabase
          .from('profiles')
          .select('crossed_tags')
          .eq('id', user.id)
          .single(),
        getFeedPosts(supabase, user.id, PAGE_SIZE, 0),
      ])

      setCrossedTags(profile?.crossed_tags ?? [])
      setAllPosts(data)
      setOffset(PAGE_SIZE)
      setHasMore(data.length === PAGE_SIZE)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const data = await getFeedPosts(supabase, user.id, PAGE_SIZE, offset)
      setAllPosts(prev => [...prev, ...data])
      setOffset(prev => prev + PAGE_SIZE)
      setHasMore(data.length === PAGE_SIZE)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoadingMore(false)
    }
  }, [supabase, offset, loadingMore, hasMore])

  useEffect(() => {
    void load()
  }, [load])

  const toggleCrossedTag = useCallback(async (tag: string) => {
    const previous = crossedTags
    const updated = previous.includes(tag)
      ? previous.filter(t => t !== tag)
      : [...previous, tag]

    setCrossedTags(updated)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      await updateCrossedTags(supabase, user.id, updated)
    } catch (err: unknown) {
      setCrossedTags(previous)
      setError(err instanceof Error ? err.message : 'Failed to save filters')
    }
  }, [supabase, crossedTags])

  const posts = useMemo(() => {
    if (crossedTags.length === 0) return allPosts

    return allPosts.filter(post =>
      !(post.tag_names ?? []).some(tag => crossedTags.includes(tag))
    )
  }, [allPosts, crossedTags])

  return {
    posts,
    allPosts,
    crossedTags,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh: load,
    loadMore,
    toggleCrossedTag,
  }
}
