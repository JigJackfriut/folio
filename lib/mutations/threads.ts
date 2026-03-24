import type { SupabaseClient } from '@supabase/supabase-js'

export async function acceptThread(
  client: SupabaseClient,
  threadId: string
): Promise<void> {
  const { error } = await client
    .from('threads')
    .update({ status: 'open' })
    .eq('id', threadId)

  if (error) throw error
}

export async function declineThread(
  client: SupabaseClient,
  threadId: string
): Promise<void> {
  const { error } = await client
    .from('threads')
    .update({ status: 'declined' })
    .eq('id', threadId)

  if (error) throw error
}

export async function sendMessage(
  client: SupabaseClient,
  threadId: string,
  senderId: string,
  content: string
): Promise<void> {
  const { error } = await client
    .from('messages')
    .insert({ thread_id: threadId, sender_id: senderId, content })

  if (error) throw error
}

export async function revealEcho(
  client: SupabaseClient,
  threadId: string
): Promise<void> {
  const { error } = await client
    .from('threads')
    .update({ echo_revealed: true })
    .eq('id', threadId)

  if (error) throw error
}
