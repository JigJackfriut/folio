import type { SupabaseClient } from '@supabase/supabase-js'

export async function updateCrossedTags(
  client: SupabaseClient,
  userId: string,
  crossedTags: string[]
): Promise<void> {
  const { error } = await client
    .from('profiles')
    .update({ crossed_tags: crossedTags })
    .eq('id', userId)

  if (error) throw error
}

export async function updateHibernation(
  client: SupabaseClient,
  userId: string,
  hibernating: boolean
): Promise<void> {
  const { error } = await client
    .from('profiles')
    .update({ hibernating_at: hibernating ? new Date().toISOString() : null })
    .eq('id', userId)

  if (error) throw error
}
