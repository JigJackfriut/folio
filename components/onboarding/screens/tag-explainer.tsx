'use client'

const serif = 'EB Garamond, Georgia, serif'

// ─── Screen 5: Public Tags ────────────────────────────────────────────────────

export function PublicTagsScreen() {
  return (
    <div>
      <div
        className="inline-flex items-center gap-2 rounded-full mb-6"
        style={{
          background: 'rgba(109,75,195,0.12)',
          border: '1px solid rgba(109,75,195,0.3)',
          padding: '4px 12px',
        }}
      >
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9b85e8' }} />
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#9b85e8' }}>
          visible to everyone
        </span>
      </div>

      <p style={{ fontFamily: serif, fontSize: '18px', color: '#f0eaff', lineHeight: 1.7, marginBottom: '20px' }}>
        Public tags appear on your profile. Anyone browsing the feed can see them.
      </p>

      <p style={{ fontFamily: serif, fontSize: '18px', color: '#f0eaff', lineHeight: 1.7, marginBottom: '20px' }}>
        They are conversation starters — things you're comfortable owning publicly.
      </p>

      <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '16px', color: '#9b85e8', lineHeight: 1.7, marginBottom: '24px' }}>
        Pick things that are genuinely you. Not things you think you should say.
      </p>

      <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: '#5a4b78' }}>
        examples
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {['Bookworm', 'Night owl', 'ADHD', 'In therapy', 'Dog parent', 'Cinephile', 'Introvert', '420 friendly', 'Casual', 'Long-term'].map(tag => (
          <span
            key={tag}
            className="font-mono text-[11px] rounded-full px-3 py-1.5"
            style={{
              border: '1px solid #3d2f5c',
              color: '#8a7aaa',
              background: 'transparent',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div
        className="rounded-2xl p-4"
        style={{ background: 'rgba(30,21,48,0.5)', border: '1px solid #2a1f42' }}
      >
        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: '#c8b8e8', lineHeight: 1.65 }}>
          You can also cross tags out from the feed later — posts from people with that tag won't appear. Nobody else sees what you've crossed out.
        </p>
      </div>
    </div>
  )
}

// ─── Screen 6: Echo Tags ──────────────────────────────────────────────────────

export function EchoTagsScreen() {
  return (
    <div>
      <div
        className="inline-flex items-center gap-2 rounded-full mb-6"
        style={{
          background: 'rgba(200,146,42,0.1)',
          border: '1px solid rgba(200,146,42,0.3)',
          padding: '4px 12px',
        }}
      >
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c8922a' }} />
        <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#c8922a' }}>
          hidden from everyone
        </span>
      </div>

      <p style={{ fontFamily: serif, fontSize: '18px', color: '#f0eaff', lineHeight: 1.7, marginBottom: '20px' }}>
        Echo tags are private. Nobody can see them — not on your profile, not in the feed, not anywhere.
      </p>

      <p style={{ fontFamily: serif, fontSize: '18px', color: '#f0eaff', lineHeight: 1.7, marginBottom: '20px' }}>
        But if you and someone else both pick the same echo tag, and a conversation opens between you — it surfaces quietly at the top of your thread. Just once. Just for you two.
      </p>

      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: 'rgba(200,146,42,0.06)', border: '1px solid rgba(200,146,42,0.2)' }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest mb-2" style={{ color: '#c8922a' }}>
          ◎ every wednesday
        </p>
        <p style={{ fontFamily: serif, fontSize: '16px', color: '#f0eaff', lineHeight: 1.65 }}>
          Once a week we surface your strongest echo matches — people whose hidden tags align with yours most closely. You'll get a quiet notification on Wednesday.
        </p>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-widest mb-3" style={{ color: '#5a4b78' }}>
        the kind of things people pick
      </p>

      <div className="flex flex-wrap gap-2">
        {['Late-diagnosed ADHD', 'Rejection sensitive', 'Never dated before', 'Anxious attachment', 'Recently out', 'Chronic illness', 'In recovery', 'Autistic'].map(tag => (
          <span
            key={tag}
            className="font-mono text-[11px] rounded-full px-3 py-1.5"
            style={{
              border: '1px solid rgba(200,146,42,0.25)',
              color: '#c8922a',
              background: 'rgba(200,146,42,0.06)',
              pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
