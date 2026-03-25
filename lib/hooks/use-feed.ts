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
  const [includedTags, setIncludedTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const supabase = createClient()

  const load = useCallback(async (
    crossed: string[] = [],
    included: string[] = []
  ) => {
    setLoading(true)
    setError(null)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('profiles')
        .select('crossed_tags')
        .eq('id', user.id)
        .single()

      const saved = profile?.crossed_tags ?? []
      setCrossedTags(saved)

      const data = await getFeedPosts(supabase, user.id, PAGE_SIZE, 0, included, saved)
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
      const data = await getFeedPosts(supabase, user.id, PAGE_SIZE, offset, includedTags, crossedTags)
      setPosts(prev => [...prev, ...data])
      setOffset(prev => prev + PAGE_SIZE)
      setHasMore(data.length === PAGE_SIZE)
    } finally {
      setLoadingMore(false)
    }
  }, [offset, loadingMore, hasMore, includedTags, crossedTags])

  useEffect(() => { load() }, [load])

  const toggleCrossedTag = useCallback(async (tag: string) => {
    const updated = crossedTags.includes(tag)
      ? crossedTags.filter(t => t !== tag)
      : [...crossedTags, tag]
    setCrossedTags(updated)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) await updateCrossedTags(supabase, user.id, updated)
    // Reload feed with new filters server-side
    await load(updated, includedTags)
  }, [crossedTags, includedTags, load])

  const toggleIncludedTag = useCallback(async (tag: string) => {
    const updated = includedTags.includes(tag)
      ? includedTags.filter(t => t !== tag)
      : [...includedTags, tag]
    setIncludedTags(updated)
    await load(crossedTags, updated)
  }, [includedTags, crossedTags, load])

  return {
    posts,
    crossedTags,
    includedTags,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh: () => load(crossedTags, includedTags),
    loadMore,
    toggleCrossedTag,
    toggleIncludedTag,
  }
}
