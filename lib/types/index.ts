export interface Profile {
  id: string
  handle: string
  email: string
  display_name: string
  age: number
  location_display: string
  location_raw: string
  match_base: 'location' | 'college'
  college_name: string
  connection_pref: 'in-person' | 'both' | 'online'
  intent_type: string
  gender_identity: string[]
  gender_preference: string[]
  age_min: number
  age_max: number
  open_to_distance: boolean
  crossed_tags: string[]
  onboarding_complete: boolean
  hibernating_at: string | null
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  headline: string
  post_body: string
  tag_names: string[]
  seeking: string
  embedding: number[] | null
  created_at: string
}

export interface PostWithAuthor extends Post {
  author: Pick<Profile, 'id' | 'handle' | 'display_name' | 'age' | 'location_display' | 'intent_type'>
}

export interface PostWithSignal extends PostWithAuthor {
  signal: 'close' | 'echo' | 'unexpected'
  signal_reason: string
  matched_tags: string[]
}

export interface Thread {
  id: string
  post_id: string
  initiator_id: string
  recipient_id: string
  status: 'pending' | 'open' | 'declined'
  echo_tags: string[] | null
  echo_revealed: boolean
  created_at: string
}

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  content: string
  created_at: string
}

export interface ReplyRequest {
  thread: Thread
  preview: string
}
