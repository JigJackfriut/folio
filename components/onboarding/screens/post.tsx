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

      <div className="mb-8">
        <div className="flex items-end justify-between mb-2">
          <p
            className="italic"
            style={{
              fontSize: '24px',
              color: '#b7abd6',
              fontFamily: 'EB Garamond, Georgia, serif',
            }}
          >
            headline
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: state.post_headline.length > 100 ? '#d7a43b' : '#978ab8' }}
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
          className="w-full bg-transparent outline-none placeholder:opacity-35 font-sans"
          style={{
            borderBottom: '1px solid #5b4c7d',
            paddingBottom: '12px',
            fontSize: '30px',
            lineHeight: '1.2',
            color: '#f7f2ff',
          }}
          onFocus={e => {
            e.currentTarget.style.borderBottomColor = '#a88cff'
          }}
          onBlur={e => {
            e.currentTarget.style.borderBottomColor = '#5b4c7d'
          }}
        />
      </div>

      <div className="mb-6">
        <div className="flex items-end justify-between mb-2">
          <p
            className="italic"
            style={{
              fontSize: '24px',
              color: '#b7abd6',
              fontFamily: 'EB Garamond, Georgia, serif',
            }}
          >
            your post
          </p>
          <p
            className="font-mono text-[10px] uppercase tracking-[0.12em]"
            style={{ color: '#978ab8' }}
          >
            {state.post_body.length}/2000
          </p>
        </div>

        <textarea
          value={state.post_body}
          onChange={e => set({ post_body: e.target.value })}
          maxLength={2000}
          rows={6}
          placeholder="Tell them about yourself. What makes you, you? Who are you looking for? No rules."
          className="w-full bg-transparent outline-none placeholder:opacity-35 resize-none font-sans"
          style={{
            borderBottom: '1px solid #5b4c7d',
            paddingBottom: '12px',
            fontSize: '18px',
            lineHeight: '1.7',
            color: '#ddd2fb',
          }}
          onFocus={e => {
            e.currentTarget.style.borderBottomColor = '#a88cff'
          }}
          onBlur={e => {
            e.currentTarget.style.borderBottomColor = '#5b4c7d'
          }}
        />
      </div>

      <button
        type="button"
        onClick={() => setShowExamples(!showExamples)}
        className="flex items-center gap-2 mb-3 transition-colors"
        style={{ color: showExamples ? '#d9ccff' : '#b7abd6' }}
      >
        <span style={{ fontSize: '10px' }}>{showExamples ? '▾' : '▸'}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">
          need a nudge?
        </span>
      </button>

      {showExamples && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: '1px solid #5b4c7d', background: 'rgba(44, 31, 70, 0.55)' }}
        >
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => set({ post_headline: ex.headline, post_body: ex.body })}
              className="block w-full text-left transition-all font-sans"
              style={{
                padding: '14px 16px',
                fontSize: '14px',
                color: '#d7ccf2',
                borderBottom: i < EXAMPLES.length - 1 ? '1px solid #3c2f5d' : undefined,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#f1ebff'
                e.currentTarget.style.background = 'rgba(74, 53, 118, 0.35)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#d7ccf2'
                e.currentTarget.style.background = 'transparent'
              }}
            >
              <span style={{ color: '#a88cff', marginRight: '8px' }}>→</span>
              {ex.headline}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
