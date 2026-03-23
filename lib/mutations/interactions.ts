import type { SupabaseClient } from '@supabase/supabase-js'
import type { InteractionType } from '@/lib/types'

export async function logInteraction(
  client: SupabaseClient,
  userId: string,
  postId: string,
  type: InteractionType
): Promise<void> {
  client
    .from('post_interactions')
    .insert({ user_id: userId, post_id: postId, type })
    .then(({ error }) => {
      if (error) console.warn('interaction log failed', error.message)
    })
}
