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

export function ScreenLabel({ step }: { step: number }) {
  return (
    <div className="flex flex-col mb-9">
      <div className="flex items-center gap-3">
        <span
          className="font-serif italic text-lg"
          style={{ color: '#d7a43b', fontFamily: 'EB Garamond, Georgia, serif' }}
        >
          Step {step}
        </span>
        <div
          className="h-[1px] flex-1 opacity-40"
          style={{ background: 'linear-gradient(to right, #d7a43b, transparent)' }}
        />
      </div>
      <span
        className="font-mono text-[10px] uppercase mt-1"
        style={{ color: '#b7abd6', letterSpacing: '0.3em' }}
      >
        {STEP_LABELS[step - 1]}
      </span>
    </div>
  )
}

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1
      className="leading-[1.2] mb-1.5"
      style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '30px', color: '#f7f2ff' }}
    >
      {children}
    </h1>
  )
}

export function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono leading-relaxed mb-7"
      style={{ fontSize: '11px', color: '#cbbfe8', letterSpacing: '0.02em' }}
    >
      {children}
    </p>
  )
}

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
          style={{ fontSize: '15px', color: '#b7abd6', fontFamily: 'EB Garamond, Georgia, serif' }}
        >
          {label}
        </p>
      )}
      <input
        {...props}
        className="w-full bg-transparent outline-none placeholder:opacity-40 transition-colors"
        style={{
          borderBottom: '1px solid #5b4c7d',
          paddingBottom: '10px',
          fontSize: '20px',
          fontFamily: 'EB Garamond, Georgia, serif',
          color: '#f7f2ff',
        }}
        onFocus={e => {
          e.currentTarget.style.borderBottomColor = '#a88cff'
          e.currentTarget.previousElementSibling?.setAttribute(
            'style',
            'font-size:15px;color:#d7a43b;font-family:EB Garamond,Georgia,serif;font-style:italic;margin-bottom:4px;transition:color 0.2s'
          )
        }}
        onBlur={e => {
          e.currentTarget.style.borderBottomColor = '#5b4c7d'
          e.currentTarget.previousElementSibling?.setAttribute(
            'style',
            'font-size:15px;color:#b7abd6;font-family:EB Garamond,Georgia,serif;font-style:italic;margin-bottom:4px;transition:color 0.2s'
          )
        }}
      />
      {hint && (
        <p className="font-mono text-[9px] uppercase tracking-wider mt-1.5" style={{ color: '#978ab8' }}>
          {hint}
        </p>
      )}
    </div>
  )
}

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
      className="w-full text-left rounded-2xl mb-3 transition-all duration-150 flex items-center gap-4 hover:translate-y-[-1px]"
      style={{
        padding: '15px 16px',
        border: `1px solid ${selected ? '#a88cff' : '#5b4c7d'}`,
        background: selected ? 'rgba(74, 53, 118, 0.92)' : 'rgba(44, 31, 70, 0.9)',
        boxShadow: selected ? '0 0 0 1px rgba(168,140,255,0.18)' : 'none',
      }}
    >
      {icon && (
        <span
          className="flex-shrink-0 flex items-center justify-center rounded-full font-mono"
          style={{
            width: '34px',
            height: '34px',
            background: selected ? 'rgba(168,140,255,0.24)' : 'rgba(91,76,125,0.45)',
            color: selected ? '#efe7ff' : '#d6caf2',
            fontSize: '14px',
          }}
        >
          {icon}
        </span>
      )}
      <div className="flex-1">
        <p
          className="text-[15px] font-medium mb-1 transition-colors"
          style={{ color: selected ? '#f7f2ff' : '#eee7ff' }}
        >
          {title}
        </p>
        <p className="text-[12px] leading-relaxed" style={{ color: selected ? '#ddd2fb' : '#c6b8e8' }}>
          {description}
        </p>
      </div>
      <div
        className="flex-shrink-0 rounded-full transition-all flex items-center justify-center"
        style={{
          width: '18px',
          height: '18px',
          border: `1.5px solid ${selected ? '#a88cff' : '#6c5a94'}`,
          background: selected ? '#a88cff' : 'transparent',
        }}
      >
        {selected && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
      </div>
    </button>
  )
}

export function Chip({
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
        padding: '8px 13px',
        fontSize: '12px',
        borderColor: selected ? '#a88cff' : '#5b4c7d',
        background: selected ? 'rgba(74, 53, 118, 0.9)' : 'rgba(44, 31, 70, 0.55)',
        color: selected ? '#f7f2ff' : '#d3c7ef',
        fontWeight: selected ? 500 : 400,
      }}
    >
      {label}
    </button>
  )
}

export function Toggle({
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
    <div className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid #3c2f5d' }}>
      <div className="flex-1 pr-4">
        <p className="text-[13px]" style={{ color: '#efe7ff' }}>
          {label}
        </p>
        {hint && (
          <p className="text-[11px] mt-0.5" style={{ color: '#c1b4df' }}>
            {hint}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className="relative flex-shrink-0 rounded-full transition-colors duration-200"
        style={{ width: '40px', height: '22px', background: checked ? '#7b57db' : '#5b4c7d' }}
      >
        <span
          className="absolute top-[3px] rounded-full bg-white shadow-sm transition-all duration-200"
          style={{ width: '16px', height: '16px', left: checked ? '21px' : '3px' }}
        />
      </button>
    </div>
  )
}

export function FilterRow({
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
    <div className="py-4" style={{ borderBottom: '1px solid #3c2f5d' }}>
      <p className="font-medium mb-3" style={{ color: '#ddd2fb', fontSize: '13px' }}>
        {question}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-4 py-1.5 rounded-full text-[12px] border transition-all duration-150"
            style={{
              borderColor: value === opt.value ? '#a88cff' : '#5b4c7d',
              background: value === opt.value ? 'rgba(74, 53, 118, 0.88)' : 'rgba(44, 31, 70, 0.45)',
              color: value === opt.value ? '#f7f2ff' : '#d3c7ef',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / (total - 1)) * 100
  return (
    <div className="relative w-full h-[2px] mb-10" style={{ background: '#33264f' }}>
      <div
        className="absolute left-0 top-0 h-full transition-all duration-500"
        style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7b57db, #d7a43b)' }}
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
                background: isDone ? '#a88cff' : isActive ? '#d7a43b' : '#473461',
                marginTop: isActive ? '-3px' : '-1px',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export function NavBar({
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
        background: 'rgba(23, 16, 36, 0.92)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #3c2f5d',
      }}
    >
      <button
        type="button"
        onClick={onBack}
        className="font-mono text-[11px] uppercase tracking-widest transition-colors"
        style={{ color: '#c1b4df', visibility: backVisible ? 'visible' : 'hidden' }}
      >
        ← back
      </button>
      <div className="flex items-center gap-5">
        {skipVisible && (
          <button
            type="button"
            onClick={onSkip}
            className="font-mono text-[11px] uppercase tracking-widest"
            style={{ color: '#b7abd6' }}
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
            background: nextDisabled ? 'rgba(215,164,59,0.22)' : '#d7a43b',
            color: nextDisabled ? 'rgba(26,20,16,0.45)' : '#1a1410',
            cursor: nextDisabled ? 'not-allowed' : 'pointer',
            opacity: nextDisabled ? 0.7 : 1,
          }}
        >
          {nextLabel} →
        </button>
      </div>
    </div>
  )
}
