'use client'

import { useState, useRef } from 'react'
import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub, EditorialInput, Toggle } from '@/components/onboarding/ui'

const RADIUS_OPTIONS = [
  { label: '5 mi',   value: 5   },
  { label: '10 mi',  value: 10  },
  { label: '25 mi',  value: 25  },
  { label: '50 mi',  value: 50  },
  { label: '100 mi', value: 100 },
]

function CollegeSearch() {
  const { state, set } = useOnboarding()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ name: string; country: string; web_pages: string[] }[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = (q: string) => {
    setQuery(q)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) { setResults([]); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`https://universities.hipolabs.com/search?name=${encodeURIComponent(q)}&limit=8`)
        const data = await res.json()
        setResults(data.slice(0, 8))
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 350)
  }

  const select = (college: { name: string; country: string; web_pages: string[] }) => {
    set({ college_name: college.name, college_country: college.country, college_url: college.web_pages?.[0] ?? '' })
    setQuery(college.name)
    setResults([])
    setFocused(false)
  }

  const clear = () => {
    set({ college_name: '', college_country: '', college_url: '' })
    setQuery('')
    setResults([])
  }

  if (state.college_name && !focused) {
    return (
      <div
        className="rounded-2xl p-4 flex items-center justify-between mb-2"
        style={{ border: '1px solid #9b85e8', background: 'rgba(155,133,232,0.1)' }}
      >
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-0.5" style={{ color: '#7a6b9a' }}>
            matched around
          </p>
          <p style={{ fontSize: '16px', color: '#f0eaff', fontFamily: 'EB Garamond, Georgia, serif' }}>
            {state.college_name}
          </p>
          <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78' }}>{state.college_country}</p>
        </div>
        <button
          type="button"
          onClick={clear}
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: '#5a4b78' }}
        >
          change
        </button>
      </div>
    )
  }

  return (
    <div className="relative mb-2">
      <div
        className="flex items-center gap-2 rounded-xl px-4 py-3 transition-colors"
        style={{ border: `1px solid ${focused ? '#9b85e8' : '#3a2b58'}`, background: 'rgba(30,21,48,0.6)' }}
      >
        <span style={{ color: '#4a3b68', fontSize: '14px', flexShrink: 0 }}>⌕</span>
        <input
          type="text"
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search for your college or university..."
          className="flex-1 bg-transparent outline-none"
          style={{ fontSize: '14px', color: '#f5efff' }}
          autoComplete="off"
        />
        {loading && <span className="font-mono text-[10px]" style={{ color: '#4a3b68' }}>…</span>}
      </div>

      {results.length > 0 && focused && (
        <div
          className="absolute left-0 right-0 rounded-xl overflow-hidden z-20 mt-1"
          style={{ border: '1px solid #3a2b58', background: '#1a1230' }}
        >
          {results.map((r, i) => (
            <button
              key={r.web_pages?.[0] ?? i}
              type="button"
              onMouseDown={() => select(r)}
              className="w-full text-left flex items-start gap-3 transition-all"
              style={{ padding: '11px 16px', borderBottom: i < results.length - 1 ? '1px solid #2a1f42' : undefined }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,43,88,0.4)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ color: '#5a4b78', fontSize: '12px', marginTop: '2px', flexShrink: 0 }}>◎</span>
              <div>
                <p style={{ fontSize: '13px', color: '#d4c8f0' }}>{r.name}</p>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78' }}>{r.country}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {query.length > 2 && results.length === 0 && !loading && focused && (
        <div
          className="absolute left-0 right-0 rounded-xl mt-1 px-4 py-3"
          style={{ border: '1px solid #2a1f42', background: '#1a1230' }}
        >
          <p className="font-mono text-[11px]" style={{ color: '#4a3b68' }}>No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}
    </div>
  )
}

export function LocationScreen() {
  const { state, set } = useOnboarding()

  return (
    <>
      <Heading>where are you?</Heading>
      <Sub>sets your matching radius — never shown publicly unless you choose</Sub>

      <div className="grid grid-cols-2 gap-2 mb-6">
        {(['location', 'college'] as const).map(base => (
          <button
            key={base}
            type="button"
            onClick={() => set({ match_base: base })}
            className="rounded-2xl flex flex-col items-start transition-all duration-150"
            style={{
              padding: '14px 16px',
              border: `1px solid ${state.match_base === base ? '#9b85e8' : '#3a2b58'}`,
              background: state.match_base === base ? 'rgba(46,31,74,0.8)' : 'rgba(30,21,48,0.4)',
            }}
          >
            <span style={{ fontSize: '18px', marginBottom: '6px' }}>
              {base === 'location' ? '📍' : '🎓'}
            </span>
            <p className="font-medium text-[13px] mb-0.5" style={{ color: state.match_base === base ? '#f0eaff' : '#a99abb' }}>
              {base === 'location' ? 'My location' : 'My college'}
            </p>
            <p className="text-[11px]" style={{ color: '#7a6b9a' }}>
              {base === 'location' ? 'City or neighbourhood' : 'Campus as my anchor'}
            </p>
          </button>
        ))}
      </div>

      {state.match_base === 'location' ? (
        <EditorialInput
          label="I'm based in..."
          placeholder="City or neighbourhood"
          value={state.location_raw}
          onChange={e => set({ location_raw: e.target.value })}
          hint="e.g. Brooklyn, NY · Melbourne · East London"
        />
      ) : (
        <div className="mb-6">
          <p
            className="font-serif italic mb-3"
            style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
          >
            My college is...
          </p>
          <CollegeSearch />
        </div>
      )}

      <div className="mb-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] mb-3" style={{ color: '#7a6b9a' }}>
          match within
        </p>
        <div className="flex gap-2 flex-wrap">
          {RADIUS_OPTIONS.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set({ match_radius_miles: opt.value })}
              className="rounded-full border font-mono text-[11px] transition-all"
              style={{
                padding: '6px 14px',
                borderColor: state.match_radius_miles === opt.value ? '#9b85e8' : '#3a2b58',
                background: state.match_radius_miles === opt.value ? 'rgba(46,31,74,0.8)' : 'transparent',
                color: state.match_radius_miles === opt.value ? '#f0eaff' : '#7a6b9a',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #2a1f42' }}>
        <Toggle
          label="Also show people outside my radius"
          hint="Softer limit — still shows closer people first"
          checked={state.open_to_distance}
          onChange={v => set({ open_to_distance: v })}
        />
        <Toggle
          label="Show neighbourhood only"
          hint="Hides your exact city from your public profile"
          checked={state.hide_exact_location}
          onChange={v => set({ hide_exact_location: v })}
        />
      </div>
    </>
  )
}
