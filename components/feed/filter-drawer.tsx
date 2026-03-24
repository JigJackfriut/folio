'use client'

import { useState, useMemo, useEffect } from 'react'
import { TAG_CATEGORIES } from '@/lib/tags'

interface Props {
  open: boolean
  onClose: () => void
  crossedTags: string[]
  onToggleCrossed: (tag: string) => void
}

type FilterTab = 'exclude'

const CATEGORY_ORDER = ['popular', 'lifestyle', 'interests', 'identity', 'communities']

const SECTIONS = CATEGORY_ORDER.flatMap(cat => {
  const sections = TAG_CATEGORIES[cat]
  if (!sections) return []
  return Object.entries(sections).map(([label, tags]) => ({ label, tags }))
})

const ALL_TAGS = SECTIONS.flatMap(s => s.tags)
  .filter((t, i, arr) => arr.indexOf(t) === i)

export function FilterDrawer({ open, onClose, crossedTags, onToggleCrossed }: Props) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return ALL_TAGS.filter(t => t.toLowerCase().includes(q)).slice(0, 40)
  }, [search])

  const clearAll = () => {
    crossedTags.forEach(t => onToggleCrossed(t))
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.2s',
        }}
      />

      {/* Sheet */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${open ? '0' : '100%'})`,
          width: '100%',
          maxWidth: '576px',
          height: '82vh',
          background: '#160f24',
          borderRadius: '20px 20px 0 0',
          border: '1px solid #2e2040',
          borderBottom: 'none',
          zIndex: 50,
          transition: 'transform 0.38s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div style={{ width: '32px', height: '3px', borderRadius: '2px', background: '#3a2b58' }} />
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 pb-4 flex-shrink-0">
          <div>
            <p style={{
              fontFamily: 'EB Garamond, Georgia, serif',
              fontStyle: 'italic',
              fontSize: '22px',
              color: '#f0eaff',
            }}>
              filter feed
            </p>
            <p className="font-mono text-[10px] mt-0.5" style={{ color: '#5a4b78', letterSpacing: '0.06em' }}>
              {crossedTags.length === 0
                ? 'tap tags to hide them from your feed'
                : `${crossedTags.length} tag${crossedTags.length > 1 ? 's' : ''} excluded`
              }
            </p>
          </div>
          <div className="flex items-center gap-4">
            {crossedTags.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                clear
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: '#9b85e8', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              done →
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 pb-3 flex-shrink-0">
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#1e1530', border: '1px solid #3a2b58' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4a3b68" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search tags..."
              className="flex-1 bg-transparent outline-none font-mono"
              style={{ fontSize: '12px', color: '#c8c0e0', letterSpacing: '0.02em' }}
            />
            {search && (
              <button type="button" onClick={() => setSearch('')}
                style={{ color: '#4a3b68', background: 'none', border: 'none', cursor: 'pointer', fontSize: '11px' }}>
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Excluded summary strip */}
        {crossedTags.length > 0 && (
          <div
            className="flex-shrink-0 px-5 py-2 flex flex-wrap gap-1.5"
            style={{ borderTop: '1px solid #1e1530', borderBottom: '1px solid #1e1530', background: 'rgba(120,48,48,0.08)' }}
          >
            <p className="font-mono text-[9px] uppercase tracking-widest w-full mb-1" style={{ color: '#7a4040' }}>
              hidden from feed
            </p>
            {crossedTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleCrossed(tag)}
                className="font-mono text-[10px] rounded-full flex items-center gap-1 transition-all"
                style={{
                  padding: '3px 8px',
                  background: 'rgba(120,48,48,0.2)',
                  border: '1px solid #7a3030',
                  color: '#f87171',
                  cursor: 'pointer',
                }}
              >
                <span style={{ textDecoration: 'line-through', opacity: 0.8 }}>{tag}</span>
                <span style={{ fontSize: '9px', marginLeft: '2px' }}>✕</span>
              </button>
            ))}
          </div>
        )}

        {/* Tag content — scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pt-3 pb-24" style={{ minHeight: 0 }}>

          {/* Search results */}
          {searchResults !== null ? (
            <div>
              {searchResults.length === 0 ? (
                <p className="font-mono text-[11px] text-center py-12" style={{ color: '#4a3b68' }}>
                  no tags found
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {searchResults.map(tag => (
                    <TagChip
                      key={tag}
                      tag={tag}
                      excluded={crossedTags.includes(tag)}
                      onToggle={() => onToggleCrossed(tag)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (

            /* Sections */
            <div className="flex flex-col gap-6">
              {SECTIONS.map(section => (
                <div key={section.label}>
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.14em] mb-2"
                    style={{ color: '#4a3b68' }}
                  >
                    {section.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map(tag => (
                      <TagChip
                        key={tag}
                        tag={tag}
                        excluded={crossedTags.includes(tag)}
                        onToggle={() => onToggleCrossed(tag)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function TagChip({ tag, excluded, onToggle }: {
  tag: string
  excluded: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="font-mono transition-all duration-150"
      style={{
        fontSize: '11px',
        padding: '5px 11px',
        borderRadius: '20px',
        border: `1px solid ${excluded ? '#7a3030' : '#2e2040'}`,
        background: excluded ? 'rgba(120,48,48,0.18)' : 'rgba(30,21,48,0.5)',
        color: excluded ? '#f87171' : '#8a7aaa',
        cursor: 'pointer',
        textDecoration: excluded ? 'line-through' : 'none',
      }}
      onMouseEnter={e => {
        if (!excluded) e.currentTarget.style.borderColor = '#4a3b6a'
      }}
      onMouseLeave={e => {
        if (!excluded) e.currentTarget.style.borderColor = '#2e2040'
      }}
    >
      {excluded ? `✕ ${tag}` : tag}
    </button>
  )
}
