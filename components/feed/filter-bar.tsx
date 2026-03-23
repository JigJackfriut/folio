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
      className="flex gap-2 overflow-x-auto px-5 py-3 scrollbar-hide"
      style={{ borderBottom: '1px solid #2a1f42' }}
    >
      {allTags.map(tag => {
        const crossed = crossedTags.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggle(tag)}
            className="flex-shrink-0 font-mono transition-all duration-150"
            style={{
              fontSize: '11px',
              padding: '4px 12px',
              borderRadius: '20px',
              border: `1px solid ${crossed ? '#7a3030' : '#3a2b58'}`,
              background: crossed ? 'rgba(120,48,48,0.25)' : 'rgba(58,43,88,0.3)',
              color: crossed ? '#f87171' : '#a090c0',
              textDecoration: crossed ? 'line-through' : 'none',
              letterSpacing: '0.03em',
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
