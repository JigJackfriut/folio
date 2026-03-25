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

const serif = 'EB Garamond, Georgia, serif'

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
        className="rounded-2xl transition-all duration-150"
        style={{
          background: '#1e1530',
          border: '1.5px solid #3d2f5c',
          padding: '20px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#6d4bc3'
          e.currentTarget.style.background = '#221740'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#3d2f5c'
          e.currentTarget.style.background = '#1e1530'
        }}
      >
        {/* Signal + time */}
        <div className="flex items-center justify-between mb-3">
          <SignalLabel
            signal={post.signal}
            reason={post.signal_reason}
            echoCount={post.echo_count}
            matchedTags={post.matched_tags}
          />
          <span
            className="font-mono text-[10px]"
            style={{ color: '#6a5a88', letterSpacing: '0.04em' }}
          >
            {timeAgo(post.created_at)}
          </span>
        </div>

        {/* Handle */}
        <p
          className="font-mono text-[11px] mb-3"
          style={{ color: '#9b85e8', letterSpacing: '0.04em' }}
        >
          {post.author.handle || `w/${post.author.display_name?.toLowerCase().replace(/\s/g, '')}`}
        </p>

        {/* Headline — large and prominent */}
        <p
          className="mb-3"
          style={{
            fontFamily: serif,
            fontStyle: 'italic',
            fontSize: '22px',
            color: '#f0eaff',
            lineHeight: 1.4,
          }}
        >
          {post.headline}
        </p>

        {/* Body */}
        <p
          className="mb-4"
          style={{
            fontFamily: serif,
            fontSize: '16px',
            color: '#c8b8e8',
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
                    border: `1px solid ${isMatched ? 'rgba(155,133,232,0.6)' : '#3d2f5c'}`,
                    background: isMatched ? 'rgba(109,75,195,0.15)' : 'transparent',
                    color: isCrossed ? '#4a3b68' : isMatched ? '#c3b3ff' : '#8a7aaa',
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
