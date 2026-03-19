'use client'

import { useState, useMemo } from 'react'
import { TAG_CATEGORIES, POPULAR_TAGS, CATEGORY_LABELS, type TagEntry, type TagTier } from '@/lib/tags'

// ── Tier config ───────────────────────────────────────────────────────────────

const TIERS: { id: TagTier; symbol: string; label: string }[] = [
  { id: 'public',  symbol: '◎', label: 'public'  },
  { id: 'shared',  symbol: '⬡', label: 'matched' },
  { id: 'filter',  symbol: '▿', label: 'filter'  },
]

// ── Selected tag chip ─────────────────────────────────────────────────────────

function SelectedTag({
  name,
  tier,
  onTierChange,
  onRemove,
}: {
  name: string
  tier: TagTier
  onTierChange: (t: TagTier) => void
  onRemove: () => void
}) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full"
      style={{
        padding: '6px 10px 6px 13px',
        background: '#2e1f4a',
        border: '1px solid #9b85e8',
      }}
    >
      {/* Tag name */}
      <span style={{ fontSize: '12px', color: '#f0eaff', whiteSpace: 'nowrap' }}>{name}</span>

      {/* Tier icons — all three always visible */}
      <div className="flex items-center gap-1">
        {TIERS.map(t => (
          <button
            key={t.id}
            type="button"
            onClick={() => onTierChange(t.id)}
            title={t.label}
            style={{
              fontSize: '11px',
              color: tier === t.id ? '#ffffff' : '#4a3b68',
              lineHeight: 1,
              padding: '2px',
              transition: 'color 0.1s',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {t.symbol}
          </button>
        ))}
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        style={{
          fontSize: '10px',
          color: '#4a3b68',
          lineHeight: 1,
          padding: '2px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '2px',
        }}
      >
        ✕
      </button>
    </div>
  )
}

// ── Pool tag chip ─────────────────────────────────────────────────────────────

function PoolTag({
  name,
  isHot,
  onClick,
}: {
  name: string
  isHot: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full transition-all duration-150"
      style={{
        padding: '6px 13px',
        fontSize: '12px',
        border: '1px solid #3a2b58',
        background: 'transparent',
        color: '#7a6b9a',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#6d4bc3'
        e.currentTarget.style.color = '#c3b3ff'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#3a2b58'
        e.currentTarget.style.color = '#7a6b9a'
      }}
    >
      {name}
      {isHot && (
        <span style={{ fontSize: '8px', background: 'rgba(250,199,117,0.15)', color: '#FAC775', padding: '1px 5px', borderRadius: '99px' }}>
          hot
        </span>
      )}
    </button>
  )
}

// ── Main TagPicker ────────────────────────────────────────────────────────────

export function TagPicker({
  value,
  onChange,
}: {
  value: TagEntry[]
  onChange: (tags: TagEntry[]) => void
}) {
  const [activeCategory, setActiveCategory] = useState('popular')
  const [search, setSearch] = useState('')

  const selectedNames = new Set(value.map(t => t.name))

  const addTag = (name: string) => {
    if (selectedNames.has(name)) return
    onChange([...value, { name, tier: 'public' }])
  }

  const removeTag = (name: string) => {
    onChange(value.filter(t => t.name !== name))
  }

  const changeTier = (name: string, tier: TagTier) => {
    onChange(value.map(t => t.name === name ? { ...t, tier } : t))
  }

  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return Object.entries(TAG_CATEGORIES[activeCategory] ?? {})
    const result: [string, string[]][] = []
    Object.values(TAG_CATEGORIES).forEach(sections => {
      Object.entries(sections).forEach(([label, tags]) => {
        const matched = tags.filter(t => t.toLowerCase().includes(q))
        if (matched.length) result.push([label, matched])
      })
    })
    return result
  }, [activeCategory, search])

  return (
    <div className="flex flex-col gap-4">

      {/* ── Selected area ── */}
      {value.length > 0 && (
        <div
          className="rounded-2xl p-4"
          style={{ border: '1px solid #2a1f42', background: 'rgba(30,21,48,0.6)' }}
        >
          {/* Persistent legend */}
          <div className="flex items-center gap-3 mb-3">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: '#4a3b68' }}>
              {value.length} selected
            </p>
            <div className="flex items-center gap-2 ml-auto">
              {TIERS.map(t => (
                <span key={t.id} className="font-mono text-[9px]" style={{ color: '#4a3b68' }}>
                  <span style={{ color: '#7a6b9a' }}>{t.symbol}</span> {t.label}
                </span>
              ))}
            </div>
          </div>

          {/* Selected tags */}
          <div className="flex flex-wrap gap-2">
            {value.map(({ name, tier }) => (
              <SelectedTag
                key={name}
                name={name}
                tier={tier}
                onTierChange={t => changeTier(name, t)}
                onRemove={() => removeTag(name)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Search ── */}
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4a3b68', fontSize: '14px' }}>
          ⌕
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search interests..."
          className="w-full bg-transparent outline-none transition-colors"
          style={{
            paddingLeft: '20px',
            paddingBottom: '9px',
            borderBottom: '1px solid #3a2b58',
            fontSize: '13px',
            color: '#f5efff',
          }}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#9b85e8' }}
          onBlur={e => { e.currentTarget.style.borderBottomColor = '#3a2b58' }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-0 top-1/2 -translate-y-1/2"
            style={{ color: '#4a3b68', fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Category tabs ── */}
      {!search && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {Object.keys(TAG_CATEGORIES).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1.5 rounded-full font-mono whitespace-nowrap border transition-all"
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                background: activeCategory === cat ? '#2e1f4a' : 'transparent',
                borderColor: activeCategory === cat ? '#9b85e8' : '#3a2b58',
                color: activeCategory === cat ? '#f5efff' : '#7a6b9a',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* ── Pool ── */}
      <div
        className="overflow-y-auto space-y-5 scrollbar-thin"
        style={{ maxHeight: '320px', paddingRight: '4px' }}
      >
        {filteredSections.map(([section, tags]) => {
          // Only show tags not already selected
          const poolTags = tags.filter(t => !selectedNames.has(t))
          if (poolTags.length === 0) return null
          return (
            <div key={section}>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.1em] mb-2"
                style={{ color: '#4a3b68' }}
              >
                {section}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {poolTags.map(tag => (
                  <PoolTag
                    key={tag}
                    name={tag}
                    isHot={POPULAR_TAGS.has(tag)}
                    onClick={() => addTag(tag)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {filteredSections.every(([, tags]) => tags.every(t => selectedNames.has(t))) && (
          <p className="text-[12px] py-4" style={{ color: '#4a3b68' }}>
            {search ? `No results for "${search}"` : 'All tags in this category selected'}
          </p>
        )}
      </div>

      {/* ── Empty state hint ── */}
      {value.length === 0 && (
        <p className="font-mono text-[10px] text-center" style={{ color: '#3a2b58' }}>
          tap any tag above to add it
        </p>
      )}
    </div>
  )
}
