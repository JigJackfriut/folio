'use client'

import Link from 'next/link'
import { SignalLabel } from './signal-label'
import { logInteraction } from '@/lib/mutations/interactions'
import { createClient } from '@/lib/supabase/client'
import type { PostWithSignal } from '@/lib/types'

interface Props {
  post: PostWithSignal
  crossedTags: string[]
}

function timeAgo(date: string): string {
  const hours = Math.floor((Date.now() - new Date(date).getTime()) / 3600000)
  if (hours < 1) return 'just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

export function PostCard({ post, crossedTags }: Props) {
  const supabase = createClient()

  const handleClick = () => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) logInteraction(supabase, user.id, post.id, 'view')
    })
  }

  return (
    <Link href={`/post/${post.id}`} onClick={handleClick} className="block">
      <div
        className="rounded-2xl transition-colors duration-150"
        style={{
          background: '#241936',
          border: '1px solid #2e2040',
          padding: '16px',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#4a3b6a' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2040' }}
      >
        {/* Top row — signal + time */}
        <div className="flex items-start justify-between mb-3">
          <SignalLabel
            signal={post.signal}
            reason={post.signal_reason}
            echoCount={post.echo_count}
          />
          <span
            className="font-mono text-[9px] flex-shrink-0 ml-2"
            style={{ color: '#3a2b58', letterSpacing: '0.04em' }}
          >
            {timeAgo(post.created_at)}
          </span>
        </div>

        {/* Handle */}
        <p
          className="font-mono text-[10px] mb-2"
          style={{ color: '#5a4b78', letterSpacing: '0.04em' }}
        >
          {post.author.handle}
        </p>

        {/* Headline */}
        <p
          className="leading-snug mb-3"
          style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '17px',
            color: '#f0eaff',
          }}
        >
          {post.headline}
        </p>

        {/* Body preview */}
        <p
          className="leading-relaxed mb-3"
          style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontSize: '13px',
            color: '#7060a0',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}
        >
          {post.post_body}
        </p>

        {/* Tags */}
        {post.tag_names.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {post.tag_names.map(tag => {
              const isMatched = post.matched_tags.includes(tag)
              const isCrossed = crossedTags.includes(tag)
              return (
                <span
                  key={tag}
                  className="font-mono text-[9px] rounded-full px-2 py-0.5"
                  style={{
                    border: `1px solid ${isMatched ? 'rgba(109,75,195,0.4)' : '#2e2040'}`,
                    background: isMatched ? 'rgba(109,75,195,0.08)' : 'transparent',
                    color: isCrossed ? '#3a2b58' : isMatched ? '#9b85e8' : '#4a3b68',
                    textDecoration: isCrossed ? 'line-through' : 'none',
                  }}
                >
                  {tag}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </Link>
  )
}
