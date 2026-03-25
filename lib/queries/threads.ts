import type { SupabaseClient } from '@supabase/supabase-js'

function normalize(data: any) {
  if (!data) return data
  const flat = { ...data }
  if (Array.isArray(flat.post)) flat.post = flat.post[0] ?? null
  if (Array.isArray(flat.initiator)) flat.initiator = flat.initiator[0] ?? null
  if (Array.isArray(flat.recipient)) flat.recipient = flat.recipient[0] ?? null
  return flat
}

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
      initiator_read_at,
      recipient_read_at,
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
  if (!data) return []

  const threads = data.map(normalize)

  // Fetch all initiator posts in one query instead of N+1
  const initiatorIds = [...new Set(threads.map((t: any) => t.initiator_id))]
  const { data: initiatorPosts } = await client
    .from('posts')
    .select('id, headline, post_body, tag_names, author_id')
    .in('author_id', initiatorIds)
    .eq('status', 'active')

  const postsByAuthor = Object.fromEntries(
    (initiatorPosts ?? []).map(p => [p.author_id, p])
  )

  return threads.map((thread: any) => ({
    ...thread,
    initiator_post: postsByAuthor[thread.initiator_id] ?? null,
  }))
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
      initiator_read_at,
      recipient_read_at,
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
  return normalize(data)
}
