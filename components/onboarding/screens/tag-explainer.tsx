'use client'

import { Heading, Sub } from '@/components/onboarding/ui'

const TIERS = [
  {
    name: 'public',
    icon: '👁',
    color: '#9b85e8',
    bg: 'rgba(155,133,232,0.08)',
    border: 'rgba(155,133,232,0.3)',
    title: 'Public tags',
    description: 'Shown on your folio. These are your conversation starters — the things you want people to see and respond to.',
    examples: ['books', 'cinema', 'dogs', 'cooking', 'night-owl'],
  },
  {
    name: 'match',
    icon: '⚡',
    color: '#c8922a',
    bg: 'rgba(200,146,42,0.08)',
    border: 'rgba(200,146,42,0.3)',
    title: 'Match boosters',
    description: "Invisible on your profile but boost your rank with people who share them. Use these for things you care about but don't want to lead with.",
    examples: ['ambitious', 'therapy-positive', 'non-monogamy-curious', 'sober', 'neurodivergent'],
  },
  {
    name: 'filter',
    icon: '🚫',
    color: '#e07070',
    bg: 'rgba(224,112,112,0.08)',
    border: 'rgba(224,112,112,0.25)',
    title: 'Hard filters',
    description: "People with these tags won't appear in your feed at all. Use sparingly — the more you filter, the smaller your pool.",
    examples: ['smoker', 'wants-kids', 'no-strings', 'long-distance-only'],
  },
  {
    name: 'setting',
    icon: '🔒',
    color: '#7ab8a0',
    bg: 'rgba(122,184,160,0.08)',
    border: 'rgba(122,184,160,0.25)',
    title: 'Private settings',
    description: "Only you can see these. They help us understand you better and improve your matches over time without broadcasting everything.",
    examples: ['introverted', 'anxious-attachment', 'recently-out', 'figuring-it-out'],
  },
]

const WILD_TAGS = [
  'would-survive-apocalypse',
  'cries-at-ads',
  'has-opinions-about-fonts',
  'never-checks-voicemail',
  'knows-too-much-about-wine',
  'emotionally-available',
  'will-debate-pasta-shapes',
  'chronically-online',
  'talks-to-animals',
  'owns-too-many-books',
]

export function TagExplainerScreen() {
  return (
    <div>
      <Heading>tags aren't just vibes.</Heading>
      <Sub>they're a system. here's how it works.</Sub>

      {/* Tier cards */}
      <div className="flex flex-col gap-3 mb-8">
        {TIERS.map(tier => (
          <div
            key={tier.name}
            className="rounded-2xl p-4"
            style={{
              background: tier.bg,
              border: `1px solid ${tier.border}`,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span style={{ fontSize: '16px' }}>{tier.icon}</span>
              <p
                className="font-mono text-[10px] uppercase tracking-[0.14em] font-bold"
                style={{ color: tier.color }}
              >
                {tier.title}
              </p>
            </div>
            <p
              className="leading-relaxed mb-3"
              style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '15px', color: '#c8c0e0' }}
            >
              {tier.description}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {tier.examples.map(tag => (
                <span
                  key={tag}
                  className="font-mono text-[10px] rounded-full px-2.5 py-1"
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: `1px solid ${tier.border}`,
                    color: tier.color,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Wild tags section */}
      <div
        className="rounded-2xl p-4 mb-6"
        style={{ background: 'rgba(30,21,48,0.6)', border: '1px solid #3a2b58' }}
      >
        <p
          className="font-mono text-[10px] uppercase tracking-[0.14em] mb-2"
          style={{ color: '#7a6b9a' }}
        >
          yes, we have weird ones too
        </p>
        <p
          className="leading-relaxed mb-3"
          style={{ fontFamily: 'EB Garamond, Georgia, serif', fontSize: '15px', color: '#c8c0e0' }}
        >
          Some tags are just honest. You don't have to lead with them — put them as match boosters or private settings if you want. But the right person will love them.
        </p>
        <div className="flex flex-wrap gap-1.5">
          {WILD_TAGS.map(tag => (
            <span
              key={tag}
              className="font-mono text-[10px] rounded-full px-2.5 py-1"
              style={{
                background: 'rgba(155,133,232,0.06)',
                border: '1px solid #3a2b58',
                color: '#7a6b9a',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom note */}
      <div className="flex items-start gap-3">
        <span style={{ fontSize: '14px', marginTop: '2px' }}>💡</span>
        <p
          className="font-mono text-[10px] leading-relaxed"
          style={{ color: '#5a4b78' }}
        >
          You can add up to 20 tags total. You can change them anytime from your profile. There are no wrong answers — only honest ones.
        </p>
      </div>
    </div>
  )
}
