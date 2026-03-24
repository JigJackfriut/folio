'use client'

import { useState, useMemo, useEffect } from 'react'
import { TAG_CATEGORIES } from '@/lib/tags'

interface Props {
  open: boolean
  onClose: () => void
  crossedTags: string[]
  includedTags: string[]
  onToggleCrossed: (tag: string) => void
  onToggleIncluded: (tag: string) => void
}

type Tab = 'include' | 'exclude'

const CATEGORY_ORDER = ['popular', 'lifestyle', 'interests', 'identity', 'communities']

const SECTIONS = CATEGORY_ORDER.flatMap(cat => {
  const sections = TAG_CATEGORIES[cat]
  if (!sections) return []
  return Object.entries(sections).map(([label, tags]) => ({ label, tags }))
})

const ALL_TAGS = SECTIONS.flatMap(s => s.tags)
  .filter((t, i, arr) => arr.indexOf(t) === i)

export function FilterDrawer({
  open, onClose,
  crossedTags, includedTags,
  onToggleCrossed, onToggleIncluded,
}: Props) {
  const [tab, setTab] = useState<Tab>('include')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Reset search when switching tabs
  const switchTab = (t: Tab) => { setTab(t); setSearch('') }

  const searchResults = useMemo(() => {
    if (!search.trim()) return null
    const q = search.toLowerCase()
    return ALL_TAGS.filter(t => t.toLowerCase().includes(q)).slice(0, 50)
  }, [search])

  const activeTags   = tab === 'include' ? includedTags : crossedTags
  const onToggle     = tab === 'include' ? onToggleIncluded : onToggleCrossed

  const clearAll = () => activeTags.forEach(t => onToggle(t))

  const totalActive = includedTags.length + crossedTags.length

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.2s',
        }}
      />

      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${open ? '0' : '100%'})`,
          width: '100%',
          maxWidth: '576px',
          height: '80vh',
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
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div style={{ width: '32px', height: '3px', borderRadius: '2px', background: '#2e2040' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 flex-shrink-0">
          <p style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '22px',
            color: '#f0eaff',
          }}>
            filter feed
          </p>
          <div className="flex items-center gap-4">
            {activeTags.length > 0 && (
              <button
                type="button" onClick={clearAll}
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                clear
              </button>
            )}
            <button
              type="button" onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: '#9b85e8', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              done →
            </button>
          </div>
        </div>

        {/* Tab toggle */}
        <div className="px-5 pb-3 flex-shrink-0">
          <div
            className="flex rounded-xl p-1"
            style={{ background: '#1e1530', border: '1px solid #2a1f42' }}
          >
            {(['include', 'exclude'] as Tab[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className="flex-1 rounded-lg py-2.5 transition-all"
                style={{
                  background: tab === t
                    ? t === 'include' ? '#2a3d2a' : '#3d1a1a'
                    : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  fontWeight: tab === t ? 700 : 400,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: tab === t
                    ? t === 'include' ? '#6ee7a0' : '#f87171'
                    : '#5a4b78',
                }}
              >
                {t === 'include'
                  ? `show ${includedTags.length > 0 ? `(${includedTags.length})` : ''}`
                  : `hide ${crossedTags.length > 0 ? `(${crossedTags.length})` : ''}`
                }
              </button>
            ))}
          </div>

          {/* Context line */}
          <p className="font-mono text-[10px] mt-2 px-1" style={{ color: '#4a3b68', letterSpacing: '0.04em' }}>
            {tab === 'include'
              ? includedTags.length === 0
                ? 'only show posts from people with these tags'
                : `showing posts tagged: ${includedTags.join(', ')}`
              : crossedTags.length === 0
                ? 'hide posts from people with these tags'
                : `hiding posts tagged: ${crossedTags.join(', ')}`
            }
          </p>
        </div>

        {/* Active tags strip */}
        {activeTags.length > 0 && (
          <div
            className="flex-shrink-0 px-5 py-2.5 flex flex-wrap gap-1.5"
            style={{
              borderTop: '1px solid #1e1530',
              background: tab === 'include' ? 'rgba(42,61,42,0.2)' : 'rgba(61,26,26,0.2)',
            }}
          >
            {activeTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggle(tag)}
                className="font-mono text-[10px] rounded-full flex items-center gap-1 transition-all"
                style={{
                  padding: '3px 9px',
                  background: tab === 'include' ? 'rgba(42,61,42,0.4)' : 'rgba(61,26,26,0.3)',
                  border: `1px solid ${tab === 'include' ? '#2a5a2a' : '#7a3030'}`,
                  color: tab === 'include' ? '#6ee7a0' : '#f87171',
                  cursor: 'pointer',
                }}
              >
                {tab === 'include' ? `✓ ${tag}` : `✕ ${tag}`}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="px-5 py-3 flex-shrink-0" style={{ borderTop: '1px solid #1e1530' }}>
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2.5"
            style={{ background: '#1e1530', border: '1px solid #2e2040' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4a3b68" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={`search tags to ${tab}...`}
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

        {/* Tags */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-24" style={{ minHeight: 0 }}>
          {searchResults !== null ? (
            <div className="flex flex-wrap gap-2 pt-2">
              {searchResults.length === 0 ? (
                <p className="font-mono text-[11px] w-full text-center py-12" style={{ color: '#4a3b68' }}>
                  no tags found
                </p>
              ) : searchResults.map(tag => (
                <TagChip
                  key={tag}
                  tag={tag}
                  state={
                    activeTags.includes(tag) ? tab : 'neutral'
                  }
                  mode={tab}
                  onToggle={() => onToggle(tag)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-5 pt-2">
              {SECTIONS.map(section => (
                <div key={section.label}>
                  <p
                    className="font-mono text-[9px] uppercase tracking-[0.14em] mb-2"
                    style={{ color: '#3a2b58' }}
                  >
                    {section.label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {section.tags.map(tag => (
                      <TagChip
                        key={tag}
                        tag={tag}
                        state={activeTags.includes(tag) ? tab : 'neutral'}
                        mode={tab}
                        onToggle={() => onToggle(tag)}
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

function TagChip({ tag, state, mode, onToggle }: {
  tag: string
  state: 'include' | 'exclude' | 'neutral'
  mode: Tab
  onToggle: () => void
}) {
  const isActive = state !== 'neutral'
  const isInclude = state === 'include'
  const isExclude = state === 'exclude'

  return (
    <button
      type="button"
      onClick={onToggle}
      className="font-mono transition-all duration-150"
      style={{
        fontSize: '11px',
        padding: '5px 12px',
        borderRadius: '20px',
        border: `1px solid ${
          isInclude ? '#2a5a2a' :
          isExclude ? '#7a3030' :
          '#2e2040'
        }`,
        background: isInclude
          ? 'rgba(42,90,42,0.2)'
          : isExclude
          ? 'rgba(120,48,48,0.18)'
          : 'rgba(30,21,48,0.5)',
        color: isInclude
          ? '#6ee7a0'
          : isExclude
          ? '#f87171'
          : '#8a7aaa',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          e.currentTarget.style.borderColor = mode === 'include' ? '#2a5a2a' : '#7a3030'
          e.currentTarget.style.color = mode === 'include' ? '#6ee7a0' : '#f87171'
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          e.currentTarget.style.borderColor = '#2e2040'
          e.currentTarget.style.color = '#8a7aaa'
        }
      }}
    >
      {isInclude ? `✓ ${tag}` : isExclude ? `✕ ${tag}` : tag}
    </button>
  )
}
