'use client'

import { useState, useMemo } from 'react'
import {
  TAG_CATEGORIES,
  POPULAR_TAGS,
  CATEGORY_LABELS,
  type TagEntry,
  type TagTier,
} from '@/lib/tags'

const TIER_CONFIG: Record<
  TagTier,
  { label: string; bg: string; text: string; desc: string }
> = {
  public: {
    label: 'Public',
    bg: '#6d4bc3',
    text: '#ffffff',
    desc: 'visible on your profile',
  },
  echo: {
    label: 'Echo',
    bg: '#b45309',
    text: '#ffffff',
    desc: 'hidden — revealed mutually in threads',
  },
}

const TIER_ORDER: TagTier[] = ['public', 'echo']

function TierToggle({
  tier,
  onChange,
}: {
  tier: TagTier
  onChange: (t: TagTier) => void
}) {
  return (
    <div
      className="inline-flex items-center rounded-full overflow-hidden flex-shrink-0"
      style={{
        background: 'rgba(23, 16, 36, 0.72)',
        border: '1px solid #5b4c7d',
      }}
    >
      {TIER_ORDER.map((t, index) => {
        const cfg = TIER_CONFIG[t]
        const isActive = tier === t

        return (
          <button
            key={t}
            type="button"
            onClick={() => onChange(t)}
            className="font-sans transition-all"
            style={{
              padding: '6px 12px',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 500,
              background: isActive ? cfg.bg : 'transparent',
              color: isActive ? cfg.text : '#cbbfe8',
              border: 'none',
              cursor: 'pointer',
              borderRight:
                index < TIER_ORDER.length - 1 ? '1px solid #3c2f5d' : 'none',
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
  const cfg = TIER_CONFIG[tier]

  return (
    <div
      className="flex items-center gap-3 rounded-2xl"
      style={{
        padding: '12px 14px',
        background: 'rgba(44, 31, 70, 0.9)',
        border: `1px solid ${cfg.bg}`,
      }}
    >
      <span
        className="font-sans"
        style={{
          fontSize: '15px',
          color: '#f0eaff',
          whiteSpace: 'nowrap',
          flex: 1,
        }}
      >
        {name}
      </span>

      <TierToggle tier={tier} onChange={onTierChange} />

      <button
        type="button"
        onClick={onRemove}
        className="font-sans"
        style={{
          fontSize: '16px',
          color: '#978ab8',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '0 2px',
          flexShrink: 0,
          lineHeight: 1,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#f87171'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = '#978ab8'
        }}
      >
        ✕
      </button>
    </div>
  )
}

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
      className="inline-flex items-center gap-2 rounded-full border transition-all duration-100 font-sans"
      style={{
        padding: '8px 12px',
        fontSize: '14px',
        borderColor: '#5b4c7d',
        background: 'rgba(44, 31, 70, 0.55)',
        color: '#eee7ff',
        cursor: 'pointer',
        marginRight: '10px',
        marginBottom: '10px',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#a88cff'
        e.currentTarget.style.background = 'rgba(74, 53, 118, 0.45)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#5b4c7d'
        e.currentTarget.style.background = 'rgba(44, 31, 70, 0.55)'
      }}
    >
      {name}
      {isHot && (
        <span
          className="font-sans"
          style={{
            fontSize: '11px',
            background: 'rgba(250,199,117,0.16)',
            color: '#f6c870',
            padding: '2px 6px',
            borderRadius: '999px',
          }}
        >
          hot
        </span>
      )}
    </button>
  )
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

  const selectedNames = new Set(value.map(t => t.name))

  const addTag = (name: string) => {
    if (selectedNames.has(name)) return
    onChange([...value, { name, tier: 'public' }])
  }

  const removeTag = (name: string) => {
    onChange(value.filter(t => t.name !== name))
  }

  const changeTier = (name: string, tier: TagTier) => {
    onChange(value.map(t => (t.name === name ? { ...t, tier } : t)))
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

  const legend = (
    <div
      className="flex flex-col gap-3 rounded-2xl p-4"
      style={{
        background: 'rgba(44, 31, 70, 0.72)',
        border: '1px solid #5b4c7d',
      }}
    >
      {TIER_ORDER.map(t => {
        const c = TIER_CONFIG[t]

        return (
          <div key={t} className="flex items-start gap-3">
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: c.bg,
                display: 'inline-block',
                flexShrink: 0,
                marginTop: '5px',
              }}
            />
            <p className="font-sans" style={{ fontSize: '14px', lineHeight: '1.5' }}>
              <span style={{ color: '#f0eaff', fontWeight: 600 }}>{c.label}</span>
              <span style={{ color: '#cbbfe8' }}> — {c.desc}</span>
            </p>
          </div>
        )
      })}
    </div>
  )

  const leftPane = (
    <div className="flex flex-col gap-4 min-w-0">
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-4"
        style={{
          border: '1px solid #5b4c7d',
          background: 'rgba(44, 31, 70, 0.9)',
        }}
      >
        <span style={{ color: '#b7abd6', fontSize: '16px' }}>⌕</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search tags..."
          className="flex-1 bg-transparent outline-none font-sans"
          style={{ fontSize: '16px', color: '#f5efff' }}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            style={{
              color: '#978ab8',
              fontSize: '14px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        )}
      </div>

      {!search && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {Object.keys(TAG_CATEGORIES).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className="rounded-full border transition-all font-sans whitespace-nowrap"
              style={{
                padding: '9px 16px',
                fontSize: '13px',
                borderColor: activeCategory === cat ? '#a88cff' : '#5b4c7d',
                background:
                  activeCategory === cat
                    ? 'rgba(74, 53, 118, 0.9)'
                    : 'rgba(44, 31, 70, 0.55)',
                color: activeCategory === cat ? '#f7f2ff' : '#d3c7ef',
                fontWeight: activeCategory === cat ? 600 : 400,
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      <div
        className="overflow-y-auto scrollbar-thin"
        style={{ maxHeight: '380px', paddingRight: '4px' }}
      >
        {filteredSections.map(([section, tags]) => {
          const pool = tags.filter(t => !selectedNames.has(t))
          if (pool.length === 0) return null

          return (
            <div key={section} className="mb-6">
              <p
                className="font-mono text-[10px] uppercase tracking-[0.16em] mb-3"
                style={{ color: '#b7abd6' }}
              >
                {section}
              </p>

              <div className="flex flex-wrap">
                {pool.map(tag => (
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
    </div>
  )

  const rightPane = (
    <div className="flex flex-col gap-4 min-w-0">
      <div>
        <p
          className="font-mono text-[10px] uppercase tracking-[0.16em] mb-3"
          style={{ color: '#b7abd6' }}
        >
          your tags
          {value.length > 0 && (
            <span style={{ color: '#978ab8' }}> · {value.length} added</span>
          )}
        </p>
        {legend}
      </div>

      {value.length === 0 ? (
        <div
          className="rounded-2xl flex items-center justify-center"
          style={{
            minHeight: '140px',
            border: '1px dashed #5b4c7d',
            background: 'rgba(44, 31, 70, 0.28)',
          }}
        >
          <p
            className="font-sans text-center"
            style={{ fontSize: '14px', color: '#978ab8' }}
          >
            tap any tag to add it here
          </p>
        </div>
      ) : (
        <div
          className="flex flex-col gap-3 overflow-y-auto scrollbar-thin"
          style={{ maxHeight: '380px' }}
        >
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
          <div className="flex flex-col gap-3">
            <p
              className="font-mono text-[10px] uppercase tracking-[0.16em]"
              style={{ color: '#b7abd6' }}
            >
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
