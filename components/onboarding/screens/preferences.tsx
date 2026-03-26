'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub, Chip } from '@/components/onboarding/ui'

const serif = 'EB Garamond, Georgia, serif'
const GENDERS = ['Women', 'Men', 'Non-binary', 'Everyone', 'Trans women', 'Trans men']

export function PreferencesScreen() {
  const { state, set } = useOnboarding()

  const toggleG = (g: string) => {
    if (g === 'Everyone') { set({ gender_preference: ['Everyone'] }); return }
    const without = state.gender_preference.filter(x => x !== 'Everyone')
    set({ gender_preference: without.includes(g) ? without.filter(x => x !== g) : [...without, g] })
  }

  const handleAge = (key: 'age_min' | 'age_max', raw: string) => {
    const v = parseInt(raw, 10)
    if (isNaN(v)) return
    if (key === 'age_min') {
      if (v < 18 || v > 99) return
      set({ age_min: v, age_max: Math.max(v, state.age_max) })
    } else {
      if (v < 18 || v > 99) return
      set({ age_max: v, age_min: Math.min(v, state.age_min) })
    }
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

      <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '15px', color: '#8a7aaa', marginBottom: '16px' }}>
        Age range
      </p>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#6a5a88' }}>
            from
          </label>
          <input
            type="number"
            min={18}
            max={99}
            value={state.age_min}
            onChange={e => handleAge('age_min', e.target.value)}
            className="outline-none bg-transparent text-center rounded-xl"
            style={{
              width: '72px',
              height: '52px',
              fontFamily: serif,
              fontSize: '24px',
              color: '#f0eaff',
              border: '1.5px solid #3d2f5c',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#6d4bc3' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#3d2f5c' }}
          />
        </div>

        <div style={{ color: '#4a3b68', fontFamily: serif, fontSize: '20px', paddingTop: '20px' }}>—</div>

        <div className="flex flex-col gap-1">
          <label className="font-mono text-[10px] uppercase tracking-widest" style={{ color: '#6a5a88' }}>
            to
          </label>
          <input
            type="number"
            min={18}
            max={99}
            value={state.age_max}
            onChange={e => handleAge('age_max', e.target.value)}
            className="outline-none bg-transparent text-center rounded-xl"
            style={{
              width: '72px',
              height: '52px',
              fontFamily: serif,
              fontSize: '24px',
              color: '#f0eaff',
              border: '1.5px solid #3d2f5c',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => { e.currentTarget.style.borderColor = '#6d4bc3' }}
            onBlur={e => { e.currentTarget.style.borderColor = '#3d2f5c' }}
          />
        </div>

        <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: '22px', color: '#f0eaff', paddingTop: '20px' }}>
          {state.age_min === state.age_max
            ? `${state.age_min}`
            : `${state.age_min} – ${state.age_max}`}
        </p>
      </div>

      <p className="font-mono text-[10px]" style={{ color: '#5a4b78' }}>
        soft limits — people just outside this range may still appear
      </p>
    </>
  )
}
