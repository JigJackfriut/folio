'use client'

import { useState } from 'react'
import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub } from '@/components/onboarding/ui'

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

export function PostScreen() {
  const { state, set } = useOnboarding()
  const [showExamples, setShowExamples] = useState(false)

  return (
    <>
      <Heading>write your folio</Heading>
      <Sub>a headline and whatever you want to say — write like a person</Sub>

      <div className="mb-6">
        <div className="flex items-end justify-between mb-1">
          <p className="font-serif italic" style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}>
            headline
          </p>
          <p className="font-mono text-[9px]" style={{ color: state.post_headline.length > 100 ? '#c8922a' : '#4a3b68' }}>
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
          style={{ borderBottom: '1px solid #3a2b58', paddingBottom: '10px', fontSize: '18px', fontFamily: 'EB Garamond, Georgia, serif', color: '#f5efff' }}
          onFocus={e => { e.currentTarget.style.borderBottomColor = '#9b85e8' }}
          onBlur={e => { e.currentTarget.style.borderBottomColor = '#3a2b58' }}
        />
      </div>

      <div className="mb-5">
        <div className="flex items-end justify-between mb-1">
          <p className="font-serif italic" style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}>
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
          style={{ borderBottom: '1px solid #3a2b58', paddingBottom: '10px', fontSize: '14px', color: '#d4c8f0' }}
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
              style={{ padding: '11px 14px', fontSize: '11px', color: '#7a6b9a', borderBottom: i < EXAMPLES.length - 1 ? '1px solid #2a1f42' : undefined }}
              onMouseEnter={e => { e.currentTarget.style.color = '#a99abb'; e.currentTarget.style.background = 'rgba(58,43,88,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.color = '#7a6b9a'; e.currentTarget.style.background = 'transparent' }}
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
