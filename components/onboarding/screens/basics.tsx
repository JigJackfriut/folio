'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub, EditorialInput, Chip } from '@/components/onboarding/ui'

const GENDERS = ['Man', 'Woman', 'Non-binary', 'Trans man', 'Trans woman', 'Genderfluid', 'Agender', 'Intersex', 'Prefer not to say']

export function BasicsScreen() {
  const { state, set } = useOnboarding()

  const toggle = (g: string) => {
    const cur = state.gender_identity
    set({ gender_identity: cur.includes(g) ? cur.filter(x => x !== g) : [...cur, g] })
  }

  return (
    <>
      <Heading>who are you?</Heading>
      <Sub>just the basics — you&apos;ll tell your story later</Sub>

      <div className="flex gap-5 items-start">
        <div className="w-28 flex-shrink-0">
          <EditorialInput
            label="Age"
            type="number"
            min={18}
            max={99}
            placeholder="27"
            value={state.age}
            onChange={e => set({ age: e.target.value })}
            hint="18 or over"
          />
        </div>
        <div className="flex-1">
          <EditorialInput
            label="I go by..."
            placeholder="Name or handle"
            value={state.display_name}
            onChange={e => set({ display_name: e.target.value })}
            maxLength={40}
            hint="shown on your folio"
          />
        </div>
      </div>

      <p
        className="font-serif italic mb-3"
        style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
      >
        I identify as...
      </p>
      <div className="flex flex-wrap gap-2">
        {GENDERS.map(g => (
          <Chip key={g} label={g} selected={state.gender_identity.includes(g)} onClick={() => toggle(g)} />
        ))}
      </div>
    </>
  )
}
