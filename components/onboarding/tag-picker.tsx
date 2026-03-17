'use client'

import { useState, useMemo } from 'react'
import { TAG_CATEGORIES, POPULAR_TAGS, CATEGORY_LABELS, type TagEntry, type TagTier } from '@/lib/tags'

const TIER_STYLES: Record<TagTier, string> = {
  public: 'border-[#9b85e8] bg-[#2e1f4a] text-[#f0eaff]',
  shared: 'border-[#7F77DD] bg-[#EEEDFE]/10 text-[#c3b3ff]',
  filter: 'border-[#1D9E75] bg-[#E1F5EE]/10 text-[#5DCAA5]',
}

const TIER_CYCLE: (TagTier | null)[] = [null, 'public', 'shared', 'filter']

function getTier(tags: TagEntry[], name: string): TagTier | null {
  return tags.find((t) => t.name === name)?.tier ?? null
}

function cycleTier(tags: TagEntry[], name: string): TagEntry[] {
  const current = getTier(tags, name)
  const idx = TIER_CYCLE.indexOf(current)
  const next = TIER_CYCLE[(idx + 1) % TIER_CYCLE.length]
  if (!next) return tags.filter((t) => t.name !== name)
  const filtered = tags.filter((t) => t.name !== name)
  return [...filtered, { name, tier: next }]
}

export function TagPicker({
  value,
  onChange,
}: {
  value: TagEntry[]
  onChange: (tags: TagEntry[]) => void
}) {
  const [activeCategory, setActiveCategory] = useState('popular')
  const [search, setSearch] = useState('')

  const categories = Object.keys(TAG_CATEGORIES)

  const filteredSections = useMemo(() => {
    const cat = TAG_CATEGORIES[activeCategory] ?? {}
    if (!search.trim()) return cat
    const q = search.toLowerCase()
    const result: Record<string, string[]> = {}
    Object.entries(cat).forEach(([sec, tags]) => {
      const matched = tags.filter((t) => t.toLowerCase().includes(q))
      if (matched.length) result[sec] = matched
    })
    // Also search other categories when searching
    if (search.trim()) {
      Object.entries(TAG_CATEGORIES).forEach(([, sections]) => {
        Object.entries(sections).forEach(([sec, tags]) => {
          const matched = tags.filter(
            (t) => t.toLowerCase().includes(q) && !Object.values(result).flat().includes(t)
          )
          if (matched.length) result[sec] = [...(result[sec] ?? []), ...matched]
        })
      })
    }
    return result
  }, [activeCategory, search])

  const selectedPub = value.filter((t) => t.tier === 'public')
  const selectedShared = value.filter((t) => t.tier === 'shared')
  const selectedFilter = value.filter((t) => t.tier === 'filter')

  return (
    <div className="flex flex-col gap-3">
      {/* Legend */}
      <div className="flex gap-4 flex-wrap">
        {([['public', '#9b85e8', 'everyone sees'], ['shared', '#7F77DD', 'match-only'], ['filter', '#1D9E75', 'invisible filter']] as const).map(([tier, color, label]) => (
          <div key={tier} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: color }} />
            <span className="font-mono text-[10px] text-[#7a6b9a]">{label}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#4a3b68] text-[13px] pointer-events-none">⌕</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search — boxing, BDSM, cottagecore..."
          className="w-full bg-[#1e1530]/60 border border-[#3a2b58] rounded-xl pl-8 pr-4 py-2.5 text-[13px] text-[#f5efff] placeholder:text-[#4a3b68] outline-none focus:border-[#6d4bc3] transition-colors"
        />
      </div>

      {/* Category tabs */}
      {!search && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[12px] font-mono whitespace-nowrap border transition-all ${
                activeCategory === cat
                  ? 'bg-[#6d4bc3] border-[#6d4bc3] text-white'
                  : 'border-[#3a2b58] text-[#7a6b9a] hover:border-[#5a4578]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      {/* Tag grid */}
      <div className="overflow-y-auto max-h-[240px] pr-1 space-y-4 scrollbar-thin scrollbar-thumb-[#3a2b58] scrollbar-track-transparent">
        {Object.entries(filteredSections).map(([section, tags]) => (
          <div key={section}>
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#4a3b68] mb-2">
              {section}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => {
                const tier = getTier(value, tag)
                const isPopular = POPULAR_TAGS.has(tag)
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => onChange(cycleTier(value, tag))}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] border transition-all duration-150 ${
                      tier
                        ? TIER_STYLES[tier]
                        : 'border-[#3a2b58] text-[#7a6b9a] hover:border-[#5a4578] hover:text-[#a99abb]'
                    }`}
                  >
                    {tag}
                    {isPopular && !tier && (
                      <span className="text-[9px] bg-[#FAC775]/20 text-[#FAC775] px-1.5 py-0.5 rounded-full font-mono">
                        popular
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
        {Object.keys(filteredSections).length === 0 && (
          <p className="text-[13px] text-[#4a3b68] py-4">No tags found</p>
        )}
      </div>

      {/* Selected summary */}
      {value.length > 0 && (
        <div className="bg-[#1e1530]/60 border border-[#2a1f42] rounded-xl p-3 mt-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#4a3b68] mb-2">
            selected · tap to cycle privacy
          </p>
          <div className="flex flex-wrap gap-1.5">
            {value.map(({ name, tier }) => (
              <button
                key={name}
                type="button"
                onClick={() => onChange(cycleTier(value, name))}
                className={`px-2.5 py-1 rounded-full text-[11px] border transition-all ${TIER_STYLES[tier]}`}
              >
                {name} · {tier}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
