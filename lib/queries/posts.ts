import type { SupabaseClient } from '@supabase/supabase-js'
import type { PostWithSignal } from '@/lib/types'

export async function getFeedPosts(
  client: SupabaseClient,
  userId: string,
  limit = 50,
  offset = 0,
  includedTags: string[] = [],
  crossedTags: string[] = []
): Promise<PostWithSignal[]> {
  const { data, error } = await client.rpc('get_folio_feed', {
    p_user_id: userId,
    p_limit: limit,
    p_offset: offset,
    p_included_tags: includedTags,
    p_crossed_tags: crossedTags,
  })

  if (error) throw error
  if (!data) return []

  return (data as any[]).map(row => ({
    id: row.id,
    author_id: row.author_id,
    headline: row.headline,
    post_body: row.post_body,
    tag_names: row.tag_names ?? [],
    seeking: row.seeking,
    status: 'active' as const,
    created_at: row.created_at,
    embedding: null,
    author: {
      id: row.author_id,
      handle: row.author_handle,
      display_name: row.author_display_name,
      age: row.author_age,
      location_display: row.author_location,
      intent_type: row.author_intent,
      connection_pref: row.author_connection_pref,
    },
    signal: row.signal,
    signal_reason: row.signal_reason,
    matched_tags: row.matched_public_tags ?? [],
    echo_count: row.echo_count,
  })) as PostWithSignal[]
}

export async function getPostById(client: SupabaseClient, postId: string) {
  const { data, error } = await client
    .from('posts')
    .select(`
      id, author_id, headline, post_body, tag_names, seeking, created_at, status,
      author:profiles!posts_author_id_fkey (
        id, handle, display_name, age, location_display, intent_type, connection_pref
      )
    `)
    .eq('id', postId)
    .eq('status', 'active')
    .single()

  if (error) return null
  const author = Array.isArray(data.author) ? data.author[0] : data.author
  return { ...data, author }
}

export async function getPostByAuthor(client: SupabaseClient, authorId: string) {
  const { data, error } = await client
    .from('posts')
    .select('id, author_id, headline, post_body, tag_names, seeking, created_at, status')
    .eq('author_id', authorId)
    .eq('status', 'active')
    .single()

  if (error) return null
  return data
}
