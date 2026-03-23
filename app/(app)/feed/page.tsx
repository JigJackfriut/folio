'use client'

import { useFeed } from '@/lib/hooks/use-feed'
import { FilterBar } from '@/components/feed/filter-bar'
import { FeedList } from '@/components/feed/feed-list'

export default function FeedPage() {
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
          <span className="font-mono text-[11px] uppercase tracking-widest" style={{ color: '#5a4b78' }}>
            {!loading && posts.length > 0 && `${posts.length} posts`}
          </span>
        </div>

        {/* Filter bar */}
        {!loading && posts.length > 0 && (
          <FilterBar
            posts={posts}
            crossedTags={crossedTags}
            onToggle={toggleCrossedTag}
          />
        )}

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
    </main>
  )
}
