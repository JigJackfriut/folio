'use client'

import { useMemo } from 'react'
import type { PostWithSignal } from '@/lib/types'

interface Props {
  posts: PostWithSignal[]
  crossedTags: string[]
  onToggle: (tag: string) => void
}

export function FilterBar({ posts, crossedTags, onToggle }: Props) {
  const allTags = useMemo(() => {
    const counts = new Map<string, number>()
    posts.forEach(post => {
      post.tag_names.forEach(tag => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      })
    })
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([tag]) => tag)
  }, [posts])

  if (allTags.length === 0) return null

  return (
    <div
      className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide"
      style={{ borderBottom: '1px solid #2a1f42' }}
    >
      {allTags.map(tag => {
        const crossed = crossedTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className="flex-shrink-0 font-mono transition-all"
            style={{
              fontSize: '10px',
              padding: '3px 10px',
              borderRadius: '20px',
              border: `1px solid ${crossed ? '#5a2a2a' : '#3a2b58'}`,
              background: crossed ? 'rgba(90,42,42,0.2)' : 'transparent',
              color: crossed ? '#7a4040' : '#5a4b78',
              textDecoration: crossed ? 'line-through' : 'none',
              letterSpacing: '0.04em',
              cursor: 'pointer',
            }}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
