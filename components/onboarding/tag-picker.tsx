'use client'

import { useState, useMemo } from 'react'
import { TAG_CATEGORIES, POPULAR_TAGS, CATEGORY_LABELS, type TagEntry, type TagTier } from '@/lib/tags'

const TIERS: { id: TagTier; label: string; icon: string; desc: string; color: string; bg: string; border: string }[] = [
  { id: 'public',  label: 'Public',  icon: '◎', desc: 'On your profile',    color: '#e8e0ff', bg: 'rgba(155,133,232,0.12)', border: '#9b85e8' },
  { id: 'shared',  label: 'Matched', icon: '⬡', desc: 'Mutual matches only', color: '#c3b3ff', bg: 'rgba(127,119,221,0.12)', border: '#7F77DD' },
  { id: 'filter',  label: 'Filter',  icon: '▿', desc: 'Hidden preference',   color: '#5DCAA5', bg: 'rgba(29,158,117,0.12)',  border: '#1D9E75' },
]

const TIER_MAP = Object.fromEntries(TIERS.map(t => [t.id, t])) as Record<TagTier, (typeof TIERS)[0]>

export function TagPicker({
  value,
  onChange,
}: {
  value: TagEntry[]
  onChange: (tags: TagEntry[]) => void
}) {
  const [activeCategory, setActiveCategory] = useState('popular')
  const [search, setSearch] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  // ── Phase 1: toggle selection (all start as public) ──────────────────────
  const handleToggleTag = (name: string) => {
    const exists = value.find(t => t.name === name)
    if (exists) {
      onChange(value.filter(t => t.name !== name))
    } else {
      onChange([...value, { name, tier: 'public' }])
    }
  }

  // ── Phase 2: change tier in refine view ──────────────────────────────────
  const updateTier = (name: string, tier: TagTier) => {
    onChange(value.map(t => t.name === name ? { ...t, tier } : t))
  }

  const removeTag = (name: string) => {
    onChange(value.filter(t => t.name !== name))
  }

  // ── Filtered tag sections ────────────────────────────────────────────────
  const filteredSections = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) {
      return Object.entries(TAG_CATEGORIES[activeCategory] ?? {})
    }
    const result: [string, string[]][] = []
    Object.values(TAG_CATEGORIES).forEach(sections => {
      Object.entries(sections).forEach(([label, tags]) => {
        const matched = tags.filter(t => t.toLowerCase().includes(q))
        if (matched.length) result.push([label, matched])
      })
    })
    return result
  }, [activeCategory, search])

  // ── Phase 2: Refine view ─────────────────────────────────────────────────
  if (isRefining) {
    return (
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => setIsRefining(false)}
          className="font-mono text-[11px] uppercase tracking-widest transition-colors"
          style={{ color: '#7a6b9a' }}
        >
          ← back to adding
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.1em]" style={{ color: '#4a3b68' }}>
          drag tags between groups to set visibility
        </p>

        {TIERS.map(tier => {
          const tierTags = value.filter(t => t.tier === tier.id)
          return (
            <div
              key={tier.id}
              className="rounded-2xl p-4"
              style={{ border: `1px solid ${tier.border}`, background: tier.bg }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span style={{ color: tier.color, fontSize: '14px' }}>{tier.icon}</span>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: tier.color }}
                >
                  {tier.label}
                </span>
                <span className="text-[10px]" style={{ color: '#5a4b78' }}>
                  — {tier.desc}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 min-h-[32px]">
                {tierTags.map(tag => (
                  <div
                    key={tag.name}
                    className="inline-flex items-center gap-1.5 rounded-full border"
                    style={{
                      padding: '5px 12px',
                      borderColor: tier.border,
                      background: 'rgba(27,19,40,0.6)',
                      color: tier.color,
                      fontSize: '12px',
                    }}
                  >
                    <span>{tag.name}</span>
                    {/* Move to another tier */}
                    <select
                      className="bg-transparent border-none outline-none cursor-pointer transition-opacity"
                      style={{ fontSize: '10px', color: tier.color, opacity: 0.5 }}
                      defaultValue=""
                      onChange={e => {
                        if (e.target.value) {
                          updateTier(tag.name, e.target.value as TagTier)
                          e.target.value = ''
                        }
                      }}
                    >
                      <option value="" disabled>move</option>
                      {TIERS.filter(t => t.id !== tier.id).map(t => (
                        <option key={t.id} value={t.id} style={{ background: '#1b1328' }}>
                          → {t.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => removeTag(tag.name)}
                      style={{ fontSize: '10px', opacity: 0.4, color: tier.color }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {tierTags.length === 0 && (
                  <p className="text-[11px] italic" style={{ color: '#3a2b58' }}>
                    none assigned here
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Phase 1: Selection view ──────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Search + Refine button */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
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
              paddingLeft: '20px',
              paddingBottom: '9px',
              borderBottom: '1px solid #3a2b58',
              fontSize: '13px',
              color: '#f5efff',
            }}
            onFocus={e => { e.currentTarget.style.borderBottomColor = '#9b85e8' }}
            onBlur={e => { e.currentTarget.style.borderBottomColor = '#3a2b58' }}
          />
        </div>

        {value.length > 0 && (
          <button
            type="button"
            onClick={() => setIsRefining(true)}
            className="rounded-full font-mono uppercase transition-all flex-shrink-0"
            style={{
              padding: '7px 14px',
              background: '#6d4bc3',
              color: '#f0eaff',
              fontSize: '10px',
              letterSpacing: '0.05em',
            }}
          >
            refine · {value.length}
          </button>
        )}
      </div>

      {/* Category tabs */}
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

      {/* Tag grid */}
      <div
        className="overflow-y-auto space-y-5 scrollbar-thin"
        style={{ maxHeight: '280px', paddingRight: '4px' }}
      >
        {filteredSections.map(([section, tags]) => (
          <div key={section}>
            <p
              className="font-mono text-[10px] uppercase tracking-[0.1em] mb-2"
              style={{ color: '#4a3b68' }}
            >
              {section}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tags.map(tag => {
                const entry = value.find(t => t.name === tag)
                const isSelected = !!entry
                const tierConfig = entry ? TIER_MAP[entry.tier] : null
                const isHot = POPULAR_TAGS.has(tag)

                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className="inline-flex items-center gap-1.5 rounded-xl border transition-all duration-200"
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderColor: isSelected ? (tierConfig?.border ?? '#9b85e8') : '#2a1f42',
                      background: isSelected ? (tierConfig?.bg ?? 'rgba(155,133,232,0.12)') : 'transparent',
                      color: isSelected ? (tierConfig?.color ?? '#e8e0ff') : '#7a6b9a',
                    }}
                  >
                    {isSelected && tierConfig && (
                      <span style={{ fontSize: '9px', opacity: 0.8 }}>{tierConfig.icon}</span>
                    )}
                    {tag}
                    {isHot && !isSelected && (
                      <span
                        style={{
                          fontSize: '8px',
                          background: 'rgba(250,199,117,0.15)',
                          color: '#FAC775',
                          padding: '1px 5px',
                          borderRadius: '99px',
                        }}
                      >
                        hot
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <p className="text-[12px] py-4" style={{ color: '#4a3b68' }}>
            No tags found for &ldquo;{search}&rdquo;
          </p>
        )}
      </div>

      {/* Tier hint strip — only shows after first selection */}
      {value.length > 0 && (
        <div
          className="flex items-stretch rounded-xl overflow-hidden"
          style={{ border: '1px solid #2a1f42' }}
        >
          {TIERS.map((tier, i) => (
            <div
              key={tier.id}
              className="flex-1 flex flex-col items-center gap-0.5 py-2 px-1"
              style={{
                background: tier.bg,
                borderRight: i < 2 ? '1px solid #2a1f42' : undefined,
              }}
            >
              <span style={{ color: tier.color, fontSize: '12px' }}>{tier.icon}</span>
              <span
                className="font-mono text-[8px] uppercase tracking-[0.06em]"
                style={{ color: tier.color }}
              >
                {tier.label}
              </span>
              <span
                className="text-center leading-tight"
                style={{ color: '#5a4b78', fontSize: '8px' }}
              >
                {tier.desc}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

