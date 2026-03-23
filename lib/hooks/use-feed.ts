'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getFeedPosts } from '@/lib/queries/posts'
import { updateCrossedTags } from '@/lib/mutations/profiles'
import type { PostWithSignal } from '@/lib/types'

const PAGE_SIZE = 50

export function useFeed() {
  const [posts, setPosts] = useState<PostWithSignal[]>([])
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

      const data = await getFeedPosts(supabase, user.id, PAGE_SIZE, 0)
      setPosts(data)
      setOffset(PAGE_SIZE)
      setHasMore(data.length === PAGE_SIZE)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const data = await getFeedPosts(supabase, user.id, PAGE_SIZE, offset)
      setPosts(prev => [...prev, ...data])
      setOffset(prev => prev + PAGE_SIZE)
      setHasMore(data.length === PAGE_SIZE)
    } finally {
      setLoadingMore(false)
    }
  }, [offset, loadingMore, hasMore])

  useEffect(() => { load() }, [load])

  const toggleCrossedTag = useCallback(async (tag: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const updated = crossedTags.includes(tag)
      ? crossedTags.filter(t => t !== tag)
      : [...crossedTags, tag]

    setCrossedTags(updated)

    // instant local filter
    setPosts(prev =>
      prev.filter(post =>
        !(post.tag_names ?? []).some(t => updated.includes(t))
      )
    )

    await updateCrossedTags(supabase, user.id, updated)
  }, [crossedTags])

  return {
    posts,
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
