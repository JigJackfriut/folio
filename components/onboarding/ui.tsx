'use client'

import React from 'react'

export const STEP_LABELS = [
  'Intent',
  'The Vitals',
  'Geography',
  'Preferences',
  'The Soul',
  'Curate Tags',
  'Write Folio',
  'Review',
]

export type ScreenProps = { onNext?: () => void }

// ── ScreenLabel ──────────────────────────────────────────────────────────────

export function ScreenLabel({ step }: { step: number }) {
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

// ── Heading ──────────────────────────────────────────────────────────────────

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="leading-[1.2] mb-1.5"
      style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '30px', color: '#f5efff' }}
    >
      {children}
    </h1>
  )
}

// ── Sub ───────────────────────────────────────────────────────────────────────

export function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono leading-relaxed mb-7"
      style={{ fontSize: '11px', color: '#7a6b9a', letterSpacing: '0.02em' }}
    >
      {children}
    </p>
  )
}

// ── EditorialInput ────────────────────────────────────────────────────────────

export function EditorialInput({
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

// ── OptionCard ────────────────────────────────────────────────────────────────

export function OptionCard({
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
        <p className="text-[14px] font-medium mb-0.5 transition-colors" style={{ color: selected ? '#f0eaff' : '#a99abb' }}>
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

// ── Chip ──────────────────────────────────────────────────────────────────────

export function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
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

// ── Toggle ────────────────────────────────────────────────────────────────────

export function Toggle({ label, hint, checked, onChange }: {
  label: string
  hint?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #2a1f42' }}>
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

// ── FilterRow ─────────────────────────────────────────────────────────────────

export function FilterRow({ question, options, value, onChange }: {
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

// ── ProgressBar ───────────────────────────────────────────────────────────────

export function ProgressBar({ current, total }: { current: number; total: number }) {
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

// ── NavBar ────────────────────────────────────────────────────────────────────

export function NavBar({
  onBack, onNext, onSkip,
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
      style={{ background: 'rgba(27,19,40,0.85)', backdropFilter: 'blur(12px)', borderTop: '1px solid #2e2820' }}
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
          <button type="button" onClick={onSkip} className="font-mono text-[11px] uppercase tracking-widest" style={{ color: '#5a4b78' }}>
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
