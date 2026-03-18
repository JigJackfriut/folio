import { createClient } from '@/lib/supabase/client'

export async function resetOnboarding() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not logged in')

  // Reset profile back to blank slate
  const { error: profileErr } = await supabase
    .from('profiles')
    .update({
      onboarding_complete: false,
      display_name: null,
      age: null,
      gender_identity: [],
      match_base: 'location',
      location_raw: null,
      location_display: null,
      college_name: null,
      college_country: null,
      college_url: null,
      match_radius_miles: 25,
      open_to_distance: false,
      hide_exact_location: true,
      gender_preference: [],
      age_min: 22,
      age_max: 36,
      intent_type: null,
      filter_kids: 'open',
      filter_structure: 'open',
      filter_smoking: 'any',
      filter_alcohol: 'any',
      filter_religion: 'open',
    })
    .eq('id', user.id)

  if (profileErr) throw profileErr

  // Delete their post
  const { error: postErr } = await supabase
    .from('posts')
    .delete()
    .eq('author_id', user.id)

  if (postErr) throw postErr

  // Delete their tags
  const { error: tagsErr } = await supabase
    .from('profile_tags')
    .delete()
    .eq('profile_id', user.id)

  if (tagsErr) throw tagsErr

  return { ok: true }
}
