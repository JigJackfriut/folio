'use client'

import { useState, useMemo } from 'react'
import { TAG_CATEGORIES, POPULAR_TAGS, CATEGORY_LABELS, type TagEntry, type TagTier } from '@/lib/tags'

const TIERS: { id: TagTier; label: string; icon: string; desc: string; color: string; bg: string; border: string }[] = [
  { id: 'public', label: 'Public', icon: '◎', desc: 'On profile', color: '#e8e0ff', bg: 'rgba(155, 133, 232, 0.1)', border: '#9b85e8' },
  { id: 'shared', label: 'Matched', icon: '⬡', desc: 'Mutual only', color: '#c3b3ff', bg: 'rgba(127, 119, 221, 0.1)', border: '#7F77DD' },
  { id: 'filter', label: 'Filter', icon: '▿', desc: 'Hidden', color: '#5DCAA5', bg: 'rgba(29, 158, 117, 0.1)', border: '#1D9E75' },
]

export function TagPicker({ value, onChange }: { value: TagEntry[], onChange: (tags: TagEntry[]) => void }) {
  const [activeCategory, setActiveCategory] = useState('popular')
  const [search, setSearch] = useState('')
  const [isRefining, setIsRefining] = useState(false)

  const handleToggleTag = (name: string) => {
    const exists = value.find(t => t.name === name)
    if (exists) {
      onChange(value.filter(t => t.name !== name))
    } else {
      onChange([...value, { name, tier: 'public' }])
    }
  }

  const updateTier = (name: string, tier: TagTier) => {
    onChange(value.map(t => t.name === name ? { ...t, tier } : t))
  }

  const filteredTags = useMemo(() => {
    const sections = search ? Object.values(TAG_CATEGORIES).flatMap(s => Object.entries(s)) : Object.entries(TAG_CATEGORIES[activeCategory] || {})
    return sections.map(([label, tags]) => ({
      label,
      tags: tags.filter(t => t.toLowerCase().includes(search.toLowerCase()))
    })).filter(s => s.tags.length > 0)
  }, [activeCategory, search])

  if (isRefining) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button onClick={() => setIsRefining(false)} className="text-[11px] font-mono text-[#7a6b9a] uppercase tracking-widest">← Back to adding</button>
        <div className="space-y-8">
          {TIERS.map(tier => (
            <div key={tier.id} className="rounded-2xl p-4 border border-[#2a1f42] bg-[rgba(30,21,48,0.2)]">
              <div className="flex items-center gap-2 mb-4">
                <span style={{ color: tier.color }}>{tier.icon}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: tier.color }}>{tier.label}</span>
                <span className="text-[10px] text-[#5a4b78]">— {tier.desc}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {value.filter(t => t.tier === tier.id).map(tag => (
                  <div key={tag.name} className="flex items-center gap-1 rounded-full border px-3 py-1.5" style={{ borderColor: tier.border, color: tier.color, backgroundColor: tier.bg }}>
                    <span className="text-[12px]">{tag.name}</span>
                    <select 
                      className="bg-transparent border-none text-[10px] cursor-pointer focus:ring-0 opacity-40 hover:opacity-100"
                      onChange={(e) => updateTier(tag.name, e.target.value as TagTier)}
                    >
                      <option value="" disabled selected>move</option>
                      {TIERS.filter(t => t.id !== tier.id).map(t => (
                        <option key={t.id} value={t.id} className="bg-[#1b1328]">{t.label}</option>
                      ))}
                    </select>
                  </div>
                ))}
                {value.filter(t => t.tier === tier.id).length === 0 && <p className="text-[11px] italic text-[#3a2b58]">No tags assigned here</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 mr-3">
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Search interests..." 
            className="w-full bg-[#1b1328] border-b border-[#3a2b58] py-2 text-[14px] text-[#f5efff] outline-none focus:border-[#9b85e8] transition-colors"
          />
        </div>
        {value.length > 0 && (
          <button 
            onClick={() => setIsRefining(true)}
            className="px-4 py-2 rounded-full bg-[#6d4bc3] text-white text-[11px] font-mono uppercase tracking-tighter"
          >
            Refine Privacy ({value.length})
          </button>
        )}
      </div>

      {!search && (
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
          {Object.keys(TAG_CATEGORIES).map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase border transition-all ${activeCategory === cat ? 'border-[#9b85e8] text-[#f5efff] bg-[#2e1f4a]' : 'border-[#3a2b58] text-[#7a6b9a]'}`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-[300px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
        {filteredTags.map(section => (
          <div key={section.label}>
            <p className="text-[10px] font-mono text-[#4a3b68] uppercase mb-2 tracking-widest">{section.label}</p>
            <div className="flex flex-wrap gap-2">
              {section.tags.map(tag => {
                const isSelected = value.some(t => t.name === tag)
                return (
                  <button
                    key={tag}
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-[12px] border transition-all duration-200 ${isSelected ? 'border-[#9b85e8] bg-[#2e1f4a] text-[#f5efff]' : 'border-[#2a1f42] text-[#7a6b9a] hover:border-[#3a2b58]'}`}
                  >
                    {tag}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
