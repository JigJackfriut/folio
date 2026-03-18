'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { Heading, Sub } from '@/components/onboarding/ui'
import { TagPicker } from '@/components/onboarding/tag-picker'

export function TagsScreen() {
  const { state, set } = useOnboarding()
  return (
    <>
      <Heading>what&apos;s actually you?</Heading>
      <Sub>tap to add · hit &lsquo;refine&rsquo; to set who sees what</Sub>
      <TagPicker value={state.tags} onChange={tags => set({ tags })} />
    </>
  )
}
