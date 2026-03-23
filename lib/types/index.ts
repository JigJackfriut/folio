// ── Profile ───────────────────────────────────────────────────────────────────

export interface Profile {
  id: string
  handle: string
  email: string
  display_name: string
  age: number
  location_display: string
  location_raw: string
  location_place_id: string
  match_base: 'location' | 'college'
  college_name: string
  college_country: string
  connection_pref: 'in-person' | 'both' | 'online'
  intent_type: string
  gender_identity: string[]
  gender_preference: string[]
  age_min: number
  age_max: number
  open_to_distance: boolean
  open_to_online: boolean
  crossed_tags: string[]
  onboarding_complete: boolean
  hibernating_at: string | null
  created_at: string
}

// ── Post ──────────────────────────────────────────────────────────────────────

export interface Post {
  id: string
  author_id: string
  headline: string
  post_body: string
  tag_names: string[]
  seeking: string
  status: 'active' | 'archived'
  embedding: number[] | null
  created_at: string
}

export interface PostAuthor {
  id: string
  handle: string
  display_name: string
  age: number
  location_display: string
  intent_type: string
  connection_pref: 'in-person' | 'both' | 'online'
}

export interface PostWithAuthor extends Post {
  author: PostAuthor
}

export type SignalType = 'close' | 'echo' | 'unexpected'

export interface PostWithSignal extends PostWithAuthor {
  signal: SignalType
  signal_reason: string
  matched_tags: string[]
  echo_count: number
}

// ── Tags ──────────────────────────────────────────────────────────────────────

export type TagTier = 'public' | 'echo'

export interface ProfileTag {
  profile_id: string
  tag_name: string
  tier: TagTier
}

// ── Threads ───────────────────────────────────────────────────────────────────

export type ThreadStatus = 'pending' | 'open' | 'declined'

export interface Thread {
  id: string
  post_id: string
  initiator_id: string
  recipient_id: string
  status: ThreadStatus
  echo_tags: string[] | null
  echo_revealed: boolean
  created_at: string
}

export interface ThreadWithParticipants extends Thread {
  initiator: Pick<Profile, 'id' | 'handle' | 'display_name'>
  recipient: Pick<Profile, 'id' | 'handle' | 'display_name'>
  post: Pick<Post, 'id' | 'headline'>
}

// ── Messages ──────────────────────────────────────────────────────────────────

export interface Message {
  id: string
  thread_id: string
  sender_id: string
  content: string
  created_at: string
}

// ── Inbox ─────────────────────────────────────────────────────────────────────

export interface ReplyRequest {
  thread: ThreadWithParticipants
  preview_message: string
}

export interface OpenThread {
  thread: ThreadWithParticipants
  last_message: Message | null
  unread: boolean
}

// ── Matching ──────────────────────────────────────────────────────────────────

export interface SignalResult {
  signal: SignalType
  reason: string
  matched_tags: string[]
}

// ── Feed ──────────────────────────────────────────────────────────────────────

export interface FeedFilters {
  crossed_tags: string[]
}

export interface FeedState {
  posts: PostWithSignal[]
  loading: boolean
  error: string | null
  filters: FeedFilters
}

// ── Interactions ──────────────────────────────────────────────────────────────

export type InteractionType = 'view' | 'reply' | 'open_thread'

export interface PostInteraction {
  id: string
  user_id: string
  post_id: string
  type: InteractionType
  created_at: string
}
