'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { resetOnboarding } from '@/lib/dev-reset'

// This page only works in development.
// In production it renders nothing.
// Access it at: localhost:3000/dev

export default function DevPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()

  if (process.env.NODE_ENV === 'production') {
    return null
  }

  const handleReset = async () => {
    setStatus('loading')
    setError('')
    try {
      await resetOnboarding()
      setStatus('done')
      setTimeout(() => router.push('/onboarding'), 800)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#1b1328',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '360px',
          padding: '32px',
          border: '1px solid #3a2b58',
          borderRadius: '20px',
          background: 'rgba(30,21,48,0.8)',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '10px', color: '#c8922a', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '4px' }}>
            dev tools
          </p>
          <p style={{ fontSize: '11px', color: '#4a3b68', letterSpacing: '0.05em' }}>
            localhost only · not visible in production
          </p>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          disabled={status === 'loading' || status === 'done'}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: '1px solid #9b85e8',
            background: status === 'done' ? 'rgba(29,158,117,0.2)' : 'rgba(109,75,195,0.2)',
            color: status === 'done' ? '#5DCAA5' : '#c3b3ff',
            fontSize: '12px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            cursor: status === 'loading' ? 'wait' : 'pointer',
            transition: 'all 0.15s',
            marginBottom: '12px',
          }}
        >
          {status === 'idle' && '↺  reset onboarding'}
          {status === 'loading' && 'resetting...'}
          {status === 'done' && '✓  done — redirecting'}
          {status === 'error' && '↺  reset onboarding'}
        </button>

        {/* What it does */}
        <div
          style={{
            padding: '12px',
            borderRadius: '10px',
            background: 'rgba(42,31,66,0.4)',
            marginBottom: '12px',
          }}
        >
          <p style={{ fontSize: '10px', color: '#5a4b78', lineHeight: 1.8 }}>
            clears: profile fields · post · tags<br />
            sets: onboarding_complete = false<br />
            then: redirects to /onboarding
          </p>
        </div>

        {error && (
          <p style={{ fontSize: '11px', color: '#f87171', marginTop: '8px' }}>{error}</p>
        )}
      </div>
    </main>
  )
}

