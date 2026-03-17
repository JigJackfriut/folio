'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { TagEntry } from '@/lib/tags'

export interface OnboardingState {
  // S1
  intent_type: string
  // S2
  display_name: string
  age: string
  gender_identity: string[]
  // S3
  location_raw: string
  open_to_distance: boolean
  hide_exact_location: boolean
  // S4
  gender_preference: string[]
  age_min: number
  age_max: number
  // S5
  filter_kids: string
  filter_structure: string
  filter_smoking: string
  filter_alcohol: string
  filter_religion: string
  // S6
  tags: TagEntry[]
  // S7
  post_headline: string
  post_body: string
}

const initial: OnboardingState = {
  intent_type: '',
  display_name: '',
  age: '',
  gender_identity: [],
  location_raw: '',
  open_to_distance: false,
  hide_exact_location: true,
  gender_preference: [],
  age_min: 22,
  age_max: 36,
  filter_kids: 'open',
  filter_structure: 'open',
  filter_smoking: 'any',
  filter_alcohol: 'any',
  filter_religion: 'open',
  tags: [],
  post_headline: '',
  post_body: '',
}

type Action = { type: 'SET'; payload: Partial<OnboardingState> } | { type: 'RESET' }

function reducer(state: OnboardingState, action: Action): OnboardingState {
  if (action.type === 'RESET') return initial
  return { ...state, ...action.payload }
}

const Ctx = createContext<{
  state: OnboardingState
  set: (p: Partial<OnboardingState>) => void
} | null>(null)

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial)
  const set = (payload: Partial<OnboardingState>) => dispatch({ type: 'SET', payload })
  return <Ctx.Provider value={{ state, set }}>{children}</Ctx.Provider>
}

export function useOnboarding() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useOnboarding must be used within OnboardingProvider')
  return ctx
}
