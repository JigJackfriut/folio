import type { SupabaseClient } from '@supabase/supabase-js'

export async function getInboxData(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('threads')
    .select(`
      id,
      post_id,
      initiator_id,
      recipient_id,
      status,
      echo_tags,
      echo_revealed,
      created_at,
      messages (
        id,
        content,
        sender_id,
        created_at
      ),
      post:posts!threads_post_id_fkey (
        id,
        headline,
        post_body,
        tag_names,
        author_id
      ),
      initiator:profiles!threads_initiator_id_fkey (
        id,
        handle,
        display_name
      ),
      recipient:profiles!threads_recipient_id_fkey (
        id,
        handle,
        display_name
      )
    `)
    .or(`initiator_id.eq.${userId},recipient_id.eq.${userId}`)
    .neq('status', 'declined')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getThreadById(client: SupabaseClient, threadId: string) {
  const { data, error } = await client
    .from('threads')
    .select(`
      id,
      post_id,
      initiator_id,
      recipient_id,
      status,
      echo_tags,
      echo_revealed,
      created_at,
      messages (
        id,
        content,
        sender_id,
        created_at
      ),
      post:posts!threads_post_id_fkey (
        id,
        headline,
        post_body,
        tag_names,
        author_id
      ),
      initiator:profiles!threads_initiator_id_fkey (
        id,
        handle,
        display_name
      ),
      recipient:profiles!threads_recipient_id_fkey (
        id,
        handle,
        display_name
      )
    `)
    .eq('id', threadId)
    .single()

  if (error) return null
  return data
}
