'use client'

import { useState } from 'react'
import { useFeed } from '@/lib/hooks/use-feed'
import { FeedList } from '@/components/feed/feed-list'
import { FilterDrawer } from '@/components/feed/filter-drawer'

export default function FeedPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const {
    posts, crossedTags, loading, loadingMore,
    error, hasMore, loadMore, toggleCrossedTag,
  } = useFeed()

  return (
    <main className="min-h-screen">
      <div className="w-full max-w-xl mx-auto">

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 pt-14 pb-4"
          style={{ borderBottom: '1px solid #2a1f42' }}
        >
          <span style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '30px',
            color: '#f0eaff',
          }}>
            folio.
          </span>
          <div className="flex items-center gap-3">
            {crossedTags.length > 0 && (
              <span
                className="font-mono text-[9px] rounded-full px-2 py-0.5"
                style={{
                  background: 'rgba(120,48,48,0.2)',
                  border: '1px solid #7a3030',
                  color: '#f87171',
                }}
              >
                {crossedTags.length} excluded
              </span>
            )}
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors"
              style={{
                color: filterOpen ? '#c8922a' : '#5a4b78',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              filter
            </button>
            <span className="font-mono text-[11px]" style={{ color: '#4a3b68' }}>
              {!loading && posts.length > 0 && `${posts.length}`}
            </span>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-32">
            <div
              className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: '#3a2b58', borderTopColor: '#6d4bc3' }}
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-5 py-8 text-center">
            <p className="font-mono text-[12px]" style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

        {/* Feed */}
        {!loading && !error && (
          <FeedList
            posts={posts}
            crossedTags={crossedTags}
            loadingMore={loadingMore}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        )}
      </div>

      {/* Filter drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        crossedTags={crossedTags}
        onToggleCrossed={toggleCrossedTag}
      />
    </main>
  )
}
