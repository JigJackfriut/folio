'use client'

import { useOnboarding } from '@/lib/onboarding-store'
import { TagPicker } from '@/components/onboarding/tag-picker'

export function TagsScreen() {
  const { state, set } = useOnboarding()
  return (
    <TagPicker value={state.tags} onChange={tags => set({ tags })} />
  )
}
