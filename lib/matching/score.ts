import type { PostWithAuthor, SignalResult, PostWithSignal } from '@/lib/types'

interface UserMatchContext {
  userId: string
  intentType: string
  connectionPref: string
  publicTags: string[]
  echoTags: string[]
}

function getTagOverlap(userTags: string[], postTags: string[]): string[] {
  const postTagSet = new Set(postTags.map(t => t.toLowerCase()))
  return userTags.filter(t => postTagSet.has(t.toLowerCase()))
}

function scorePost(
  post: PostWithAuthor,
  ctx: UserMatchContext
): { score: number; matchedTags: string[] } {
  const postTags = post.tag_names ?? []
  const matchedTags = getTagOverlap(ctx.publicTags, postTags)

  let score = 0

  // Tag overlap — most important signal for now
  score += matchedTags.length * 3

  // Shared intent type
  if (post.author.intent_type === ctx.intentType) score += 4

  // Compatible connection preference
  const cp = post.author.connection_pref
  if (cp === ctx.connectionPref) score += 3
  else if (cp === 'both' || ctx.connectionPref === 'both') score += 1

  // Recency boost — posts from last 24h get a bump
  const hoursOld =
    (Date.now() - new Date(post.created_at).getTime()) / 1000 / 3600
  if (hoursOld < 24) score += 2
  else if (hoursOld < 72) score += 1

  return { score, matchedTags }
}

export function determineSignal(
  post: PostWithAuthor,
  ctx: UserMatchContext,
  score: number,
  matchedTags: string[]
): SignalResult {
  // Check if echo overlap is possible (we don't know their echo tags
  // from the feed query — this is a probabilistic signal)
  // A post gets 'echo' signal if it has low public tag overlap
  // but was written recently and has matching intent
  const hasStrongTagMatch = matchedTags.length >= 2
  const hasIntentMatch = post.author.intent_type === ctx.intentType

  if (hasStrongTagMatch) {
    const reasonTags = matchedTags.slice(0, 3).join(', ')
    return {
      signal: 'close',
      reason: `close match · ${reasonTags}`,
      matched_tags: matchedTags,
    }
  }

  if (hasIntentMatch && matchedTags.length === 1) {
    return {
      signal: 'echo',
      reason: 'possible echo',
      matched_tags: matchedTags,
    }
  }

  return {
    signal: 'unexpected',
    reason: '~ different frequency',
    matched_tags: [],
  }
}

export function rankAndSignalPosts(
  posts: PostWithAuthor[],
  ctx: UserMatchContext
): PostWithSignal[] {
  const scored = posts.map(post => {
    const { score, matchedTags } = scorePost(post, ctx)
    const signal = determineSignal(post, ctx, score, matchedTags)
    return {
      ...post,
      signal: signal.signal,
      signal_reason: signal.reason,
      matched_tags: signal.matched_tags,
      _score: score,
    }
  })

  // Sort by score descending, then by recency
  scored.sort((a, b) => {
    if (b._score !== a._score) return b._score - a._score
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  // Remove internal score field
  return scored.map(({ _score, ...post }) => post as PostWithSignal)
}
