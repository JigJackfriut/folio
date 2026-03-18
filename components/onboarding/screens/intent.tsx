'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub, OptionCard, type ScreenProps } from '@/components/onboarding/ui'

const INTENTS = [
  { value: 'something_real', title: 'Something real',    desc: 'Long-term, committed — the whole thing',                  icon: '♾' },
  { value: 'casual',         title: 'Something casual',  desc: 'No pressure, just see where it goes',                     icon: '✦' },
  { value: 'friends_first',  title: 'Friends first',     desc: 'Build a real connection before anything else',            icon: '◯' },
  { value: 'companion',      title: 'A companion',       desc: 'Someone to share life with — dates, trips, the everyday', icon: '⌂' },
  { value: 'no_idea',        title: 'Honestly? No idea', desc: 'Just here to see what happens',                           icon: '?' },
]

export function IntentScreen({ onNext }: ScreenProps) {
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
