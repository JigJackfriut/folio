'use client'

import { Heading, Sub } from '@/components/onboarding/ui'

export function TagExplainerScreen() {
  return (
    <div>
      <Heading>before you pick tags.</Heading>
      <Sub>two minutes. worth it.</Sub>

      {/* Public */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex-shrink-0 rounded-full flex items-center justify-center font-mono text-[10px]"
            style={{ width: '28px', height: '28px', background: 'rgba(109,75,195,0.2)', color: '#9b85e8', border: '1px solid rgba(109,75,195,0.4)' }}
          >
            01
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: '#9b85e8' }}>
            public tags
          </p>
        </div>
        <div style={{ paddingLeft: '40px' }}>
          <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '16px', color: '#f0eaff', lineHeight: 1.65, marginBottom: '12px' }}>
            Visible on your profile. Anyone browsing can see them.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Bookworm', 'Hookup', 'Night owl', 'Cinephile', 'ADHD', 'In therapy', 'Dog parent', '420 friendly'].map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] rounded-full px-2.5 py-1"
                style={{ background: 'rgba(109,75,195,0.1)', border: '1px solid rgba(109,75,195,0.25)', color: '#9b85e8' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Echo */}
      <div className="mb-6" style={{ borderTop: '1px solid #2a1f42', paddingTop: '20px' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex-shrink-0 rounded-full flex items-center justify-center font-mono text-[10px]"
            style={{ width: '28px', height: '28px', background: 'rgba(200,146,42,0.2)', color: '#c8922a', border: '1px solid rgba(200,146,42,0.4)' }}
          >
            02
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: '#c8922a' }}>
            echo tags
          </p>
        </div>
        <div style={{ paddingLeft: '40px' }}>
          <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '16px', color: '#f0eaff', lineHeight: 1.65, marginBottom: '10px' }}>
            Hidden from everyone. If you and someone else both picked the same echo tag, it surfaces inside your thread once a conversation opens — not before, not on your profile.
          </p>
          <div
            className="rounded-xl p-3 mb-3"
            style={{ background: 'rgba(200,146,42,0.06)', border: '1px solid rgba(200,146,42,0.15)' }}
          >
            <p className="font-mono text-[10px] leading-relaxed" style={{ color: '#a07840' }}>
              you both pick <span style={{ color: '#f0eaff' }}>"late-diagnosed ADHD"</span><br />
              you start talking about Kieslowski<br />
              the app surfaces: <span style={{ color: '#f0eaff' }}>"you share something"</span><br />
              you both tap. it appears. just once. just here.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['Late-diagnosed ADHD', 'Rejection sensitive', 'Never dated before', 'Anxious attachment', 'Recently out', 'Chronic illness'].map(tag => (
              <span
                key={tag}
                className="font-mono text-[10px] rounded-full px-2.5 py-1"
                style={{ background: 'rgba(200,146,42,0.08)', border: '1px solid rgba(200,146,42,0.2)', color: '#c8922a' }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Cross out */}
      <div className="mb-6" style={{ borderTop: '1px solid #2a1f42', paddingTop: '20px' }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="flex-shrink-0 rounded-full flex items-center justify-center font-mono text-[10px]"
            style={{ width: '28px', height: '28px', background: 'rgba(90,75,120,0.2)', color: '#5a4b78', border: '1px solid rgba(90,75,120,0.4)' }}
          >
            ✕
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em]" style={{ color: '#5a4b78' }}>
            crossing tags out
          </p>
        </div>
        <div style={{ paddingLeft: '40px' }}>
          <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '16px', color: '#f0eaff', lineHeight: 1.65, marginBottom: '10px' }}>
            From the feed you can cross out any public tag. Posts from people with that tag won't appear. Nobody else can see what you've crossed out.
          </p>
          <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '14px', color: '#7a6b9a', lineHeight: 1.6 }}>
            You set this in the feed, not here.
          </p>
        </div>
      </div>

      {/* Closing note */}
      <div
        className="rounded-xl p-4"
        style={{ background: 'rgba(30,21,48,0.5)', border: '1px solid #2a1f42' }}
      >
        <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '15px', color: '#7a6b9a', lineHeight: 1.7, fontStyle: 'italic' }}>
          You can change all of this from your profile at any time.
        </p>
      </div>
    </div>
  )
}
