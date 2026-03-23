import type { SignalType } from '@/lib/types'

interface Props {
  signal: SignalType
  reason: string
  echoCount: number
}

const CONFIG = {
  close: {
    color: '#9b85e8',
    bg: 'rgba(109,75,195,0.12)',
    border: 'rgba(109,75,195,0.25)',
    dot: '#9b85e8',
  },
  echo: {
    color: '#c8922a',
    bg: 'rgba(200,146,42,0.1)',
    border: 'rgba(200,146,42,0.25)',
    dot: '#c8922a',
  },
  unexpected: {
    color: '#4a3b68',
    bg: 'rgba(30,21,48,0.6)',
    border: '#2e2040',
    dot: '#3a2b58',
  },
}

export function SignalLabel({ signal, reason }: Props) {
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
