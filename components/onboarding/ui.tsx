'use client'

import { motion } from 'framer-motion'

// ── Progress dots ────────────────────────────────────────────────────────────

export function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-10">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-[2px] flex-1 rounded-full transition-all duration-300 ${
            i < current - 1
              ? 'bg-[#c3b3ff]'
              : i === current - 1
              ? 'bg-[#8b6fd4]'
              : 'bg-[#3a2b58]'
          }`}
        />
      ))}
    </div>
  )
}

// ── Screen wrapper with fade/slide animation ─────────────────────────────────

export function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="flex flex-col flex-1"
    >
      {children}
    </motion.div>
  )
}

// ── Screen label (monospace top label) ──────────────────────────────────────

export function ScreenLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#7a6b9a] mb-6">
      {children}
    </p>
  )
}

// ── Main heading ─────────────────────────────────────────────────────────────

export function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="font-serif text-[28px] leading-[1.25] text-[#f5efff] mb-1.5">
      {children}
    </h1>
  )
}

// ── Subheading / hint ────────────────────────────────────────────────────────

export function Sub({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[11px] text-[#7a6b9a] tracking-[0.02em] mb-7 leading-relaxed">
      {children}
    </p>
  )
}

// ── Option card (single-select) ──────────────────────────────────────────────

export function OptionCard({
  title,
  description,
  selected,
  onClick,
}: {
  title: string
  description: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-2xl border px-5 py-4 mb-2 transition-all duration-150 ${
        selected
          ? 'border-[#9b85e8] bg-[#2e1f4a]/80'
          : 'border-[#3a2b58] bg-[#1e1530]/60 hover:border-[#5a4578]'
      }`}
    >
      <p className={`text-[14px] font-medium mb-0.5 transition-colors ${selected ? 'text-[#f0eaff]' : 'text-[#a99abb]'}`}>
        {title}
      </p>
      <p className="text-[12px] text-[#7a6b9a] leading-snug">{description}</p>
    </button>
  )
}

// ── Text input ───────────────────────────────────────────────────────────────

export function Field({
  label,
  hint,
  ...props
}: {
  label?: string
  hint?: string
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="mb-5">
      {label && (
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a6b9a] mb-1.5">
          {label}
        </p>
      )}
      <input
        {...props}
        className="w-full bg-transparent border-b border-[#3a2b58] pb-2.5 text-[16px] text-[#f5efff] outline-none placeholder:text-[#4a3b68] focus:border-[#9b85e8] transition-colors"
      />
      {hint && (
        <p className="font-mono text-[10px] text-[#4a3b68] mt-1.5">{hint}</p>
      )}
    </div>
  )
}

// ── Chip (multi-select) ───────────────────────────────────────────────────────

export function Chip({
  label,
  selected,
  onClick,
  size = 'md',
}: {
  label: string
  selected: boolean
  onClick: () => void
  size?: 'sm' | 'md'
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border transition-all duration-150 ${
        size === 'sm' ? 'px-3 py-1.5 text-[12px]' : 'px-4 py-2 text-[13px]'
      } ${
        selected
          ? 'border-[#9b85e8] bg-[#2e1f4a] text-[#f0eaff] font-medium'
          : 'border-[#3a2b58] bg-transparent text-[#7a6b9a] hover:border-[#5a4578] hover:text-[#a99abb]'
      }`}
    >
      {label}
    </button>
  )
}

// ── Toggle ────────────────────────────────────────────────────────────────────

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
    <div
      className="flex items-center justify-between py-4 border-b border-[#2a1f42]"
    >
      <div className="flex-1 pr-4">
        <p className="text-[14px] text-[#d4c8f0]">{label}</p>
        {hint && <p className="text-[11px] text-[#7a6b9a] mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-10 h-[22px] rounded-full transition-colors duration-200 flex-shrink-0 ${
          checked ? 'bg-[#6d4bc3]' : 'bg-[#3a2b58]'
        }`}
      >
        <span
          className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${
            checked ? 'left-[21px]' : 'left-[3px]'
          }`}
        />
      </button>
    </div>
  )
}

// ── Filter row (single-select pill group) ────────────────────────────────────

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
    <div className="py-4 border-b border-[#2a1f42]">
      <p className="text-[13px] font-medium text-[#c3b3ff] mb-3">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`px-4 py-1.5 rounded-full text-[12px] border transition-all duration-150 ${
              value === opt.value
                ? 'border-[#9b85e8] bg-[#2e1f4a] text-[#f0eaff]'
                : 'border-[#3a2b58] text-[#7a6b9a] hover:border-[#5a4578]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Bottom nav bar ────────────────────────────────────────────────────────────

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
    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-t border-[#2a1f42] bg-[#1b1328]">
      <button
        type="button"
        onClick={onBack}
        className={`font-mono text-[12px] text-[#7a6b9a] hover:text-[#a99abb] transition-colors ${
          !backVisible ? 'invisible' : ''
        }`}
      >
        ← back
      </button>
      <div className="flex items-center gap-3">
        {skipVisible && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="font-mono text-[12px] text-[#7a6b9a] hover:text-[#a99abb] transition-colors"
          >
            skip
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className="px-6 py-2.5 rounded-full bg-[#6d4bc3] font-mono text-[13px] font-bold text-white tracking-[0.08em] transition-all hover:bg-[#7d5bd3] active:scale-[0.97] disabled:bg-[#3b2f4f] disabled:text-[#7a6b9a]"
        >
          {nextLabel}
        </button>
      </div>
    </div>
  )
}
