'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub } from '@/components/onboarding/ui'

export function PreviewScreen() {
  const { state } = useOnboarding()

  const publicTags = state.tags.filter(t => t.tier === 'public').slice(0, 5)
  const sharedCount = state.tags.filter(t => t.tier === 'shared').length
  const filterCount = state.tags.filter(t => t.tier === 'filter').length
  const location = state.match_base === 'college'
    ? state.college_name
    : state.location_raw
      ? state.hide_exact_location
        ? state.location_raw.split(',')[0]?.trim() ?? state.location_raw
        : state.location_raw
      : null

  return (
    <>
      <Heading>here&apos;s how you&apos;ll appear</Heading>
      <Sub>edit anytime from your profile</Sub>

      <div
        className="rounded-2xl p-5 mb-4"
        style={{ border: '1px solid #3a2b58', background: 'rgba(30,21,48,0.6)' }}
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {state.age && <span className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>{state.age}</span>}
          {location && (
            <>
              <span style={{ color: '#3a2b58', fontSize: '8px' }}>·</span>
              <span className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>{location}</span>
            </>
          )}
          {state.open_to_distance && (
            <>
              <span style={{ color: '#3a2b58', fontSize: '8px' }}>·</span>
              <span className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>open to online</span>
            </>
          )}
        </div>

        <p
          className="leading-snug mb-3"
          style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '19px', color: state.post_headline ? '#f5efff' : '#3a2b58' }}
        >
          {state.post_headline || 'your headline will appear here'}
        </p>

        <p className="leading-relaxed mb-4 text-[13px]" style={{ color: state.post_body ? '#a99abb' : '#3a2b58' }}>
          {state.post_body
            ? state.post_body.slice(0, 200) + (state.post_body.length > 200 ? '…' : '')
            : 'your post will appear here'}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {publicTags.map(({ name }) => (
            <span
              key={name}
              className="px-2.5 py-1 rounded-full text-[11px] border"
              style={{ borderColor: '#3a2b58', background: 'rgba(42,31,66,0.8)', color: '#a99abb' }}
            >
              {name}
            </span>
          ))}
          {sharedCount > 0 && (
            <span
              className="px-2.5 py-1 rounded-full text-[11px] border italic"
              style={{ borderColor: '#7F77DD', background: 'rgba(238,237,254,0.05)', color: '#c3b3ff' }}
            >
              + {sharedCount} thing{sharedCount > 1 ? 's' : ''} in common
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl p-4 text-[12px] leading-relaxed space-y-2" style={{ background: 'rgba(30,21,48,0.4)', border: '1px solid #2a1f42' }}>
        <p style={{ color: '#7a6b9a' }}>
          <span style={{ color: '#a99abb' }}>◎ {publicTags.length} public</span> — visible to everyone
        </p>
        {sharedCount > 0 && (
          <p style={{ color: '#7a6b9a' }}>
            <span style={{ color: '#c3b3ff' }}>⬡ {sharedCount} matched</span> — revealed only when a match shares them
          </p>
        )}
        {filterCount > 0 && (
          <p style={{ color: '#7a6b9a' }}>
            <span style={{ color: '#5DCAA5' }}>▿ {filterCount} filter</span> — invisible to everyone, quietly removes bad fits
          </p>
        )}
      </div>
    </>
  )
}
