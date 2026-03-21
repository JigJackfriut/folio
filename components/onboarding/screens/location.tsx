'use client'

import { useState, useRef } from 'react'
import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub } from '@/components/onboarding/ui'

type Step = 'pick' | 'city' | 'college'

const RADIUS_OPTIONS = [
  { label: '10 miles',             value: '10'    },
  { label: '25 miles',             value: '25'    },
  { label: '50 miles',             value: '50'    },
  { label: '100 miles',            value: '100'   },
  { label: 'Anywhere in my state', value: 'state' },
  { label: 'Anywhere',             value: 'any'   },
]

const CONNECTION_OPTIONS = [
  { value: 'in-person', label: 'In person only',      hint: 'Meet locally',       icon: '🤝' },
  { value: 'both',      label: 'In person or online', hint: 'Open to either',     icon: '✦'  },
  { value: 'online',    label: 'Online only',         hint: 'No location needed', icon: '💬' },
]

const COLLEGES: { name: string; country: string }[] = [
  // Ivy League
  { name: 'Harvard University',                    country: 'United States' },
  { name: 'Yale University',                       country: 'United States' },
  { name: 'Princeton University',                  country: 'United States' },
  { name: 'Columbia University',                   country: 'United States' },
  { name: 'University of Pennsylvania',            country: 'United States' },
  { name: 'Cornell University',                    country: 'United States' },
  { name: 'Dartmouth College',                     country: 'United States' },
  { name: 'Brown University',                      country: 'United States' },
  // Top research
  { name: 'MIT',                                   country: 'United States' },
  { name: 'Stanford University',                   country: 'United States' },
  { name: 'Carnegie Mellon University',            country: 'United States' },
  { name: 'Johns Hopkins University',              country: 'United States' },
  { name: 'Duke University',                       country: 'United States' },
  { name: 'Northwestern University',               country: 'United States' },
  { name: 'Vanderbilt University',                 country: 'United States' },
  { name: 'Rice University',                       country: 'United States' },
  { name: 'Georgetown University',                 country: 'United States' },
  { name: 'Emory University',                      country: 'United States' },
  { name: 'Tufts University',                      country: 'United States' },
  { name: 'Wake Forest University',                country: 'United States' },
  { name: 'University of Notre Dame',              country: 'United States' },
  { name: 'Washington University in St. Louis',    country: 'United States' },
  { name: 'University of Rochester',               country: 'United States' },
  { name: 'Case Western Reserve University',       country: 'United States' },
  { name: 'Tulane University',                     country: 'United States' },
  { name: 'Lehigh University',                     country: 'United States' },
  // Public flagships
  { name: 'University of California, Berkeley',    country: 'United States' },
  { name: 'University of California, Los Angeles', country: 'United States' },
  { name: 'University of California, San Diego',   country: 'United States' },
  { name: 'University of California, Davis',       country: 'United States' },
  { name: 'University of Michigan',                country: 'United States' },
  { name: 'University of Virginia',                country: 'United States' },
  { name: 'University of North Carolina',          country: 'United States' },
  { name: 'University of Florida',                 country: 'United States' },
  { name: 'Ohio State University',                 country: 'United States' },
  { name: 'Penn State University',                 country: 'United States' },
  { name: 'University of Texas at Austin',         country: 'United States' },
  { name: 'Georgia Tech',                          country: 'United States' },
  { name: 'Purdue University',                     country: 'United States' },
  { name: 'University of Wisconsin-Madison',       country: 'United States' },
  { name: 'University of Washington',              country: 'United States' },
  { name: 'University of Illinois',                country: 'United States' },
  { name: 'University of Minnesota',               country: 'United States' },
  { name: 'Michigan State University',             country: 'United States' },
  { name: 'Arizona State University',              country: 'United States' },
  { name: 'University of Arizona',                 country: 'United States' },
  { name: 'University of Colorado Boulder',        country: 'United States' },
  { name: 'University of Maryland',                country: 'United States' },
  { name: 'Rutgers University',                    country: 'United States' },
  { name: 'Indiana University',                    country: 'United States' },
  { name: 'University of Pittsburgh',              country: 'United States' },
  { name: 'University of Southern California',     country: 'United States' },
  { name: 'Boston University',                     country: 'United States' },
  { name: 'Northeastern University',               country: 'United States' },
  { name: 'New York University',                   country: 'United States' },
  { name: 'Temple University',                     country: 'United States' },
  // Liberal arts
  { name: 'Amherst College',                       country: 'United States' },
  { name: 'Williams College',                      country: 'United States' },
  { name: 'Swarthmore College',                    country: 'United States' },
  { name: 'Wellesley College',                     country: 'United States' },
  { name: 'Pomona College',                        country: 'United States' },
  { name: 'Middlebury College',                    country: 'United States' },
  { name: 'Vassar College',                        country: 'United States' },
  { name: 'Colgate University',                    country: 'United States' },
  { name: 'Oberlin College',                       country: 'United States' },
  { name: 'Kenyon College',                        country: 'United States' },
  { name: 'Denison University',                    country: 'United States' },
  { name: 'Bowdoin College',                       country: 'United States' },
  { name: 'Colby College',                         country: 'United States' },
  { name: 'Bates College',                         country: 'United States' },
  { name: 'Hamilton College',                      country: 'United States' },
  { name: 'Carleton College',                      country: 'United States' },
  { name: 'Grinnell College',                      country: 'United States' },
  { name: 'Haverford College',                     country: 'United States' },
  { name: 'Bryn Mawr College',                     country: 'United States' },
  { name: 'Barnard College',                       country: 'United States' },
  { name: 'Smith College',                         country: 'United States' },
  { name: 'Mount Holyoke College',                 country: 'United States' },
  { name: 'Trinity College',                       country: 'United States' },
  { name: 'Connecticut College',                   country: 'United States' },
  { name: 'Lafayette College',                     country: 'United States' },
  { name: 'Bucknell University',                   country: 'United States' },
  { name: 'Dickinson College',                     country: 'United States' },
  { name: 'Gettysburg College',                    country: 'United States' },
  { name: 'Furman University',                     country: 'United States' },
  { name: 'Rhodes College',                        country: 'United States' },
  { name: 'Sewanee: The University of the South',  country: 'United States' },
  { name: 'Davidson College',                      country: 'United States' },
  { name: 'Centre College',                        country: 'United States' },
  { name: 'Wabash College',                        country: 'United States' },
  { name: 'Kalamazoo College',                     country: 'United States' },
  { name: 'DePauw University',                     country: 'United States' },
  { name: 'Earlham College',                       country: 'United States' },
  { name: 'Allegheny College',                     country: 'United States' },
  { name: 'Wooster College',                       country: 'United States' },
  { name: 'Whitman College',                       country: 'United States' },
  { name: 'Reed College',                          country: 'United States' },
  { name: 'St. Olaf College',                      country: 'United States' },
  { name: 'Macalester College',                    country: 'United States' },
  // HBCUs
  { name: 'Howard University',                     country: 'United States' },
  { name: 'Spelman College',                       country: 'United States' },
  { name: 'Morehouse College',                     country: 'United States' },
  { name: 'Hampton University',                    country: 'United States' },
  { name: 'Tuskegee University',                   country: 'United States' },
  { name: 'Fisk University',                       country: 'United States' },
  { name: 'Xavier University of Louisiana',        country: 'United States' },
  // Tech / specialty
  { name: 'Rensselaer Polytechnic Institute',      country: 'United States' },
  { name: 'Worcester Polytechnic Institute',       country: 'United States' },
  { name: 'Stevens Institute of Technology',       country: 'United States' },
  { name: 'Harvey Mudd College',                   country: 'United States' },
  { name: 'Colorado School of Mines',              country: 'United States' },
  { name: 'Rose-Hulman Institute of Technology',   country: 'United States' },
]

// ── Appear ────────────────────────────────────────────────────────────────────

function Appear({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ animation: 'fadeSlideIn 0.55s cubic-bezier(0.16,1,0.3,1) both' }}>
      {children}
    </div>
  )
}

// ── Shared ────────────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: '#7a6b9a' }}>
      {children}
    </p>
  )
}

function BackChip({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="font-mono text-[10px] uppercase tracking-widest mb-7 flex items-center gap-1.5 transition-colors hover:text-[#f0eaff]"
      style={{ color: '#5a4b78' }}
    >
      ← change
    </button>
  )
}

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

// ── CityFlow ──────────────────────────────────────────────────────────────────

function CityFlow({ onBack }: { onBack: () => void }) {
  const { state, set } = useOnboarding()
  const [query, setQuery]             = useState(state.location_raw || '')
  const [suggestions, setSuggestions] = useState<google.maps.places.PlacePrediction[]>([])
  const [focused, setFocused]         = useState(false)
  const [loading, setLoading]         = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isOnline    = state.connection_pref === 'online'

const search = (value: string) => {
  setQuery(value)
  set({ location_raw: value, location_place_id: '' })
  if (debounceRef.current) clearTimeout(debounceRef.current)
  if (!value.trim() || value.length < 2) { setSuggestions([]); return }
  setLoading(true)
  debounceRef.current = setTimeout(async () => {
    try {
      await google.maps.importLibrary('places')
      const sessionToken = new google.maps.places.AutocompleteSessionToken()
      const service = new google.maps.places.AutocompleteService()
      service.getPlacePredictions(
        { input: value, types: ['(cities)'], sessionToken },
        (results, status) => {
          setLoading(false)
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            setSuggestions(results.slice(0, 6))
          } else {
            setSuggestions([])
          }
        }
      )
    } catch {
      setSuggestions([])
      setLoading(false)
    }
  }, 300)
}

  
const select = (p: google.maps.places.AutocompletePrediction) => {
  setQuery(p.description)
  set({ location_raw: p.description, location_place_id: p.place_id })
  setSuggestions([])
  setFocused(false)
}
  const clearCity = () => {
    set({ location_raw: '', location_place_id: '' })
    setQuery('')
  }

  const confirmed = !!state.location_place_id

  return (
    <Appear>
      <BackChip onClick={() => {
        set({ location_raw: '', location_place_id: '', connection_pref: 'both', match_radius_miles: '25' as any })
        onBack()
      }} />

      {/* Connection preference */}
      <div className="mb-7">
        <SectionLabel>how do you want to connect?</SectionLabel>
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
                  padding: '12px 16px',
                  border:     `1px solid ${active ? '#9b85e8' : '#3a2b58'}`,
                  background:  active ? 'rgba(46,31,74,0.85)' : 'rgba(30,21,48,0.4)',
                }}
              >
                <span
                  className="flex items-center justify-center rounded-full flex-shrink-0"
                  style={{
                    width: '32px', height: '32px',
                    background: active ? 'rgba(155,133,232,0.2)' : 'rgba(58,43,88,0.4)',
                    fontSize: '14px',
                  }}
                >
                  {opt.icon}
                </span>
                <div className="flex-1">
                  <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '16px', color: active ? '#f0eaff' : '#a99abb' }}>
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

      {/* City search */}
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>{isOnline ? 'your city' : 'your city *'}</SectionLabel>
          {isOnline && (
            <span className="font-mono text-[9px] uppercase tracking-widest" style={{ color: '#5a4b78' }}>
              optional
            </span>
          )}
        </div>

        {isOnline && (
          <div
            className="rounded-xl px-4 py-3 mb-3 flex items-center gap-3"
            style={{ background: 'rgba(109,75,195,0.1)', border: '1px solid #4a3b6844' }}
          >
            <span style={{ fontSize: '13px' }}>💬</span>
            <p className="font-mono text-[10px] leading-relaxed" style={{ color: '#9b85e8' }}>
              Location is optional for online-only connections.
            </p>
          </div>
        )}

        {confirmed ? (
          <div
            className="rounded-xl px-4 py-3 flex items-center justify-between"
            style={{ border: '1px solid #9b85e8', background: 'rgba(155,133,232,0.08)' }}
          >
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1" style={{ color: '#7a6b9a' }}>
                confirmed
              </p>
              <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '17px', color: '#f0eaff' }}>
                {state.location_raw}
              </p>
            </div>
            <button
              type="button"
              onClick={clearCity}
              className="font-mono text-[10px] uppercase tracking-widest hover:text-[#f0eaff] transition-colors"
              style={{ color: '#9b85e8' }}
            >
              change
            </button>
          </div>
        ) : (
          <div className="relative">
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3 transition-colors"
              style={{
                border: `1px solid ${focused ? '#9b85e8' : '#3a2b58'}`,
                background: 'rgba(30,21,48,0.6)',
              }}
            >
              <span style={{ color: '#4a3b68', fontSize: '16px' }}>◎</span>
              <input
                type="text"
                value={query}
                onChange={e => search(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 180)}
                placeholder="e.g. Columbus, OH"
                autoComplete="off"
                className="flex-1 bg-transparent outline-none"
                style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '17px', color: '#f5efff' }}
              />
              {loading && (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-[#9b85e8] border-t-transparent animate-spin flex-shrink-0" />
              )}
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
    <span style={{ color: '#5a4b78', fontSize: '12px' }}>📍</span>
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

            {focused && query.length > 2 && suggestions.length === 0 && !loading && (
              <div style={{ ...dropdownWrap, padding: '14px 16px' }}>
                <p className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>
                  No cities found — try a different spelling
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Match distance — hidden for online only */}
      {!isOnline && (
        <div>
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
                  {active && <span className="font-mono text-[9px] ml-1.5" style={{ color: '#9b85e8' }}>✓</span>}
                </button>
              )
            })}
          </div>
          <p className="font-mono text-[9px] mt-4" style={{ color: '#4a3b68' }}>
            * required for in-person matching
          </p>
        </div>
      )}
    </Appear>
  )
}

// ── CollegeFlow ───────────────────────────────────────────────────────────────

function CollegeFlow({ onBack }: { onBack: () => void }) {
  const { state, set } = useOnboarding()
  const [query, setQuery]     = useState(state.college_name || '')
  const [results, setResults] = useState<{ name: string; country: string }[]>([])
  const [focused, setFocused] = useState(false)

  const search = (value: string) => {
    setQuery(value)
    set({ college_name: '', college_country: '' })
    if (!value.trim() || value.length < 2) { setResults([]); return }
    const q = value.toLowerCase()
    setResults(COLLEGES.filter(c => c.name.toLowerCase().includes(q)).slice(0, 8))
  }

  const select = (c: { name: string; country: string }) => {
    setQuery(c.name)
    set({ college_name: c.name, college_country: c.country, match_base: 'college' })
    setResults([])
    setFocused(false)
  }

  const clear = () => {
    set({ college_name: '', college_country: '' })
    setQuery('')
    setResults([])
  }

  const confirmed = !!state.college_name

  return (
    <Appear>
      <BackChip onClick={() => {
        set({ college_name: '', college_country: '', match_base: 'location' })
        onBack()
      }} />

      <SectionLabel>search your college</SectionLabel>

      {confirmed ? (
        <div
          className="rounded-xl px-4 py-3 flex items-center justify-between"
          style={{ border: '1px solid #9b85e8', background: 'rgba(155,133,232,0.08)' }}
        >
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] mb-1" style={{ color: '#7a6b9a' }}>
              your college
            </p>
            <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '17px', color: '#f0eaff' }}>
              {state.college_name}
            </p>
            <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78' }}>
              {state.college_country}
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="font-mono text-[10px] uppercase tracking-widest hover:text-[#f0eaff] transition-colors"
            style={{ color: '#9b85e8' }}
          >
            change
          </button>
        </div>
      ) : (
        <div className="relative">
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3"
            style={{
              border: `1px solid ${focused ? '#9b85e8' : '#3a2b58'}`,
              background: 'rgba(30,21,48,0.6)',
            }}
          >
            <span style={{ color: '#4a3b68', fontSize: '16px' }}>🎓</span>
            <input
              type="text"
              value={query}
              onChange={e => search(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 180)}
              placeholder="e.g. Harvard, NYU, Ohio State..."
              autoComplete="off"
              className="flex-1 bg-transparent outline-none"
              style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '17px', color: '#f5efff' }}
            />
          </div>

          {focused && results.length > 0 && (
            <div style={dropdownWrap}>
              {results.map((r, i) => (
                <button
                  key={r.name}
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
                  <span style={{ color: '#5a4b78', fontSize: '12px' }}>◎</span>
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

          {focused && query.length > 2 && results.length === 0 && (
            <div style={{ ...dropdownWrap, padding: '14px 16px' }}>
              <p className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>
                No results — try a shorter name
              </p>
            </div>
          )}
        </div>
      )}

      <p className="font-mono text-[10px] mt-4 leading-relaxed" style={{ color: '#4a3b68' }}>
        Your college is used as your location anchor for matching.
        You can also add a city later.
      </p>
    </Appear>
  )
}

// ── LocationScreen ────────────────────────────────────────────────────────────

export function LocationScreen() {
  const { state, set } = useOnboarding()
  const [step, setStep] = useState<Step>(() => {
    if (state.college_name) return 'college'
    if (state.location_raw) return 'city'
    return 'pick'
  })

  const pickCity    = () => { set({ match_base: 'location' }); setStep('city')    }
  const pickCollege = () => { set({ match_base: 'college'  }); setStep('college') }
  const goBack      = () => setStep('pick')

  if (step === 'city')    return <CityFlow    onBack={goBack} />
  if (step === 'college') return <CollegeFlow onBack={goBack} />

  return (
    <Appear>
      <Heading>where are you?</Heading>
      <Sub>this sets how we find people near you</Sub>

      <div className="flex flex-col gap-3 mt-2">
        <button
          type="button"
          onClick={pickCity}
          className="group rounded-2xl text-left transition-all duration-200 hover:border-[#9b85e8]"
          style={{
            padding: '20px',
            border: '1px solid #3a2b58',
            background: 'rgba(30,21,48,0.5)',
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="flex items-center justify-center rounded-full flex-shrink-0 text-xl"
              style={{ width: '48px', height: '48px', background: 'rgba(58,43,88,0.6)' }}
            >
              📍
            </span>
            <div>
              <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '20px', color: '#f0eaff' }}>
                I live in a city
              </p>
              <p className="font-mono text-[11px] mt-1" style={{ color: '#5a4b78' }}>
                Choose your city + match distance
              </p>
            </div>
            <span className="ml-auto font-mono text-[#3a2b58] group-hover:text-[#9b85e8] transition-colors text-lg">
              →
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={pickCollege}
          className="group rounded-2xl text-left transition-all duration-200 hover:border-[#9b85e8]"
          style={{
            padding: '20px',
            border: '1px solid #3a2b58',
            background: 'rgba(30,21,48,0.5)',
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="flex items-center justify-center rounded-full flex-shrink-0 text-xl"
              style={{ width: '48px', height: '48px', background: 'rgba(58,43,88,0.6)' }}
            >
              🎓
            </span>
            <div>
              <p style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '20px', color: '#f0eaff' }}>
                I'm at college
              </p>
              <p className="font-mono text-[11px] mt-1" style={{ color: '#5a4b78' }}>
                Use your campus as your anchor
              </p>
            </div>
            <span className="ml-auto font-mono text-[#3a2b58] group-hover:text-[#9b85e8] transition-colors text-lg">
              →
            </span>
          </div>
        </button>
      </div>
    </Appear>
  )
}
