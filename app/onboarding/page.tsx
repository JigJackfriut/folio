'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding } from '@/lib/onboarding-store'
import { BackgroundGlow } from '@/components/ui/background-glow'
import { ProgressBar, ScreenLabel, NavBar } from '@/components/onboarding/ui'
import { IntentScreen }      from '@/components/onboarding/screens/intent'
import { BasicsScreen }      from '@/components/onboarding/screens/basics'
import { LocationScreen }    from '@/components/onboarding/screens/location'
import { PreferencesScreen } from '@/components/onboarding/screens/preferences'
import { FiltersScreen }     from '@/components/onboarding/screens/filters'
import { TagsScreen }        from '@/components/onboarding/screens/tags'
import { PostScreen }        from '@/components/onboarding/screens/post'
import { PreviewScreen }     from '@/components/onboarding/screens/preview'

const TOTAL = 8

export default function OnboardingPage() {
  const [step, setStep]     = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const { state } = useOnboarding()
  const router    = useRouter()
  const supabase  = createClient()

  // ── Validation per step ────────────────────────────────────────────────────
  const canNext: Record<number, boolean> = {
    1: !!state.intent_type,
    2: !!state.display_name.trim() && !!state.age && parseInt(state.age, 10) >= 18 && state.gender_identity.length > 0,
    3: state.match_base === 'location' ? !!state.location_raw.trim() : !!state.college_name.trim(),
    4: state.gender_preference.length > 0,
    5: true,
    6: true,
    7: !!state.post_headline.trim() && state.post_headline.trim().length <= 120 && state.post_body.trim().length <= 2000,
    8: true,
  }

  const navigate = (newStep: number) => {
    setStep(newStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goNext = () => { if (step < TOTAL) navigate(step + 1); else void publish() }
  const goBack = () => navigate(Math.max(1, step - 1))
  const goSkip = () => navigate(Math.min(TOTAL, step + 1))

  // ── Publish to Supabase ────────────────────────────────────────────────────
  const publish = async () => {
    setSaving(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const locationDisplay = state.match_base === 'college'
        ? state.college_name
        : state.hide_exact_location
          ? state.location_raw.split(',')[0]?.trim() ?? state.location_raw.trim()
          : state.location_raw.trim()

      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: state.display_name.trim(),
        age: parseInt(state.age, 10),
        gender_identity: state.gender_identity,
        match_base: state.match_base,
        location_raw: state.location_raw.trim(),
        location_display: locationDisplay,
        college_name: state.college_name,
        college_country: state.college_country,
        college_url: state.college_url,
        match_radius_miles: state.match_radius_miles,
        open_to_distance: state.open_to_distance,
        hide_exact_location: state.hide_exact_location,
        gender_preference: state.gender_preference,
        age_min: state.age_min,
        age_max: state.age_max,
        intent_type: state.intent_type,
        filter_kids: state.filter_kids,
        filter_structure: state.filter_structure,
        filter_smoking: state.filter_smoking,
        filter_alcohol: state.filter_alcohol,
        filter_religion: state.filter_religion,
        onboarding_complete: true,
      })
      if (profileErr) throw profileErr

      const { data: post, error: postErr } = await supabase
        .from('posts')
        .upsert(
          { author_id: user.id, headline: state.post_headline.trim(), post_body: state.post_body.trim(), seeking: state.intent_type },
          { onConflict: 'author_id' }
        )
        .select('id')
        .single()
      if (postErr) throw postErr
      if (!post) throw new Error('Post could not be created')

      const { error: delPT } = await supabase.from('profile_tags').delete().eq('profile_id', user.id)
      if (delPT) throw delPT

      if (state.tags.length > 0) {
        const { error: insPT } = await supabase.from('profile_tags').insert(
          state.tags.map(t => ({ profile_id: user.id, tag_name: t.name, tier: t.tier }))
        )
        if (insPT) throw insPT
      }

      const { error: delPostT } = await supabase.from('post_tags').delete().eq('post_id', post.id)
      if (delPostT) throw delPostT

      const publicTags = state.tags.filter(t => t.tier === 'public')
      if (publicTags.length > 0) {
        const { error: upsertTagsErr } = await supabase
          .from('tags')
          .upsert(publicTags.map(t => ({ name: t.name })), { onConflict: 'name' })
        if (upsertTagsErr) throw upsertTagsErr

        const { data: tagRows, error: tagRowsErr } = await supabase
          .from('tags')
          .select('id, name')
          .in('name', publicTags.map(t => t.name))
        if (tagRowsErr) throw tagRowsErr

        if (tagRows && tagRows.length > 0) {
          const { error: insPostT } = await supabase
            .from('post_tags')
            .insert(tagRows.map(tag => ({ post_id: post.id, tag_id: tag.id })))
          if (insPostT) throw insPostT
        }
      }

      router.push('/feed')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSaving(false)
    }
  }

  // ── Screen map ─────────────────────────────────────────────────────────────
  const screens: Record<number, React.ReactNode> = {
    1: <IntentScreen onNext={goNext} />,
    2: <BasicsScreen />,
    3: <LocationScreen />,
    4: <PreferencesScreen />,
    5: <FiltersScreen />,
    6: <TagsScreen />,
    7: <PostScreen />,
    8: <PreviewScreen />,
  }

  return (
    <main className="relative min-h-screen" style={{ background: '#1b1328' }}>
      <BackgroundGlow />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="w-full max-w-sm mx-auto px-6 pt-14 pb-32">
          <ProgressBar current={step} total={TOTAL} />
          <ScreenLabel step={step} />
          {screens[step]}

          {error && (
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] mt-6 text-center" style={{ color: '#f87171' }}>
              {error}
            </p>
          )}
        </div>

        <NavBar
          onBack={goBack}
          onNext={goNext}
          onSkip={goSkip}
          backVisible={step > 1}
          skipVisible={step === 5 || step === 6}
          nextDisabled={!canNext[step] || saving}
          nextLabel={saving ? 'saving...' : step === TOTAL ? 'publish my folio' : 'continue'}
        />
      </div>
    </main>
  )
}
