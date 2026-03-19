'use client'

import { useState, useMemo } from 'react'
import { TAG_CATEGORIES, POPULAR_TAGS, CATEGORY_LABELS, type TagEntry, type TagTier } from '@/lib/tags'

// ── Tier colors ───────────────────────────────────────────────────────────────

const TIER_CONFIG: Record<TagTier, { label: string; activeColor: string; activeBg: string }> = {
  public:  { label: 'Public',  activeColor: '#fff', activeBg: '#7c3aed' },
  shared:  { label: 'Match',   activeColor: '#fff', activeBg: '#b45309' },
  filter:  { label: 'Filter',  activeColor: '#fff', activeBg: '#0f766e' },
}

const TIER_ORDER: TagTier[] = ['public', 'shared', 'filter']

// ── Segmented control ─────────────────────────────────────────────────────────

function TierToggle({
  tier,
  onChange,
}: {
  tier: TagTier
  onChange: (t: TagTier) => void
}) {
  return (
    <div
      className="flex items-center rounded-full overflow-hidden"
      style={{
        background: 'rgba(0,0,0,0.3)',
        border: '1px solid #2a1f42',
        height: '22px',
      }}
    >
      {TIER_ORDER.map(t => {
        const config = TIER_CONFIG[t]
        const isActive = tier === t
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className="transition-all duration-150"
            style={{
              padding: '0 8px',
              height: '100%',
              fontSize: '10px',
              fontFamily: 'monospace',
              fontWeight: isActive ? 600 : 400,
              background: isActive ? config.activeBg : 'transparent',
              color: isActive ? config.activeColor : '#4a3b68',
              letterSpacing: '0.03em',
              whiteSpace: 'nowrap',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {config.label}
          </button>
        )
      })}
    </div>
  )
}

// ── Selected tag ──────────────────────────────────────────────────────────────

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
  const config = TIER_CONFIG[tier]
  return (
    <div
      className="flex items-center gap-2 rounded-2xl"
      style={{
        padding: '8px 12px',
        background: 'rgba(30,21,48,0.8)',
        border: `1px solid ${config.activeBg}`,
      }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span style={{ fontSize: '13px', color: '#f0eaff' }}>{name}</span>
        <TierToggle tier={tier} onChange={onTierChange} />
      </div>
      <button
        type="button"
        onClick={onRemove}
        style={{
          fontSize: '11px',
          color: '#3a2b58',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginLeft: '2px',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  )
}

// ── Pool tag ──────────────────────────────────────────────────────────────────

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
        e.currentTarget.style.borderColor = '#7c3aed'
        e.currentTarget.style.color = '#c4b5fd'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#3a2b58'
        e.currentTarget.style.color = '#7a6b9a'
      }}
    >
      {name}
      {isHot && (
        <span style={{
          fontSize: '8px',
          background: 'rgba(250,199,117,0.15)',
          color: '#FAC775',
          padding: '1px 5px',
          borderRadius: '99px',
        }}>
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
    <div className="flex flex-col gap-5">

      {/* ── Legend ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {TIER_ORDER.map(t => {
          const c = TIER_CONFIG[t]
          return (
            <div key={t} className="flex items-center gap-1.5">
              <span
                className="rounded-full"
                style={{ width: '8px', height: '8px', background: c.activeBg, display: 'inline-block', flexShrink: 0 }}
              />
              <span className="font-mono text-[10px]" style={{ color: '#5a4b78' }}>
                <span style={{ color: '#a99abb' }}>{c.label}</span>
                {t === 'public'  && ' — everyone sees this'}
                {t === 'shared'  && ' — revealed on match'}
                {t === 'filter'  && ' — invisible, filters your feed'}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Selected area ── */}
      {value.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: '#4a3b68' }}>
            {value.length} tag{value.length !== 1 ? 's' : ''} added
          </p>
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
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: '#4a3b68', fontSize: '14px' }}
        >
          ⌕
        </span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search interests..."
          className="w-full bg-transparent outline-none transition-colors"
          style={{
            paddingLeft: '22px',
            paddingBottom: '9px',
            borderBottom: '1px solid #3a2b58',
            fontSize: '13px',
            color: '#f5efff',
          }}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#7c3aed' }}
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
                borderColor: activeCategory === cat ? '#7c3aed' : '#3a2b58',
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
        style={{ maxHeight: '340px', paddingRight: '4px' }}
      >
        {filteredSections.map(([section, tags]) => {
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
      </div>

      {value.length === 0 && (
        <p className="font-mono text-[10px] text-center" style={{ color: '#3a2b58' }}>
          tap any tag to add it
        </p>
      )}
    </div>
  )
}

