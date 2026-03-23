import type { SignalType } from '@/lib/types'

interface Props {
  signal: SignalType
  reason: string
  echoCount: number
  matchedTags: string[]
}

const CONFIG = {
  close: {
    color: '#c3b3ff',
    bg: 'rgba(109,75,195,0.12)',
    border: 'rgba(109,75,195,0.3)',
    dot: '#9b85e8',
  },
  echo: {
    color: '#c8922a',
    bg: 'rgba(200,146,42,0.1)',
    border: 'rgba(200,146,42,0.3)',
    dot: '#c8922a',
  },
  unexpected: {
    color: '#4a3b68',
    bg: 'transparent',
    border: 'transparent',
    dot: '#3a2b58',
  },
}

export function SignalLabel({ signal, reason, echoCount, matchedTags }: Props) {
  // Only show label if there's a real signal
  const hasSignal = signal === 'echo' || signal === 'close' || matchedTags.length > 0 || echoCount > 0
  if (!hasSignal) return null

  const cfg = CONFIG[signal]

  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full font-mono text-[9px]"
      style={{
        padding: '3px 9px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        letterSpacing: '0.06em',
      }}
    >
      <div
        className="rounded-full flex-shrink-0"
        style={{ width: '5px', height: '5px', background: cfg.dot }}
      />
      {reason}
    </div>
  )
}
