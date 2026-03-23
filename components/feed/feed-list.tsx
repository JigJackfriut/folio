'use client'

import { useEffect, useRef } from 'react'
import { PostCard } from './post-card'
import type { PostWithSignal } from '@/lib/types'

interface Props {
  posts: PostWithSignal[]
  crossedTags: string[]
  loadingMore: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function FeedList({ posts, crossedTags, loadingMore, hasMore, onLoadMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) onLoadMore() },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [onLoadMore])

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-8 text-center">
        <p
          style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '20px',
            color: '#5a4b78',
            marginBottom: '8px',
          }}
        >
          nothing here yet.
        </p>
        <p
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: '#3a2b58' }}
        >
          be the first to write a post
        </p>
      </div>
    )
  }

  const primary    = posts.filter(p => p.signal !== 'unexpected')
  const unexpected = posts.filter(p => p.signal === 'unexpected')

  return (
    <div className="px-4 pt-4 flex flex-col gap-3 pb-8">
      {primary.map(post => (
        <PostCard key={post.id} post={post} crossedTags={crossedTags} />
      ))}

      {unexpected.length > 0 && (
        <>
          <div className="flex items-center gap-3 py-2">
            <div className="flex-1 h-px" style={{ background: '#2a1f42' }} />
            <span
              className="font-mono text-[9px] uppercase tracking-[0.14em]"
              style={{ color: '#3a2b58' }}
            >
              different frequency
            </span>
            <div className="flex-1 h-px" style={{ background: '#2a1f42' }} />
          </div>
          {unexpected.map(post => (
            <PostCard key={post.id} post={post} crossedTags={crossedTags} />
          ))}
        </>
      )}

      <div ref={sentinelRef} className="h-4" />

      {loadingMore && (
        <div className="flex justify-center py-6">
          <div
            className="w-4 h-4 rounded-full border-2 animate-spin"
            style={{ borderColor: '#3a2b58', borderTopColor: '#6d4bc3' }}
          />
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p
          className="text-center font-mono text-[10px] uppercase tracking-widest py-8"
          style={{ color: '#2e2040' }}
        >
          you've seen everything
        </p>
      )}
    </div>
  )
}

