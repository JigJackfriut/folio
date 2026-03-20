'use client'

import { useState, useRef, useEffect } from 'react'
import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub } from '@/components/onboarding/ui'

type LocationMode = 'city' | 'college'

const RADIUS_OPTIONS = [
  { label: '10 miles',             value: '10'    },
  { label: '25 miles',             value: '25'    },
  { label: '50 miles',             value: '50'    },
  { label: '100 miles',            value: '100'   },
  { label: 'Anywhere in my state', value: 'state' },
  { label: 'Anywhere',             value: 'any'   },
]

const CONNECTION_OPTIONS = [
  { value: 'in-person', label: 'In person only',      icon: '🤝', hint: 'Meet locally'              },
  { value: 'both',      label: 'In person or online', icon: '✦',  hint: 'Open to either'            },
  { value: 'online',    label: 'Online only',         icon: '💬', hint: 'No location needed'        },
]

// ── Shared styles ──────────────────────────────────────────────────────────────

const searchBox = (focused: boolean): React.CSSProperties => ({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  borderRadius: '14px',
  padding: '13px 16px',
  border: `1px solid ${focused ? '#9b85e8' : '#3a2b58'}`,
  background: 'rgba(30,21,48,0.6)',
  transition: 'border-color 0.15s',
})

const dropdownWrap: React.CSSProperties = {
  position: 'absolute',
  left: 0, right: 0,
  marginTop: '6px',
  borderRadius: '14px',
  overflow: 'hidden',
  zIndex: 30,
  border: '1px solid #3a2b58',
  background: '#1a1230',
  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
}

const confirmedBox: React.CSSProperties = {
  borderRadius: '14px',
  padding: '14px 16px',
  border: '1px solid #9b85e8',
  background: 'rgba(155,133,232,0.08)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: '#7a6b9a' }}>
      {children}
    </p>
  )
}

function Spinner() {
  return (
    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#9b85e8] border-t-transparent animate-spin flex-shrink-0" />
  )
}

// ── CitySearch ─────────────────────────────────────────────────────────────────

function CitySearch({ optional }: { optional?: boolean }) {
  const { state, set } = useOnboarding()
  const [query, setQuery]             = useState(state.location_raw || '')
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([])
  const [focused, setFocused]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const serviceRef  = useRef<google.maps.places.AutocompleteService | null>(null)

  useEffect(() => {
    const init = () => {
      if (window.google?.maps?.places)
        serviceRef.current = new window.google.maps.places.AutocompleteService()
    }
    if (typeof window !== 'undefined') {
      if (window.google) init()
      else window.addEventListener('load', init)
      return () => window.removeEventListener('load', init)
    }
  }, [])

  const search = (value: string) => {
    setQuery(value)
    set({ location_raw: value, location_place_id: '' })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim() || value.length < 2) { setSuggestions([]); return }
    setLoading(true)
    debounceRef.current = setTimeout(() => {
      serviceRef.current?.getPlacePredictions(
        { input: value, types: ['(cities)'] },
        (results, status) => {
          setLoading(false)
          setSuggestions(status === 'OK' && results ? results.slice(0, 6) : [])
        }
      )
    }, 300)
  }

  const select = (p: google.maps.places.AutocompletePrediction) => {
    setQuery(p.description)
    set({ location_raw: p.description, location_place_id: p.place_id })
    setSuggestions([])
    setFocused(false)
  }

  const clear = () => {
    set({ location_raw: '', location_place_id: '' })
    setQuery('')
    setSuggestions([])
  }

  if (state.location_place_id && !focused) {
    return (
      <div style={confirmedBox}>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1" style={{ color: '#7a6b9a' }}>
            your city
          </p>
          <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '18px', color: '#f0eaff' }}>
            {state.location_raw}
          </p>
        </div>
        <button
          type="button" onClick={clear}
          className="font-mono text-[10px] uppercase tracking-widest hover:text-[#f0eaff] transition-colors"
          style={{ color: '#9b85e8' }}
        >
          change
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <div style={searchBox(focused)}>
        <span style={{ color: '#4a3b68', fontSize: '17px', flexShrink: 0 }}>◎</span>
        <input
          type="text"
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          placeholder={optional ? 'Columbus, OH (optional)' : 'Columbus, OH'}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none"
          style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '17px', color: '#f5efff' }}
        />
        {loading && <Spinner />}
      </div>

      {focused && suggestions.length > 0 && (
        <div style={dropdownWrap}>
          {suggestions.map((s, i) => (
            <button
              key={s.place_id}
              type="button"
              onMouseDown={() => select(s)}
              className="w-full text-left flex items-center gap-3 transition-all"
              style={{
                padding: '12px 16px',
                borderBottom: i < suggestions.length - 1 ? '1px solid #231840' : undefined,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,43,88,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ color: '#5a4b78', fontSize: '12px', flexShrink: 0 }}>📍</span>
              <div>
                <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '15px', color: '#e0d8f5' }}>
                  {s.structured_formatting.main_text}
                </p>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78' }}>
                  {s.structured_formatting.secondary_text}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {focused && query.length > 2 && suggestions.length === 0 && !loading && (
        <div style={{ ...dropdownWrap, padding: '14px 16px' }}>
          <p className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>
            No cities found — try a different spelling
          </p>
        </div>
      )}
    </div>
  )
}

// ── CollegeSearch ──────────────────────────────────────────────────────────────

type College = { name: string; country: string; web_pages: string[] }

function CollegeSearch({ optional }: { optional?: boolean }) {
  const { state, set } = useOnboarding()
  const [query, setQuery]     = useState(state.college_name || '')
  const [results, setResults] = useState<College[]>([])
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = (value: string) => {
    setQuery(value)
    set({ college_name: '', college_country: '' })
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!value.trim() || value.length < 2) { setResults([]); return }
    setLoading(true)
    debounceRef.current = setTimeout(async () => {
      try {
        const res  = await fetch(`https://universities.hipolabs.com/search?name=${encodeURIComponent(value)}&limit=8`)
        const data: College[] = await res.json()
        setResults(data.slice(0, 8))
      } catch { setResults([]) }
      finally  { setLoading(false) }
    }, 350)
  }

  const select = (c: College) => {
    setQuery(c.name)
    set({ college_name: c.name, college_country: c.country })
    setResults([])
    setFocused(false)
  }

  const clear = () => {
    set({ college_name: '', college_country: '' })
    setQuery('')
    setResults([])
  }

  if (state.college_name && !focused) {
    return (
      <div style={confirmedBox}>
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1" style={{ color: '#7a6b9a' }}>
            your college
          </p>
          <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '18px', color: '#f0eaff' }}>
            {state.college_name}
          </p>
          <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78' }}>
            {state.college_country}
          </p>
        </div>
        <button
          type="button" onClick={clear}
          className="font-mono text-[10px] uppercase tracking-widest hover:text-[#f0eaff] transition-colors"
          style={{ color: '#9b85e8' }}
        >
          change
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <div style={searchBox(focused)}>
        <span style={{ color: '#4a3b68', fontSize: '17px', flexShrink: 0 }}>🎓</span>
        <input
          type="text"
          value={query}
          onChange={e => search(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 180)}
          placeholder={optional ? 'Search your college (optional)' : 'Search your college or university...'}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none"
          style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '17px', color: '#f5efff' }}
        />
        {loading && <Spinner />}
      </div>

      {focused && results.length > 0 && (
        <div style={dropdownWrap}>
          {results.map((r, i) => (
            <button
              key={r.web_pages?.[0] ?? i}
              type="button"
              onMouseDown={() => select(r)}
              className="w-full text-left flex items-center gap-3 transition-all"
              style={{
                padding: '12px 16px',
                borderBottom: i < results.length - 1 ? '1px solid #231840' : undefined,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,43,88,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ color: '#5a4b78', fontSize: '12px', flexShrink: 0 }}>◎</span>
              <div>
                <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '15px', color: '#e0d8f5' }}>
                  {r.name}
                </p>
                <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78' }}>
                  {r.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      {focused && query.length > 2 && results.length === 0 && !loading && (
        <div style={{ ...dropdownWrap, padding: '14px 16px' }}>
          <p className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>
            No results — try a shorter name
          </p>
        </div>
      )}
    </div>
  )
}

// ── LocationScreen ─────────────────────────────────────────────────────────────

export function LocationScreen() {
  const { state, set } = useOnboarding()
  const [mode, setMode] = useState<LocationMode>(state.college_name ? 'college' : 'city')

  const isOnline    = state.connection_pref === 'online'
  const needsLocation = !isOnline
  const hasLocation = !!(state.location_place_id || state.college_name)

  return (
    <>
      <Heading>where are you?</Heading>
      <Sub>sets your matching radius — never shown publicly unless you choose</Sub>

      {/* ── 1. Connection preference ── */}
      <div className="mb-7">
        <SectionLabel>connection preference</SectionLabel>
        <div className="flex flex-col gap-2">
          {CONNECTION_OPTIONS.map(opt => {
            const active = state.connection_pref === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set({ connection_pref: opt.value as any })}
                className="flex items-center gap-4 rounded-xl text-left transition-all"
                style={{
                  padding: '13px 16px',
                  border:     `1px solid ${active ? '#9b85e8' : '#3a2b58'}`,
                  background:  active ? 'rgba(46,31,74,0.85)' : 'rgba(30,21,48,0.4)',
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: '34px', height: '34px',
                    background: active ? 'rgba(155,133,232,0.2)' : 'rgba(58,43,88,0.4)',
                    fontSize: '15px',
                  }}
                >
                  {opt.icon}
                </span>
                <div className="flex-1">
                  <p style={{
                    fontFamily: 'EB Garamond, Georgia, serif',
                    fontSize: '16px',
                    color: active ? '#f0eaff' : '#a99abb',
                  }}>
                    {opt.label}
                  </p>
                  <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78' }}>
                    {opt.hint}
                  </p>
                </div>
                <div
                  className="flex-shrink-0 rounded-full flex items-center justify-center"
                  style={{
                    width: '16px', height: '16px',
                    border: `1.5px solid ${active ? '#9b85e8' : '#3a2b58'}`,
                    background: active ? '#9b85e8' : 'transparent',
                  }}
                >
                  {active && <span style={{ color: '#fff', fontSize: '9px' }}>✓</span>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── 2. Location ── */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>
            {isOnline ? 'your location' : 'your location *'}
          </SectionLabel>
          {isOnline && (
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#5a4b78' }}>
              optional
            </span>
          )}
        </div>

        {/* Online-only note */}
        {isOnline && (
          <div
            className="rounded-xl px-4 py-3 mb-4 flex items-center gap-3"
            style={{ background: 'rgba(109,75,195,0.12)', border: '1px solid #4a3b6844' }}
          >
            <span style={{ fontSize: '14px' }}>💬</span>
            <p className="font-mono text-[10px] leading-relaxed" style={{ color: '#9b85e8' }}>
              Location is optional for online-only connections.
              Adding one helps if you ever want to meet.
            </p>
          </div>
        )}

        {/* City / college toggle */}
        <div
          className="flex rounded-xl p-1 mb-4"
          style={{ background: 'rgba(30,21,48,0.6)', border: '1px solid #3a2b58' }}
        >
          {([
            { value: 'city',    label: '📍  My city'    },
            { value: 'college', label: '🎓  My college' },
          ] as { value: LocationMode; label: string }[]).map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setMode(opt.value)}
              className="flex-1 rounded-lg py-2.5 font-mono text-xs transition-all"
              style={{
                background:    mode === opt.value ? 'rgba(109,75,195,0.6)' : 'transparent',
                color:         mode === opt.value ? '#f0eaff' : '#7a6b9a',
                fontWeight:    mode === opt.value ? 700 : 400,
                letterSpacing: '0.08em',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {mode === 'city'
          ? <CitySearch optional={isOnline} />
          : <CollegeSearch optional={isOnline} />
        }
      </div>

      {/* ── 3. Match distance — hidden for online-only ── */}
      {!isOnline && (
        <div className="mb-2">
          <SectionLabel>match distance *</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {RADIUS_OPTIONS.map(opt => {
              const active = state.match_radius_miles === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => set({ match_radius_miles: opt.value as any })}
                  className="rounded-xl text-left transition-all"
                  style={{
                    padding: '11px 14px',
                    border:     `1px solid ${active ? '#9b85e8' : '#3a2b58'}`,
                    background:  active ? 'rgba(46,31,74,0.85)' : 'rgba(30,21,48,0.4)',
                    color:       active ? '#f0eaff' : '#7a6b9a',
                    fontFamily: 'EB Garamond, Georgia, serif',
                    fontSize:   '15px',
                  }}
                >
                  {opt.label}
                  {active && (
                    <span className="font-mono text-[9px] ml-2" style={{ color: '#9b85e8' }}>✓</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Required fields note */}
      {needsLocation && (
        <p className="font-mono text-[9px] mt-4" style={{ color: '#4a3b68' }}>
          * required for in-person matching
        </p>
      )}
    </>
  )
}
