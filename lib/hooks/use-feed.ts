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

  const load = useCallback(async () => {
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
    const updated = crossedTags.includes(tag)
      ? crossedTags.filter(t => t !== tag)
      : [...crossedTags, tag]
    setCrossedTags(updated)
    await updateCrossedTags(supabase, (await supabase.auth.getUser()).data.user!.id, updated)
  }, [crossedTags])

  const toggleIncludedTag = useCallback((tag: string) => {
    setIncludedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }, [])

  // Apply both filters client-side
  const filteredPosts = posts.filter(post => {
    const tags = post.tag_names ?? []
    if (crossedTags.some(t => tags.includes(t))) return false
    if (includedTags.length > 0 && !includedTags.some(t => tags.includes(t))) return false
    return true
  })

  return {
    posts: filteredPosts,
    crossedTags,
    includedTags,
    loading,
    loadingMore,
    error,
    hasMore,
    refresh: load,
    loadMore,
    toggleCrossedTag,
    toggleIncludedTag,
  }
}
