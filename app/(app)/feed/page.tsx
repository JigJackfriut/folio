'use client'

import { useState } from 'react'
import { useFeed } from '@/lib/hooks/use-feed'
import { FeedList } from '@/components/feed/feed-list'
import { FilterDrawer } from '@/components/feed/filter-drawer'

export default function FeedPage() {
  const [filterOpen, setFilterOpen] = useState(false)
  const {
    posts, crossedTags, includedTags, loading, loadingMore,
    error, hasMore, loadMore, toggleCrossedTag, toggleIncludedTag,
  } = useFeed()

  const activeFilters = crossedTags.length + includedTags.length

  return (
    <main className="min-h-screen">
      <div className="w-full max-w-xl mx-auto">

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
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 transition-all"
              style={{
  background: activeFilters > 0 ? 'rgba(109,75,195,0.2)' : 'rgba(255,255,255,0.06)',
  border: `1px solid ${activeFilters > 0 ? '#9b85e8' : '#6a5a88'}`,
  borderRadius: '20px',
  padding: '6px 14px',
  cursor: 'pointer',
}}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke={activeFilters > 0 ? '#9b85e8' : '#5a4b78'} strokeWidth="2">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
                <line x1="11" y1="18" x2="13" y2="18"/>
              </svg>
              <span className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: activeFilters > 0 ? '#9b85e8' : '#5a4b78' }}>
                {activeFilters > 0 ? `${activeFilters} active` : 'filter'}
              </span>
            </button>
            <span className="font-mono text-[10px]" style={{ color: '#4a3b68' }}>
              {!loading && `${posts.length}`}
            </span>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-32">
            <div className="w-5 h-5 rounded-full border-2 animate-spin"
              style={{ borderColor: '#3a2b58', borderTopColor: '#6d4bc3' }} />
          </div>
        )}

        {error && (
          <div className="px-5 py-8 text-center">
            <p className="font-mono text-[12px]" style={{ color: '#f87171' }}>{error}</p>
          </div>
        )}

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

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        crossedTags={crossedTags}
        includedTags={includedTags}
        onToggleCrossed={toggleCrossedTag}
        onToggleIncluded={toggleIncludedTag}
      />
    </main>
  )
}
