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
  // S3
  match_base: 'location' | 'college'
  location_raw: string
  location_place_id: string
  college_name: string
  college_country: string
  college_url: string
  match_radius_miles: number
  hide_exact_location: boolean
  open_to_distance: boolean
  open_to_online: boolean
  connection_pref: 'in-person' | 'both' | 'online'
  // S4
  gender_preference: string[]
  age_min: number
  age_max: number
  // S5 — tags
  tags: TagEntry[]
  // S6 — post
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
  location_place_id: '',
  college_name: '',
  college_country: '',
  college_url: '',
  match_radius_miles: 25,
  hide_exact_location: true,
  open_to_distance: false,
  open_to_online: false,
  connection_pref: 'both',
  gender_preference: [],
  age_min: 22,
  age_max: 36,
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
