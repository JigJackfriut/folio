'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub } from '@/components/onboarding/ui'

export function PreviewScreen() {
  const { state } = useOnboarding()

  const publicTags = state.tags.filter(t => t.tier === 'public').slice(0, 5)
  const sharedCount = state.tags.filter(t => t.tier === 'shared').length
  const filterCount = state.tags.filter(t => t.tier === 'filter').length

  const location =
    state.match_base === 'college'
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
        className="rounded-2xl p-6 mb-4"
        style={{
          border: '1px solid #5b4c7d',
          background: 'rgba(44, 31, 70, 0.9)',
        }}
      >
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {state.age && (
            <span
              className="font-mono text-[11px] uppercase tracking-[0.12em]"
              style={{ color: '#b7abd6' }}
            >
              {state.age}
            </span>
          )}

          {location && (
            <>
              <span style={{ color: '#6c5a94', fontSize: '10px' }}>•</span>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.12em]"
                style={{ color: '#b7abd6' }}
              >
                {location}
              </span>
            </>
          )}

          {state.open_to_distance && (
            <>
              <span style={{ color: '#6c5a94', fontSize: '10px' }}>•</span>
              <span
                className="font-mono text-[11px] uppercase tracking-[0.12em]"
                style={{ color: '#b7abd6' }}
              >
                open to online
              </span>
            </>
          )}
        </div>

        <p
          className="leading-tight mb-3"
          style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontSize: '32px',
            color: state.post_headline ? '#f7f2ff' : '#8f7bb8',
          }}
        >
          {state.post_headline || 'your headline will appear here'}
        </p>

        <p
          className="font-sans leading-relaxed mb-5"
          style={{
            fontSize: '15px',
            color: state.post_body ? '#ddd2fb' : '#9d8fc3',
          }}
        >
          {state.post_body
            ? state.post_body.slice(0, 220) + (state.post_body.length > 220 ? '…' : '')
            : 'your post will appear here'}
        </p>

        <div className="flex flex-wrap gap-2">
          {publicTags.map(({ name }) => (
            <span
              key={name}
              className="px-3 py-1.5 rounded-full border font-sans"
              style={{
                fontSize: '13px',
                borderColor: '#5b4c7d',
                background: 'rgba(74, 53, 118, 0.5)',
                color: '#eee7ff',
              }}
            >
              {name}
            </span>
          ))}

          {sharedCount > 0 && (
            <span
              className="px-3 py-1.5 rounded-full border font-sans"
              style={{
                fontSize: '13px',
                borderColor: '#a88cff',
                background: 'rgba(168, 140, 255, 0.08)',
                color: '#d9ccff',
              }}
            >
              + {sharedCount} thing{sharedCount > 1 ? 's' : ''} in common
            </span>
          )}
        </div>
      </div>

      <div
        className="rounded-xl p-4 space-y-2"
        style={{
          background: 'rgba(44, 31, 70, 0.55)',
          border: '1px solid #5b4c7d',
        }}
      >
        <p className="font-sans text-[14px] leading-relaxed" style={{ color: '#cbbfe8' }}>
          <span style={{ color: '#eee7ff', fontWeight: 600 }}>
            ◎ {publicTags.length} public
          </span>{' '}
          — visible to everyone
        </p>

        {sharedCount > 0 && (
          <p className="font-sans text-[14px] leading-relaxed" style={{ color: '#cbbfe8' }}>
            <span style={{ color: '#d9ccff', fontWeight: 600 }}>
              ⬡ {sharedCount} matched
            </span>{' '}
            — revealed only when someone shares them too
          </p>
        )}

        {filterCount > 0 && (
          <p className="font-sans text-[14px] leading-relaxed" style={{ color: '#cbbfe8' }}>
            <span style={{ color: '#b8efd8', fontWeight: 600 }}>
              ▿ {filterCount} filter
            </span>{' '}
            — invisible to everyone, quietly filters out bad fits
          </p>
        )}
      </div>
    </>
  )
}
