'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub, Chip } from '@/components/onboarding/ui'

const GENDERS = ['Women', 'Men', 'Non-binary', 'Everyone', 'Trans women', 'Trans men']

export function PreferencesScreen() {
  const { state, set } = useOnboarding()

  const toggleG = (g: string) => {
    if (g === 'Everyone') { set({ gender_preference: ['Everyone'] }); return }
    const without = state.gender_preference.filter(x => x !== 'Everyone')
    set({ gender_preference: without.includes(g) ? without.filter(x => x !== g) : [...without, g] })
  }

  return (
    <>
      <Heading>who do you want to meet?</Heading>
      <Sub>select all that apply</Sub>

      <div className="flex flex-wrap gap-2 mb-8">
        {GENDERS.map(g => (
          <Chip key={g} label={g} selected={state.gender_preference.includes(g)} onClick={() => toggleG(g)} />
        ))}
      </div>

      <p
        className="font-serif italic mb-4"
        style={{ fontSize: '15px', color: '#7a6b9a', fontFamily: 'EB Garamond, Georgia, serif' }}
      >
        Age range
      </p>

      <div className="space-y-4">
        {(['age_min', 'age_max'] as const).map(key => (
          <div key={key} className="flex items-center gap-3">
            <span className="font-mono text-[10px] w-7" style={{ color: '#7a6b9a' }}>
              {key === 'age_min' ? 'from' : 'to'}
            </span>
            <input
              type="range"
              min={18}
              max={80}
              value={state[key]}
              onChange={e => {
                const v = parseInt(e.target.value, 10)
                if (key === 'age_min' && v > state.age_max) return
                if (key === 'age_max' && v < state.age_min) return
                set({ [key]: v })
              }}
              className="flex-1 accent-[#6d4bc3]"
            />
            <span className="font-mono text-[14px] w-7 text-right" style={{ color: '#f5efff' }}>
              {state[key]}
            </span>
          </div>
        ))}
      </div>
      <p className="font-mono text-[10px] mt-3" style={{ color: '#4a3b68' }}>
        soft limits — people just outside this range may still appear
      </p>
    </>
  )
}
