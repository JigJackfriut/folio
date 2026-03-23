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
          background: '#1e1530',
          border: '1px solid #2e2040',
          padding: '20px',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#4a3b6a' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e2040' }}
      >
        {/* Signal + time */}
        <div className="flex items-center justify-between mb-4">
          <SignalLabel
            signal={post.signal}
            reason={post.signal_reason}
            echoCount={post.echo_count}
          />
          <span
            className="font-mono text-[10px]"
            style={{ color: '#4a3b68', letterSpacing: '0.04em' }}
          >
            {timeAgo(post.created_at)}
          </span>
        </div>

        {/* Handle */}
        <p
          className="font-mono text-[11px] mb-3"
          style={{ color: '#7a6b9a', letterSpacing: '0.04em' }}
        >
          {post.author.handle || `w/${post.author.display_name?.toLowerCase().replace(/\s/g, '')}`}
        </p>

        {/* Headline — high contrast */}
        <p
          className="leading-snug mb-3"
          style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '20px',
            color: '#f0eaff',
            lineHeight: 1.45,
          }}
        >
          {post.headline}
        </p>

        {/* Body — readable contrast */}
        <p
          className="leading-relaxed mb-4"
          style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontSize: '15px',
            color: '#b8a8d0',
            lineHeight: 1.7,
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
          <div className="flex gap-2 flex-wrap">
            {post.tag_names.map(tag => {
              const isMatched = post.matched_tags.includes(tag)
              const isCrossed = crossedTags.includes(tag)
              return (
                <span
                  key={tag}
                  className="font-mono text-[10px] rounded-full px-2.5 py-1"
                  style={{
                    border: `1px solid ${isMatched ? 'rgba(155,133,232,0.5)' : '#2e2040'}`,
                    background: isMatched ? 'rgba(109,75,195,0.12)' : 'transparent',
                    color: isCrossed ? '#3a2b58' : isMatched ? '#c3b3ff' : '#6a5a88',
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
