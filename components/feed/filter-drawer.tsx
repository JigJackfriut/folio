'use client'

import { useState, useMemo, useEffect } from 'react'
import { TAG_CATEGORIES } from '@/lib/tags'

interface Props {
  open: boolean
  onClose: () => void
  crossedTags: string[]
  onToggleCrossed: (tag: string) => void
}

const ALL_TAGS = Object.values(TAG_CATEGORIES)
  .flatMap(sections => Object.values(sections).flat())
  .filter((tag, i, arr) => arr.indexOf(tag) === i)
  .sort()

export function FilterDrawer({ open, onClose, crossedTags, onToggleCrossed }: Props) {
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<'exclude'>('exclude')

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_TAGS.slice(0, 60)
    const q = search.toLowerCase()
    return ALL_TAGS.filter(t => t.toLowerCase().includes(q)).slice(0, 60)
  }, [search])

  // close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.25s',
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '50%',
          transform: `translateX(-50%) translateY(${open ? '0' : '100%'})`,
          width: '100%',
          maxWidth: '576px',
          maxHeight: '80vh',
          background: '#1a1230',
          borderRadius: '20px 20px 0 0',
          border: '1px solid #2e2040',
          borderBottom: 'none',
          zIndex: 50,
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: '#3a2b58' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 flex-shrink-0"
          style={{ borderBottom: '1px solid #2a1f42' }}
        >
          <p style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontStyle: 'italic',
            fontSize: '20px',
            color: '#f0eaff',
          }}>
            filter feed
          </p>
          <div className="flex items-center gap-3">
            {crossedTags.length > 0 && (
              <button
                type="button"
                onClick={() => crossedTags.forEach(t => onToggleCrossed(t))}
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: '#f87171' }}
              >
                clear all
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: '#5a4b78' }}
            >
              done
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-5 py-3 flex-shrink-0" style={{ borderBottom: '1px solid #2a1f42' }}>
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-2.5"
            style={{ background: 'rgba(30,21,48,0.8)', border: '1px solid #3a2b58' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a3b68" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search tags..."
              className="flex-1 bg-transparent outline-none"
              style={{
                fontFamily: 'EB Garamond, Georgia, serif',
                fontSize: '15px',
                color: '#f0eaff',
              }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="font-mono text-[11px]"
                style={{ color: '#4a3b68' }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Active crossed tags summary */}
        {crossedTags.length > 0 && (
          <div
            className="px-5 py-3 flex-shrink-0 flex flex-wrap gap-2"
            style={{ borderBottom: '1px solid #2a1f42' }}
          >
            <p className="font-mono text-[9px] uppercase tracking-widest w-full mb-1" style={{ color: '#7a4040' }}>
              excluded — {crossedTags.length} tag{crossedTags.length > 1 ? 's' : ''}
            </p>
            {crossedTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleCrossed(tag)}
                className="font-mono text-[10px] rounded-full flex items-center gap-1.5 transition-all"
                style={{
                  padding: '3px 10px',
                  background: 'rgba(120,48,48,0.25)',
                  border: '1px solid #7a3030',
                  color: '#f87171',
                }}
              >
                <span style={{ textDecoration: 'line-through' }}>{tag}</span>
                <span style={{ fontSize: '10px' }}>✕</span>
              </button>
            ))}
          </div>
        )}

        {/* Section label */}
        <div className="px-5 pt-4 pb-2 flex-shrink-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: '#5a4b78' }}>
            tap a tag to exclude it from your feed
          </p>
        </div>

        {/* Tag grid */}
        <div
          className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-thin"
          style={{ minHeight: 0 }}
        >
          <div className="flex flex-wrap gap-2 pt-1">
            {filtered.map(tag => {
              const excluded = crossedTags.includes(tag)
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleCrossed(tag)}
                  className="font-mono transition-all duration-150"
                  style={{
                    fontSize: '11px',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${excluded ? '#7a3030' : '#3a2b58'}`,
                    background: excluded ? 'rgba(120,48,48,0.2)' : 'rgba(30,21,48,0.6)',
                    color: excluded ? '#f87171' : '#a090c0',
                    textDecoration: excluded ? 'line-through' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {excluded ? `✕ ${tag}` : tag}
                </button>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <p
              className="font-mono text-[11px] text-center py-8"
              style={{ color: '#4a3b68' }}
            >
              no tags found
            </p>
          )}
        </div>
      </div>
    </>
  )
}
