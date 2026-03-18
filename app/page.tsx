'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding } from '@/lib/onboarding-store'
import { BackgroundGlow } from '@/components/ui/background-glow'
import { TagPicker } from '@/components/onboarding/tag-picker'

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const TOTAL = 8

const STEP_LABELS = [
  'Intent',
  'The Vitals',
  'Geography',
  'Preferences',
  'The Soul',
  'Curate Tags',
  'Write Folio',
  'Review',
]

const INTENTS = [
  { value: 'something_real',  title: 'Something real',     desc: 'Long-term, committed — the whole thing',           icon: '♾' },
  { value: 'casual',          title: 'Something casual',   desc: 'No pressure, just see where it goes',              icon: '✦' },
  { value: 'friends_first',   title: 'Friends first',      desc: 'Build a real connection before anything else',     icon: '◯' },
  { value: 'companion',       title: 'A companion',        desc: 'Someone to share life with — dates, trips, the everyday stuff', icon: '⌂' },
  { value: 'no_idea',         title: 'Honestly? No idea',  desc: 'Just here to see what happens',                   icon: '?' },
]

const EXAMPLES = [
  {
    headline: 'looking for someone to discuss obscure films with at 2am',
    body: "I don't have a five-year plan but I have strong opinions about which Kubrick film is underrated. I'm better in person than on paper, but I'm giving paper a shot. Tell me something real about yourself and we'll see where it goes.",
  },
  {
    headline: 'looking for someone who makes ordinary Tuesdays feel like something worth showing up for',
    body: "I'm the kind of person who overanalyses films, remembers the exact words people use, and gets deeply attached to fictional characters. I'm told I'm a lot — in the best way, usually.",
  },
  {
    headline: 'looking for my person, or at least a good conversation',
    body: "I'm usually either lost in a book or getting too invested in a game. Looking for someone with good banter, actual opinions, and the confidence to text first.",
  },
]

type ScreenProps = { onNext?: () => void }

// ─────────────────────────────────────────────────────────────────────────────
// Shared UI primitives
// ─────────────────────────────────────────────────────────────────────────────

function ScreenLabel({ step }: { step: number }) {
  return (
    <div className="flex flex-col mb-9">
      <div className="flex items-center gap-3">
        <span
          className="font-serif italic text-lg"
          style={{ color: '#c8922a', fontFamily: 'EB Garamond, Georgia, serif' }}
        >
          Step {step}
        </span>
        <div
          className="h-[1px] flex-1 opacity-25"
          style={{ background: 'linear-gradient(to right, #c8922a, transparent)' }}
        />
      </div>
      <span
        className="font-mono text-[10px] uppercase mt-1"
        style={{ color: '#7a6b9a', letterSpacing: '0.3em' }}
      >
        {STEP_LABELS[step - 1]}
      </span>
    </div>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="leading-[1.2] mb-1.5"
      style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '30px', color: '#f5efff' }}
    >
      {children}
    </h1>
  )
}

function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono leading-relaxed mb-7"
      style={{ fontSize: '11px', color: '#7a6b9a', letterSpacing: '0.02em' }}
    >
      {children}
    </p>
  )
}

function EditorialInput({
  label,
  hint,
  ...props
}: {
  label?: string
  hint?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-7 group">
      {label && (
        <p
          className="font-serif italic mb-1 transition-colors duration-200"
          style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
        >
          {label}
        </p>
      )}
      <input
        {...props}
        className="w-full bg-transparent outline-none placeholder:opacity-20 transition-colors"
        style={{
          borderBottom: '1px solid #3a2b58',
          paddingBottom: '10px',
          fontSize: '20px',
          fontFamily: 'EB Garamond, Georgia, serif',
          color: '#f5efff',
        }}
        onFocus={e => {
          e.currentTarget.style.borderBottomColor = '#9b85e8'
          e.currentTarget.previousElementSibling?.setAttribute('style', 'font-size:15px;color:#c8922a;font-family:EB Garamond,Georgia,serif;font-style:italic;margin-bottom:4px;transition:color 0.2s')
        }}
        onBlur={e => {
          e.currentTarget.style.borderBottomColor = '#3a2b58'
          e.currentTarget.previousElementSibling?.setAttribute('style', 'font-size:15px;color:#7a6b9a;font-family:EB Garamond,Georgia,serif;font-style:italic;margin-bottom:4px;transition:color 0.2s')
        }}
      />
      {hint && (
        <p className="font-mono text-[9px] uppercase tracking-wider mt-1.5" style={{ color: '#4a3b68' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

function OptionCard({
  title,
  description,
  selected,
  onClick,
  icon,
}: {
  title: string
  description: string
  selected: boolean
  onClick: () => void
  icon?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left rounded-2xl mb-2 transition-all duration-150 flex items-center gap-4"
      style={{
        padding: '13px 16px',
        border: `1px solid ${selected ? '#9b85e8' : '#3a2b58'}`,
        background: selected ? 'rgba(46,31,74,0.8)' : 'rgba(30,21,48,0.4)',
      }}
    >
      {icon && (
        <span
          className="flex-shrink-0 flex items-center justify-center rounded-full font-mono"
          style={{
            width: '32px',
            height: '32px',
            background: selected ? 'rgba(155,133,232,0.2)' : 'rgba(58,43,88,0.4)',
            color: selected ? '#c3b3ff' : '#5a4b78',
            fontSize: '13px',
          }}
        >
          {icon}
        </span>
      )}
      <div className="flex-1">
        <p
          className="text-[14px] font-medium mb-0.5 transition-colors"
          style={{ color: selected ? '#f0eaff' : '#a99abb' }}
        >
          {title}
        </p>
        <p className="text-[11px]" style={{ color: '#7a6b9a' }}>{description}</p>
      </div>
      <div
        className="flex-shrink-0 rounded-full transition-all flex items-center justify-center"
        style={{
          width: '16px',
          height: '16px',
          border: `1.5px solid ${selected ? '#9b85e8' : '#3a2b58'}`,
          background: selected ? '#9b85e8' : 'transparent',
        }}
      >
        {selected && <span style={{ color: '#fff', fontSize: '9px' }}>✓</span>}
      </div>
    </button>
  )
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border transition-all duration-150"
      style={{
        padding: '7px 13px',
        fontSize: '12px',
        borderColor: selected ? '#9b85e8' : '#3a2b58',
        background: selected ? 'rgba(46,31,74,0.9)' : 'transparent',
        color: selected ? '#f0eaff' : '#7a6b9a',
        fontWeight: selected ? 500 : 400,
      }}
    >
      {label}
    </button>
  )
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: '1px solid #2a1f42' }}
    >
      <div className="flex-1 pr-4">
        <p className="text-[13px]" style={{ color: '#d4c8f0' }}>{label}</p>
        {hint && <p className="text-[11px] mt-0.5" style={{ color: '#7a6b9a' }}>{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 rounded-full transition-colors duration-200"
        style={{ width: '40px', height: '22px', background: checked ? '#6d4bc3' : '#3a2b58' }}
      >
        <span
          className="absolute top-[3px] rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ width: '16px', height: '16px', left: checked ? '21px' : '3px' }}
        />
      </button>
    </div>
  )
}

function FilterRow({
  question,
  options,
  value,
  onChange,
}: {
  question: string
  options: { label: string; value: string }[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="py-4" style={{ borderBottom: '1px solid #2a1f42' }}>
      <p className="font-medium mb-3" style={{ color: '#c3b3ff', fontSize: '13px' }}>{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-4 py-1.5 rounded-full text-[12px] border transition-all duration-150"
            style={{
              borderColor: value === opt.value ? '#9b85e8' : '#3a2b58',
              background: value === opt.value ? 'rgba(46,31,74,0.8)' : 'transparent',
              color: value === opt.value ? '#f0eaff' : '#7a6b9a',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Screens
// ─────────────────────────────────────────────────────────────────────────────

function S1({ onNext }: ScreenProps) {
  const { state, set } = useOnboarding()
  return (
    <>
      <Heading>what are you actually looking for?</Heading>
      <Sub>be honest with yourself — you can change this later</Sub>
      {INTENTS.map(i => (
        <OptionCard
          key={i.value}
          icon={i.icon}
          title={i.title}
          description={i.desc}
          selected={state.intent_type === i.value}
          onClick={() => {
            set({ intent_type: i.value })
            setTimeout(() => onNext?.(), 180)
          }}
        />
      ))}
    </>
  )
}

function S2() {
  const { state, set } = useOnboarding()
  const genders = ['Man', 'Woman', 'Non-binary', 'Trans man', 'Trans woman', 'Genderfluid', 'Agender', 'Intersex', 'Prefer not to say']
  const toggle = (g: string) => {
    const cur = state.gender_identity
    set({ gender_identity: cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g] })
  }
  return (
    <>
      <Heading>who are you?</Heading>
      <Sub>just the basics — you&apos;ll tell your story later</Sub>

      <div className="flex gap-5 items-start">
        <div className="w-28 flex-shrink-0">
          <EditorialInput
            label="Age"
            type="number"
            min={18}
            max={99}
            placeholder="27"
            value={state.age}
            onChange={e => set({ age: e.target.value })}
            hint="18 or over"
          />
        </div>
        <div className="flex-1">
          <EditorialInput
            label="I go by..."
            placeholder="Name or handle"
            value={state.display_name}
            onChange={e => set({ display_name: e.target.value })}
            maxLength={40}
            hint="shown on your folio"
          />
        </div>
      </div>

      <p
        className="font-serif italic mb-3"
        style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
      >
        I identify as...
      </p>
      <div className="flex flex-wrap gap-2">
        {genders.map(g => (
          <Chip key={g} label={g} selected={state.gender_identity.includes(g)} onClick={() => toggle(g)} />
        ))}
      </div>
    </>
  )
}

function S3() {
  const { state, set } = useOnboarding()
  return (
    <>
      <Heading>where are you?</Heading>
      <Sub>used for matching — never shown unless you choose to</Sub>

      <EditorialInput
        label="I&apos;m based in..."
        placeholder="City or neighbourhood"
        value={state.location_raw}
        onChange={e => set({ location_raw: e.target.value })}
        hint="e.g. Brooklyn, NY · Melbourne · East London"
      />

      <div style={{ borderTop: '1px solid #2a1f42' }}>
        <Toggle
          label="Open to long-distance"
          hint="Match with people outside your area too"
          checked={state.open_to_distance}
          onChange={v => set({ open_to_distance: v })}
        />
        <Toggle
          label="Show neighbourhood only"
          hint="Hide your exact city from your public profile"
          checked={state.hide_exact_location}
          onChange={v => set({ hide_exact_location: v })}
        />
      </div>
    </>
  )
}

function S4() {
  const { state, set } = useOnboarding()
  const genders = ['Women', 'Men', 'Non-binary', 'Everyone', 'Trans women', 'Trans men']
  const toggleG = (g: string) => {
    if (g === 'Everyone') { set({ gender_preference: ['Everyone'] }); return }
    const without = state.gender_preference.filter(x => x !== 'Everyone')
    set({ gender_preference: without.includes(g) ? without.filter(x => x !== g) : [...without, g] })
  }
  return (
    <>
      <Heading>who do you want to meet?</Heading>
      <Sub>select all that apply</Sub>

      <div className="flex flex-wrap gap-2 mb-8">
        {genders.map(g => (
          <Chip key={g} label={g} selected={state.gender_preference.includes(g)} onClick={() => toggleG(g)} />
        ))}
      </div>

      <p
        className="font-serif italic mb-4"
        style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
      >
        Age range
      </p>
      <div className="space-y-4">
        {(['age_min', 'age_max'] as const).map(key => (
          <div key={key} className="flex items-center gap-3">
            <span className="font-mono text-[10px] w-7" style={{ color: '#7a6b9a' }}>
              {key === 'age_min' ? 'from' : 'to'}
            </span>
            <input
              type="range"
              min={18}
              max={80}
              value={state[key]}
              onChange={e => {
                const v = parseInt(e.target.value, 10)
                if (key === 'age_min' && v > state.age_max) return
                if (key === 'age_max' && v < state.age_min) return
                set({ [key]: v })
              }}
              className="flex-1 accent-[#6d4bc3]"
            />
            <span className="font-mono text-[14px] w-7 text-right" style={{ color: '#f5efff' }}>
              {state[key]}
            </span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] mt-3" style={{ color: '#4a3b68' }}>
        soft limits — people just outside this range may still appear
      </p>
    </>
  )
}

function S5() {
  const { state, set } = useOnboarding()
  const rows = [
    {
      key: 'filter_kids' as const,
      q: 'Kids',
      opts: [
        { label: 'Want them', value: 'want' },
        { label: 'Have them', value: 'have' },
        { label: "Don't want them", value: 'dont_want' },
        { label: 'Open either way', value: 'open' },
      ],
    },
    {
      key: 'filter_structure' as const,
      q: 'Relationship structure',
      opts: [
        { label: 'Monogamous only', value: 'mono' },
        { label: 'ENM / poly / open', value: 'enm' },
        { label: 'Open to either', value: 'open' },
      ],
    },
    {
      key: 'filter_smoking' as const,
      q: 'Smoking',
      opts: [
        { label: 'Non-smoker', value: 'no' },
        { label: 'Smoker', value: 'yes' },
        { label: 'No preference', value: 'any' },
      ],
    },
    {
      key: 'filter_alcohol' as const,
      q: 'Alcohol',
      opts: [
        { label: "Don't drink", value: 'no' },
        { label: 'Social drinker', value: 'social' },
        { label: 'No preference', value: 'any' },
      ],
    },
    {
      key: 'filter_religion' as const,
      q: 'Faith / religion',
      opts: [
        { label: 'Same faith matters', value: 'same' },
        { label: 'Not important', value: 'not_important' },
        { label: 'Open', value: 'open' },
      ],
    },
  ]
  return (
    <>
      <Heading>a few things that actually matter</Heading>
      <Sub>never shown publicly — quietly removes bad fits before they reach you</Sub>
      <div style={{ borderTop: '1px solid #2a1f42' }}>
        {rows.map(row => (
          <FilterRow
            key={row.key}
            question={row.q}
            options={row.opts}
            value={state[row.key]}
            onChange={v => set({ [row.key]: v })}
          />
        ))}
      </div>
    </>
  )
}

function S6() {
  const { state, set } = useOnboarding()
  return (
    <>
      <Heading>what&apos;s actually you?</Heading>
      <Sub>tap to add · hit &lsquo;refine&rsquo; to set who sees what</Sub>
      <TagPicker value={state.tags} onChange={tags => set({ tags })} />
    </>
  )
}

function S7() {
  const { state, set } = useOnboarding()
  const [showExamples, setShowExamples] = useState(false)

  return (
    <>
      <Heading>write your folio</Heading>
      <Sub>a headline and whatever you want to say — write like a person</Sub>

      <div className="mb-6">
        <div className="flex items-end justify-between mb-1">
          <p
            className="font-serif italic"
            style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
          >
            headline
          </p>
          <p
            className="font-mono text-[9px]"
            style={{ color: state.post_headline.length > 100 ? '#c8922a' : '#4a3b68' }}
          >
            {state.post_headline.length}/120
          </p>
        </div>
        <input
          type="text"
          value={state.post_headline}
          onChange={e => set({ post_headline: e.target.value })}
          maxLength={120}
          placeholder="e.g. looking for someone to discuss obscure films with at 2am"
          className="w-full bg-transparent outline-none placeholder:opacity-20 transition-colors leading-snug"
          style={{
            borderBottom: '1px solid #3a2b58',
            paddingBottom: '10px',
            fontSize: '18px',
            fontFamily: 'EB Garamond, Georgia, serif',
            color: '#f5efff',
          }}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#9b85e8' }}
          onBlur={e => { e.currentTarget.style.borderBottomColor = '#3a2b58' }}
        />
      </div>

      <div className="mb-5">
        <div className="flex items-end justify-between mb-1">
          <p
            className="font-serif italic"
            style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
          >
            your post
          </p>
          <p className="font-mono text-[9px]" style={{ color: '#4a3b68' }}>
            {state.post_body.length}/2000
          </p>
        </div>
        <textarea
          value={state.post_body}
          onChange={e => set({ post_body: e.target.value })}
          maxLength={2000}
          rows={5}
          placeholder="Tell them about yourself. What makes you, you? Who are you looking for? No rules."
          className="w-full bg-transparent outline-none placeholder:opacity-20 transition-colors resize-none leading-relaxed"
          style={{
            borderBottom: '1px solid #3a2b58',
            paddingBottom: '10px',
            fontSize: '14px',
            color: '#d4c8f0',
          }}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#9b85e8' }}
          onBlur={e => { e.currentTarget.style.borderBottomColor = '#3a2b58' }}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowExamples(!showExamples)}
        className="flex items-center gap-2 mb-3 transition-colors"
        style={{ color: showExamples ? '#c3b3ff' : '#5a4b78', fontSize: '11px' }}
      >
        <span style={{ fontSize: '9px' }}>{showExamples ? '▾' : '▸'}</span>
        <span className="font-mono uppercase tracking-[0.1em] text-[10px]">need a nudge?</span>
      </button>

      {showExamples && (
        <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #2a1f42' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => set({ post_headline: ex.headline, post_body: ex.body })}
              className="block w-full text-left transition-all"
              style={{
                padding: '11px 14px',
                fontSize: '11px',
                color: '#7a6b9a',
                borderBottom: i < EXAMPLES.length - 1 ? '1px solid #2a1f42' : undefined,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#a99abb'
                e.currentTarget.style.background = 'rgba(58,43,88,0.3)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#7a6b9a'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ color: '#5a4b78', marginRight: '6px' }}>→</span>
              {ex.headline}
            </button>
          ))}
        </div>
      )}
    </>
  )
}

function S8() {
  const { state } = useOnboarding()
  const publicTags = state.tags.filter(t => t.tier === 'public').slice(0, 5)
  const sharedCount = state.tags.filter(t => t.tier === 'shared').length
  const filterCount = state.tags.filter(t => t.tier === 'filter').length
  const location = state.location_raw
    ? state.hide_exact_location
      ? state.location_raw.split(',')[0]?.trim() ?? state.location_raw
      : state.location_raw
    : null

  return (
    <>
      <Heading>here&apos;s how you&apos;ll appear</Heading>
      <Sub>edit anytime from your profile</Sub>

      <div
        className="rounded-2xl p-5 mb-4"
        style={{ border: '1px solid #3a2b58', background: 'rgba(30,21,48,0.6)' }}
      >
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {state.age && (
            <span className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>{state.age}</span>
          )}
          {location && (
            <>
              <span style={{ color: '#3a2b58', fontSize: '8px' }}>·</span>
              <span className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>{location}</span>
            </>
          )}
          {state.open_to_distance && (
            <>
              <span style={{ color: '#3a2b58', fontSize: '8px' }}>·</span>
              <span className="font-mono text-[11px]" style={{ color: '#5a4b78' }}>open to online</span>
            </>
          )}
        </div>

        <p
          className="leading-snug mb-3"
          style={{
            fontFamily: 'EB Garamond, Georgia, serif',
            fontSize: '19px',
            color: state.post_headline ? '#f5efff' : '#3a2b58',
          }}
        >
          {state.post_headline || 'your headline will appear here'}
        </p>

        <p
          className="leading-relaxed mb-4 text-[13px]"
          style={{ color: state.post_body ? '#a99abb' : '#3a2b58' }}
        >
          {state.post_body
            ? state.post_body.slice(0, 200) + (state.post_body.length > 200 ? '…' : '')
            : 'your post will appear here'}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {publicTags.map(({ name }) => (
            <span
              key={name}
              className="px-2.5 py-1 rounded-full text-[11px] border"
              style={{ borderColor: '#3a2b58', background: 'rgba(42,31,66,0.8)', color: '#a99abb' }}
            >
              {name}
            </span>
          ))}
          {sharedCount > 0 && (
            <span
              className="px-2.5 py-1 rounded-full text-[11px] border italic"
              style={{ borderColor: '#7F77DD', background: 'rgba(238,237,254,0.05)', color: '#c3b3ff' }}
            >
              + {sharedCount} thing{sharedCount > 1 ? 's' : ''} in common
            </span>
          )}
        </div>
      </div>

      <div
        className="rounded-xl p-4 text-[12px] leading-relaxed space-y-2"
        style={{ background: 'rgba(30,21,48,0.4)', border: '1px solid #2a1f42' }}
      >
        <p style={{ color: '#7a6b9a' }}>
          <span style={{ color: '#a99abb' }}>◎ {publicTags.length} public</span> — visible to everyone
        </p>
        {sharedCount > 0 && (
          <p style={{ color: '#7a6b9a' }}>
            <span style={{ color: '#c3b3ff' }}>⬡ {sharedCount} matched</span> — revealed only when a match shares them
          </p>
        )}
        {filterCount > 0 && (
          <p style={{ color: '#7a6b9a' }}>
            <span style={{ color: '#5DCAA5' }}>▿ {filterCount} filter</span> — invisible to everyone, quietly removes bad fits
          </p>
        )}
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress + Navigation
// ─────────────────────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / (total - 1)) * 100
  return (
    <div className="relative w-full h-[2px] mb-10" style={{ background: '#2a1f42' }}>
      <div
        className="absolute left-0 top-0 h-full transition-all duration-500"
        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #6d4bc3, #c8922a)' }}
      />
      <div className="absolute inset-0 flex items-center justify-between">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i === current - 1
          const isDone = i < current - 1
          return (
            <div
              key={i}
              className="rounded-full transition-all duration-300 flex-shrink-0"
              style={{
                width: isActive ? '8px' : '4px',
                height: isActive ? '8px' : '4px',
                background: isDone ? '#9b85e8' : isActive ? '#c8922a' : '#2e2040',
                marginTop: isActive ? '-3px' : '-1px',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function NavBar({
  onBack,
  onNext,
  onSkip,
  nextLabel = 'continue',
  backVisible = true,
  skipVisible = false,
  nextDisabled = false,
}: {
  onBack: () => void
  onNext: () => void
  onSkip?: () => void
  nextLabel?: string
  backVisible?: boolean
  skipVisible?: boolean
  nextDisabled?: boolean
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-6 py-6 z-40"
      style={{
        background: 'rgba(27,19,40,0.85)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #2e2820',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        className="font-mono text-[11px] uppercase tracking-widest transition-colors"
        style={{ color: '#7a6b9a', visibility: backVisible ? 'visible' : 'hidden' }}
      >
        ← back
      </button>

      <div className="flex items-center gap-5">
        {skipVisible && (
          <button
            type="button"
            onClick={onSkip}
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: '#5a4b78' }}
          >
            skip
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="rounded-full font-mono text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95"
          style={{
            padding: '12px 28px',
            background: nextDisabled ? 'rgba(200,146,42,0.2)' : '#c8922a',
            color: nextDisabled ? 'rgba(26,20,16,0.4)' : '#1a1410',
            cursor: nextDisabled ? 'not-allowed' : 'pointer',
          }}
        >
          {nextLabel} →
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

const SCREENS: React.ComponentType<ScreenProps>[] = [S1, S2, S3, S4, S5, S6, S7, S8]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { state } = useOnboarding()
  const router = useRouter()
  const supabase = createClient()

  const canNext: Record<number, boolean> = {
    1: !!state.intent_type,
    2:
      !!state.display_name.trim() &&
      !!state.age &&
      parseInt(state.age, 10) >= 18 &&
      state.gender_identity.length > 0,
    3: !!state.location_raw.trim(),
    4: state.gender_preference.length > 0,
    5: true,
    6: true,
    7:
      !!state.post_headline.trim() &&
      state.post_headline.trim().length <= 120 &&
      state.post_body.trim().length <= 2000,
    8: true,
  }

  const navigate = (newStep: number) => {
    setStep(newStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goNext = () => {
    if (step < TOTAL) navigate(step + 1)
    else void publish()
  }
  const goBack = () => navigate(Math.max(1, step - 1))
  const goSkip = () => navigate(Math.min(TOTAL, step + 1))

  const publish = async () => {
    setSaving(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const locationDisplay = state.hide_exact_location
        ? state.location_raw.split(',')[0]?.trim() ?? state.location_raw.trim()
        : state.location_raw.trim()

      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: state.display_name.trim(),
        age: parseInt(state.age, 10),
        gender_identity: state.gender_identity,
        location_raw: state.location_raw.trim(),
        location_display: locationDisplay,
        open_to_distance: state.open_to_distance,
        hide_exact_location: state.hide_exact_location,
        gender_preference: state.gender_preference,
        age_min: state.age_min,
        age_max: state.age_max,
        intent_type: state.intent_type,
        filter_kids: state.filter_kids,
        filter_structure: state.filter_structure,
        filter_smoking: state.filter_smoking,
        filter_alcohol: state.filter_alcohol,
        filter_religion: state.filter_religion,
        onboarding_complete: true,
      })
      if (profileErr) throw profileErr

      const { data: post, error: postErr } = await supabase
        .from('posts')
        .upsert(
          { author_id: user.id, headline: state.post_headline.trim(), post_body: state.post_body.trim(), seeking: state.intent_type },
          { onConflict: 'author_id' }
        )
        .select('id')
        .single()
      if (postErr) throw postErr
      if (!post) throw new Error('Post could not be created')

      const { error: delPT } = await supabase.from('profile_tags').delete().eq('profile_id', user.id)
      if (delPT) throw delPT

      if (state.tags.length > 0) {
        const { error: insPT } = await supabase.from('profile_tags').insert(
          state.tags.map(t => ({ profile_id: user.id, tag_name: t.name, tier: t.tier }))
        )
        if (insPT) throw insPT
      }

      const { error: delPostT } = await supabase.from('post_tags').delete().eq('post_id', post.id)
      if (delPostT) throw delPostT

      const publicTags = state.tags.filter(t => t.tier === 'public')
      if (publicTags.length > 0) {
        const { error: upsertTagsErr } = await supabase
          .from('tags')
          .upsert(publicTags.map(t => ({ name: t.name })), { onConflict: 'name' })
        if (upsertTagsErr) throw upsertTagsErr

        const { data: tagRows, error: tagRowsErr } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', publicTags.map(t => t.name))
        if (tagRowsErr) throw tagRowsErr

        if (tagRows && tagRows.length > 0) {
          const { error: insPostT } = await supabase
            .from('post_tags')
            .insert(tagRows.map(tag => ({ post_id: post.id, tag_id: tag.id })))
          if (insPostT) throw insPostT
        }
      }

      router.push('/feed')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
    }
  }

  const Screen = SCREENS[step - 1]

  return (
    <main className="relative min-h-screen" style={{ background: '#1b1328' }}>
      <BackgroundGlow />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="w-full max-w-sm mx-auto px-6 pt-14 pb-32">
          <ProgressBar current={step} total={TOTAL} />
          <ScreenLabel step={step} />
          <Screen onNext={goNext} />

          {error && (
            <p
              className="font-mono text-[10px] uppercase tracking-[0.12em] mt-6 text-center"
              style={{ color: '#f87171' }}
            >
              {error}
            </p>
          )}
        </div>

        <NavBar
          onBack={goBack}
          onNext={goNext}
          onSkip={goSkip}
          backVisible={step > 1}
          skipVisible={step === 5 || step === 6}
          nextDisabled={!canNext[step] || saving}
          nextLabel={saving ? 'saving...' : step === TOTAL ? 'publish my folio' : 'continue'}
        />
      </div>
    </main>
  )
}
