'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { TagEntry } from '@/lib/tags'

export interface CollegeResult {
  name: string
  country: string
  web_pages: string[]
}

export interface OnboardingState {
  // S1
  intent_type: string
  // S2
  display_name: string
  age: string
  gender_identity: string[]
  // S3 — flexible matching base
  match_base: 'location' | 'college'   // which anchor to use for proximity matching
  location_raw: string                  // city/neighbourhood text (if match_base = 'location')
  college_name: string                  // selected college name (if match_base = 'college')
  college_country: string               // college country
  college_url: string                   // college web_pages[0] for deduplication
  match_radius_miles: number            // proximity radius (5 | 10 | 25 | 50 | 100)
  hide_exact_location: boolean          // show neighbourhood only
  open_to_distance: boolean             // also show people outside radius
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
  match_base: 'location',
  location_raw: '',
  college_name: '',
  college_country: '',
  college_url: '',
  match_radius_miles: 25,
  hide_exact_location: true,
  open_to_distance: false,
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
