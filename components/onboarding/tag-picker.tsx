'use client'

import { useState, useMemo } from 'react'
import { TAG_CATEGORIES, POPULAR_TAGS, CATEGORY_LABELS, type TagEntry, type TagTier } from '@/lib/tags'

const TIER_CONFIG: Record<TagTier, { label: string; bg: string; text: string; desc: string }> = {
  public: { label: 'Public',  bg: '#6d4bc3', text: '#ffffff', desc: 'visible on your profile' },
  echo:   { label: 'Echo',    bg: '#b45309', text: '#ffffff', desc: 'hidden — revealed mutually in threads' },
}

const TIER_ORDER: TagTier[] = ['public', 'echo']

function TierToggle({ tier, onChange }: { tier: TagTier; onChange: (t: TagTier) => void }) {
  return (
    <div
      className="inline-flex items-center rounded-full overflow-hidden flex-shrink-0"
      style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid #3a2b58' }}
    >
      {TIER_ORDER.map(t => {
        const cfg = TIER_CONFIG[t]
        const isActive = tier === t
        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            style={{
              padding: '4px 10px',
              fontSize: isActive ? '11px' : '10px',
              fontFamily: 'monospace',
              fontWeight: isActive ? 700 : 400,
              background: isActive ? cfg.bg : 'transparent',
              color: isActive ? cfg.text : 'rgba(255,255,255,0.35)',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              letterSpacing: isActive ? '0.02em' : '0',
              borderRight: t !== 'echo' ? '1px solid #2a1f42' : 'none',
            }}
          >
            {cfg.label}
          </button>
        )
      })}
    </div>
  )
}

function SelectedTag({
  name, tier, onTierChange, onRemove,
}: {
  name: string
  tier: TagTier
  onTierChange: (t: TagTier) => void
  onRemove: () => void
}) {
  const cfg = TIER_CONFIG[tier]
  return (
    <div
      className="flex items-center gap-2 rounded-xl"
      style={{
        padding: '7px 10px',
        background: 'rgba(30,21,48,0.9)',
        border: `1px solid ${cfg.bg}`,
      }}
    >
      <span style={{ fontSize: '13px', color: '#f0eaff', whiteSpace: 'nowrap', flex: 1 }}>
        {name}
      </span>
      <TierToggle tier={tier} onChange={onTierChange} />
      <button
        type="button"
        onClick={onRemove}
        style={{
          fontSize: '11px',
          color: '#4a3b68',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 2px',
          flexShrink: 0,
          lineHeight: 1,
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#f87171' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#4a3b68' }}
      >
        ✕
      </button>
    </div>
  )
}

function PoolTag({ name, isHot, onClick }: { name: string; isHot: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 transition-all duration-100"
      style={{
        padding: '4px 2px',
        fontSize: '13px',
        background: 'none',
        border: 'none',
        color: '#7a6b9a',
        cursor: 'pointer',
        marginRight: '10px',
        marginBottom: '4px',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#d4c8f0' }}
      onMouseLeave={e => { e.currentTarget.style.color = '#7a6b9a' }}
    >
      {name}
      {isHot && (
        <span style={{
          fontSize: '8px',
          background: 'rgba(250,199,117,0.15)',
          color: '#FAC775',
          padding: '1px 4px',
          borderRadius: '99px',
          marginLeft: '2px',
        }}>
          hot
        </span>
      )}
    </button>
  )
}

export function TagPicker({ value, onChange }: { value: TagEntry[]; onChange: (tags: TagEntry[]) => void }) {
  const [activeCategory, setActiveCategory] = useState('popular')
  const [search, setSearch] = useState('')

  const selectedNames = new Set(value.map(t => t.name))

  const addTag = (name: string) => {
    if (selectedNames.has(name)) return
    onChange([...value, { name, tier: 'public' }])
  }

  const removeTag = (name: string) => onChange(value.filter(t => t.name !== name))

  const changeTier = (name: string, tier: TagTier) =>
    onChange(value.map(t => t.name === name ? { ...t, tier } : t))

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

  const legend = (
    <div className="flex flex-col gap-2 rounded-xl p-3" style={{ background: 'rgba(30,21,48,0.6)', border: '1px solid #2a1f42' }}>
      {TIER_ORDER.map(t => {
        const c = TIER_CONFIG[t]
        return (
          <div key={t} className="flex items-start gap-2.5">
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.bg, display: 'inline-block', flexShrink: 0, marginTop: '3px' }} />
            <p style={{ fontSize: '12px', lineHeight: '1.5' }}>
              <span style={{ color: '#f0eaff', fontWeight: 600 }}>{c.label}</span>
              <span style={{ color: '#7a6b9a' }}> — {c.desc}</span>
            </p>
          </div>
        )
      })}
    </div>
  )

  const leftPane = (
    <div className="flex flex-col gap-3 min-w-0">
      <div className="relative">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#4a3b68', fontSize: '14px' }}>⌕</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="w-full bg-transparent outline-none transition-colors"
          style={{
            paddingLeft: '22px',
            paddingBottom: '8px',
            borderBottom: '1px solid #3a2b58',
            fontSize: '13px',
            color: '#f5efff',
          }}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#6d4bc3' }}
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

      {!search && (
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          {Object.keys(TAG_CATEGORIES).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="px-3 py-1 rounded-full font-mono whitespace-nowrap transition-all"
              style={{
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: activeCategory === cat ? '#2e1f4a' : 'transparent',
                border: `1px solid ${activeCategory === cat ? '#6d4bc3' : '#2a1f42'}`,
                color: activeCategory === cat ? '#f5efff' : '#5a4b78',
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-y-auto scrollbar-thin" style={{ maxHeight: '380px', paddingRight: '4px' }}>
        {filteredSections.map(([section, tags]) => {
          const pool = tags.filter(t => !selectedNames.has(t))
          if (pool.length === 0) return null
          return (
            <div key={section} className="mb-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-2" style={{ color: '#3a2b58' }}>
                {section}
              </p>
              <div className="flex flex-wrap">
                {pool.map(tag => (
                  <PoolTag key={tag} name={tag} isHot={POPULAR_TAGS.has(tag)} onClick={() => addTag(tag)} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const rightPane = (
    <div className="flex flex-col gap-3 min-w-0">
      <div>
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] mb-1" style={{ color: '#4a3b68' }}>
          your tags
          {value.length > 0 && <span style={{ color: '#3a2b58' }}> · {value.length} added</span>}
        </p>
        {legend}
      </div>

      {value.length === 0 ? (
        <div
          className="rounded-xl flex items-center justify-center"
          style={{ minHeight: '120px', border: '1px dashed #2a1f42' }}
        >
          <p className="font-mono text-[11px] text-center" style={{ color: '#3a2b58' }}>
            tap any tag to add it here
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto scrollbar-thin" style={{ maxHeight: '380px' }}>
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
      )}
    </div>
  )

  return (
    <>
      <div className="hidden lg:grid gap-8" style={{ gridTemplateColumns: '1fr 1fr' }}>
        {leftPane}
        {rightPane}
      </div>
      <div className="lg:hidden flex flex-col gap-5">
        {legend}
        {value.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="font-mono text-[9px] uppercase tracking-[0.12em]" style={{ color: '#4a3b68' }}>
              {value.length} added
            </p>
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
        )}
        {leftPane}
      </div>
    </>
  )
}
