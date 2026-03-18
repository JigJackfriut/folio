'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub, FilterRow } from '@/components/onboarding/ui'

const FILTER_ROWS = [
  {
    key: 'filter_kids' as const,
    q: 'Kids',
    opts: [
      { label: 'Want them',      value: 'want'      },
      { label: 'Have them',      value: 'have'      },
      { label: "Don't want them", value: 'dont_want' },
      { label: 'Open either way', value: 'open'      },
    ],
  },
  {
    key: 'filter_structure' as const,
    q: 'Relationship structure',
    opts: [
      { label: 'Monogamous only',  value: 'mono' },
      { label: 'ENM / poly / open', value: 'enm'  },
      { label: 'Open to either',   value: 'open' },
    ],
  },
  {
    key: 'filter_smoking' as const,
    q: 'Smoking',
    opts: [
      { label: 'Non-smoker',   value: 'no'  },
      { label: 'Smoker',       value: 'yes' },
      { label: 'No preference', value: 'any' },
    ],
  },
  {
    key: 'filter_alcohol' as const,
    q: 'Alcohol',
    opts: [
      { label: "Don't drink",   value: 'no'     },
      { label: 'Social drinker', value: 'social' },
      { label: 'No preference',  value: 'any'    },
    ],
  },
  {
    key: 'filter_religion' as const,
    q: 'Faith / religion',
    opts: [
      { label: 'Same faith matters', value: 'same'         },
      { label: 'Not important',      value: 'not_important' },
      { label: 'Open',               value: 'open'          },
    ],
  },
]

export function FiltersScreen() {
  const { state, set } = useOnboarding()

  return (
    <>
      <Heading>a few things that actually matter</Heading>
      <Sub>never shown publicly — quietly removes bad fits before they reach you</Sub>
      <div style={{ borderTop: '1px solid #2a1f42' }}>
        {FILTER_ROWS.map(row => (
          <FilterRow
            key={row.key}
            question={row.q}
            options={row.opts}
            value={state[row.key]}
            onChange={v => set({ [row.key]: v })}
          />
        ))}
      </div>
    </>
  )
}
