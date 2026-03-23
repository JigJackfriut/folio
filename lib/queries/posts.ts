import type { SupabaseClient } from '@supabase/supabase-js'
import type { PostWithAuthor } from '@/lib/types'

export async function getPostsForFeed(
  client: SupabaseClient,
  userId: string,
  crossedTags: string[] = [],
  limit = 50
): Promise<PostWithAuthor[]> {
  const { data, error } = await client
    .from('posts')
    .select(`
      id,
      author_id,
      headline,
      post_body,
      tag_names,
      seeking,
      created_at,
      author:profiles!posts_author_id_fkey (
        id,
        handle,
        display_name,
        age,
        location_display,
        intent_type,
        connection_pref
      )
    `)
    .neq('author_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  if (!data) return []

  const posts = data as unknown as PostWithAuthor[]

  if (crossedTags.length === 0) return posts

  return posts.filter(post => {
    const tags = post.tag_names ?? []
    return !tags.some(tag => crossedTags.includes(tag))
  })
}

export async function getPostById(
  client: SupabaseClient,
  postId: string
): Promise<PostWithAuthor | null> {
  const { data, error } = await client
    .from('posts')
    .select(`
      id,
      author_id,
      headline,
      post_body,
      tag_names,
      seeking,
      created_at,
      author:profiles!posts_author_id_fkey (
        id,
        handle,
        display_name,
        age,
        location_display,
        intent_type,
        connection_pref
      )
    `)
    .eq('id', postId)
    .single()

  if (error) return null
  return data as unknown as PostWithAuthor
}

export async function getPostByAuthor(
  client: SupabaseClient,
  authorId: string
): Promise<PostWithAuthor | null> {
  const { data, error } = await client
    .from('posts')
    .select(`
      id,
      author_id,
      headline,
      post_body,
      tag_names,
      seeking,
      created_at,
      author:profiles!posts_author_id_fkey (
        id,
        handle,
        display_name,
        age,
        location_display,
        intent_type,
        connection_pref
      )
    `)
    .eq('author_id', authorId)
    .single()

  if (error) return null
  return data as unknown as PostWithAuthor
}
