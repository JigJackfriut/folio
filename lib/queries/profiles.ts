import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

export async function getCurrentProfile(
  client: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data as Profile
}

export async function getProfileTags(
  client: SupabaseClient,
  profileId: string
): Promise<{ tag_name: string; tier: string }[]> {
  const { data, error } = await client
    .from('profile_tags')
    .select('tag_name, tier')
    .eq('profile_id', profileId)

  if (error) return []
  return data ?? []
}

export async function getEchoTags(
  client: SupabaseClient,
  profileId: string
): Promise<string[]> {
  const { data, error } = await client
    .from('profile_tags')
    .select('tag_name')
    .eq('profile_id', profileId)
    .eq('tier', 'echo')

  if (error) return []
  return (data ?? []).map(r => r.tag_name)
}
