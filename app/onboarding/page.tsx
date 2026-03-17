'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useOnboarding } from '@/lib/onboarding-store'
import { BackgroundGlow } from '@/components/ui/background-glow'
import {
  ProgressDots,
  ScreenWrapper,
  ScreenLabel,
  Heading,
  Sub,
  OptionCard,
  Field,
  Chip,
  Toggle,
  FilterRow,
  NavBar,
} from '@/components/onboarding/ui'
import { TagPicker } from '@/components/onboarding/tag-picker'

const TOTAL = 8

type ScreenProps = { onNext?: () => void }

const EXAMPLES = [
  {
    headline: 'looking for someone to discuss obscure films with at 2am',
    body: "I don't have a five-year plan but I have strong opinions about which Kubrick film is underrated. I'm better in person than on paper, but I'm giving paper a shot. Tell me something real about yourself and we'll see where it goes.",
  },
  {
    headline:
      'looking for someone who makes ordinary Tuesdays feel like something worth showing up for',
    body: "I'm the kind of person who overanalyses films, remembers the exact words people use, and gets deeply attached to fictional characters. I'm told I'm a lot — in the best way, usually. Looking for someone who's easy to talk to and hard to forget.",
  },
  {
    headline: 'looking for my person, or at least a good conversation',
    body: "I'm usually either lost in a book or getting too invested in a game. Looking for someone with good banter, actual opinions, and the confidence to text first. I give a lot when I like someone — looking for the same.",
  },
]

function S1({ onNext }: ScreenProps) {
  const { state, set } = useOnboarding()

  const intents = [
    {
      value: 'something_real',
      title: 'Something real',
      desc: 'Long-term, committed — the whole thing',
    },
    {
      value: 'casual',
      title: 'Something casual',
      desc: 'No pressure, just see where it goes',
    },
    {
      value: 'friends_first',
      title: 'Friends first',
      desc: 'Build a real connection before anything else',
    },
    {
      value: 'companion',
      title: 'A companion',
      desc: 'Someone to share life with — dates, trips, the everyday stuff',
    },
    {
      value: 'no_idea',
      title: 'Honestly? No idea',
      desc: 'Just here to see what happens',
    },
  ]

  return (
    <ScreenWrapper>
      <ScreenLabel>01 / 08 — intent</ScreenLabel>
      <Heading>so, what do you actually want?</Heading>
      <Sub>be honest with yourself</Sub>

      {intents.map((i) => (
        <OptionCard
          key={i.value}
          title={i.title}
          description={i.desc}
          selected={state.intent_type === i.value}
          onClick={() => {
            set({ intent_type: i.value })
            setTimeout(() => onNext?.(), 160)
          }}
        />
      ))}
    </ScreenWrapper>
  )
}

function S2(_: ScreenProps) {
  const { state, set } = useOnboarding()
  const genders = [
    'Man',
    'Woman',
    'Non-binary',
    'Trans man',
    'Trans woman',
    'Genderfluid',
    'Agender',
    'Intersex',
    'Prefer not to say',
  ]

  const toggle = (g: string) => {
    const cur = state.gender_identity
    set({
      gender_identity: cur.includes(g)
        ? cur.filter((x) => x !== g)
        : [...cur, g],
    })
  }

  return (
    <ScreenWrapper>
      <ScreenLabel>02 / 08 — about you</ScreenLabel>
      <Heading>a little about yourself</Heading>
      <Sub>just the basics — you&apos;ll tell your story later</Sub>

      <Field
        label="your name"
        placeholder="First name or nickname"
        value={state.display_name}
        onChange={(e) => set({ display_name: e.target.value })}
        maxLength={40}
        hint="shown on your folio"
      />

      <Field
        label="your age"
        placeholder="e.g. 27"
        type="number"
        min={18}
        max={99}
        value={state.age}
        onChange={(e) => set({ age: e.target.value })}
        hint="must be 18 or over"
      />

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a6b9a] mb-3">
        how you identify
      </p>

      <div className="grid grid-cols-3 gap-2">
        {genders.map((g) => (
          <Chip
            key={g}
            label={g}
            selected={state.gender_identity.includes(g)}
            onClick={() => toggle(g)}
            size="sm"
          />
        ))}
      </div>
    </ScreenWrapper>
  )
}

function S3(_: ScreenProps) {
  const { state, set } = useOnboarding()

  return (
    <ScreenWrapper>
      <ScreenLabel>03 / 08 — your world</ScreenLabel>
      <Heading>where are you?</Heading>
      <Sub>used for matching — never shown unless you choose to</Sub>

      <Field
        label="location"
        placeholder="City or neighbourhood"
        value={state.location_raw}
        onChange={(e) => set({ location_raw: e.target.value })}
        hint="e.g. Brooklyn, NY  ·  Melbourne  ·  East London"
      />

      <div className="mt-2 border-t border-[#2a1f42]">
        <Toggle
          label="Open to long-distance"
          hint="Match with people outside your area too"
          checked={state.open_to_distance}
          onChange={(v) => set({ open_to_distance: v })}
        />
        <Toggle
          label="Show neighbourhood only"
          hint="Hide your exact city from your public profile"
          checked={state.hide_exact_location}
          onChange={(v) => set({ hide_exact_location: v })}
        />
      </div>
    </ScreenWrapper>
  )
}

function S4(_: ScreenProps) {
  const { state, set } = useOnboarding()
  const genders = [
    'Women',
    'Men',
    'Non-binary',
    'Everyone',
    'Trans women',
    'Trans men',
  ]

  const toggleG = (g: string) => {
    if (g === 'Everyone') {
      set({ gender_preference: ['Everyone'] })
      return
    }

    const without = state.gender_preference.filter((x) => x !== 'Everyone')
    set({
      gender_preference: without.includes(g)
        ? without.filter((x) => x !== g)
        : [...without, g],
    })
  }

  return (
    <ScreenWrapper>
      <ScreenLabel>04 / 08 — who you&apos;re open to</ScreenLabel>
      <Heading>who do you want to meet?</Heading>
      <Sub>select all that apply</Sub>

      <div className="grid grid-cols-3 gap-2 mb-7">
        {genders.map((g) => (
          <Chip
            key={g}
            label={g}
            selected={state.gender_preference.includes(g)}
            onClick={() => toggleG(g)}
            size="sm"
          />
        ))}
      </div>

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a6b9a] mb-4">
        age range
      </p>

      <div className="space-y-3">
        {(['age_min', 'age_max'] as const).map((key) => (
          <div key={key} className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#7a6b9a] w-8">
              {key === 'age_min' ? 'from' : 'to'}
            </span>
            <input
              type="range"
              min={18}
              max={80}
              value={state[key]}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10)
                if (key === 'age_min' && v > state.age_max) return
                if (key === 'age_max' && v < state.age_min) return
                set({ [key]: v })
              }}
              className="flex-1 accent-[#6d4bc3]"
            />
            <span className="font-mono text-[14px] text-[#f5efff] w-7 text-right">
              {state[key]}
            </span>
          </div>
        ))}
      </div>

      <p className="font-mono text-[10px] text-[#4a3b68] mt-3">
        soft limits — people just outside this range may still appear
      </p>
    </ScreenWrapper>
  )
}

function S5(_: ScreenProps) {
  const { state, set } = useOnboarding()

  const rows = [
    {
      key: 'filter_kids' as const,
      q: 'Kids',
      opts: [
        { label: 'Want them', value: 'want' },
        { label: 'Have them', value: 'have' },
        { label: "Don't want them", value: 'dont_want' },
        { label: 'Open either way', value: 'open' },
      ],
    },
    {
      key: 'filter_structure' as const,
      q: 'Relationship structure',
      opts: [
        { label: 'Monogamous only', value: 'mono' },
        { label: 'ENM / poly / open', value: 'enm' },
        { label: 'Open to either', value: 'open' },
      ],
    },
    {
      key: 'filter_smoking' as const,
      q: 'Smoking',
      opts: [
        { label: 'Non-smoker', value: 'no' },
        { label: 'Smoker', value: 'yes' },
        { label: 'No preference', value: 'any' },
      ],
    },
    {
      key: 'filter_alcohol' as const,
      q: 'Alcohol',
      opts: [
        { label: "Don't drink", value: 'no' },
        { label: 'Social drinker', value: 'social' },
        { label: 'No preference', value: 'any' },
      ],
    },
    {
      key: 'filter_religion' as const,
      q: 'Faith / religion',
      opts: [
        { label: 'Same faith matters', value: 'same' },
        { label: 'Not important to me', value: 'not_important' },
        { label: 'Open', value: 'open' },
      ],
    },
  ]

  return (
    <ScreenWrapper>
      <ScreenLabel>05 / 08 — invisible filters</ScreenLabel>
      <Heading>a few things that actually matter</Heading>
      <Sub>
        never shown on your profile — quietly removes bad fits before they
        reach you
      </Sub>

      <div className="border-t border-[#2a1f42]">
        {rows.map((row) => (
          <FilterRow
            key={row.key}
            question={row.q}
            options={row.opts}
            value={state[row.key]}
            onChange={(v) => set({ [row.key]: v })}
          />
        ))}
      </div>
    </ScreenWrapper>
  )
}

function S6(_: ScreenProps) {
  const { state, set } = useOnboarding()

  return (
    <ScreenWrapper>
      <ScreenLabel>06 / 08 — your communities</ScreenLabel>
      <Heading>what&apos;s actually you?</Heading>
      <Sub>
        tap once = public · twice = match-only · three times = filter · four =
        off
      </Sub>
      <TagPicker value={state.tags} onChange={(tags) => set({ tags })} />
    </ScreenWrapper>
  )
}

function S7(_: ScreenProps) {
  const { state, set } = useOnboarding()

  return (
    <ScreenWrapper>
      <ScreenLabel>07 / 08 — your folio post</ScreenLabel>
      <Heading>now, write your post</Heading>
      <Sub>a headline and whatever you want to say — write like a person</Sub>

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a6b9a] mb-1.5">
        headline
      </p>
      <input
        type="text"
        value={state.post_headline}
        onChange={(e) => set({ post_headline: e.target.value })}
        maxLength={120}
        placeholder="e.g. looking for someone to discuss obscure films with at 2am"
        className="w-full bg-transparent border-b border-[#3a2b58] pb-2.5 text-[17px] font-serif text-[#f5efff] outline-none placeholder:text-[#4a3b68] focus:border-[#9b85e8] transition-colors leading-snug"
      />
      <p className="font-mono text-[10px] text-[#4a3b68] text-right mb-5">
        {state.post_headline.length} / 120
      </p>

      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[#7a6b9a] mb-1.5">
        your post
      </p>
      <textarea
        value={state.post_body}
        onChange={(e) => set({ post_body: e.target.value })}
        maxLength={2000}
        rows={5}
        placeholder="Tell them about yourself. What makes you, you? Who are you looking for? No rules."
        className="w-full bg-transparent border-b border-[#3a2b58] pb-2.5 text-[14px] text-[#d4c8f0] leading-relaxed outline-none placeholder:text-[#4a3b68] focus:border-[#9b85e8] transition-colors resize-none"
      />
      <p className="font-mono text-[10px] text-[#4a3b68] text-right mb-5">
        {state.post_body.length} / 2000
      </p>

      <div className="bg-[#1e1530]/60 border border-[#2a1f42] rounded-xl p-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-[#4a3b68] mb-2">
          need a nudge?
        </p>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            type="button"
            onClick={() =>
              set({ post_headline: ex.headline, post_body: ex.body })
            }
            className="block w-full text-left text-[12px] text-[#7a6b9a] hover:text-[#a99abb] py-1.5 border-b border-[#2a1f42] last:border-0 transition-colors leading-snug"
          >
            → {ex.headline}
          </button>
        ))}
      </div>
    </ScreenWrapper>
  )
}

function S8(_: ScreenProps) {
  const { state } = useOnboarding()

  const publicTags = state.tags.filter((t) => t.tier === 'public').slice(0, 4)
  const sharedCount = state.tags.filter((t) => t.tier === 'shared').length
  const location = state.location_raw
    ? state.hide_exact_location
      ? state.location_raw.split(',')[0]?.trim() ?? state.location_raw
      : state.location_raw
    : 'Location'

  return (
    <ScreenWrapper>
      <ScreenLabel>08 / 08 — your folio</ScreenLabel>
      <Heading>here&apos;s how you&apos;ll appear</Heading>
      <Sub>edit anytime from your profile</Sub>

      <div className="rounded-2xl border border-[#3a2b58] bg-[#1e1530]/60 p-5 mb-4">
        <p className="font-mono text-[11px] text-[#4a3b68] mb-2">
          {state.age || '—'} · {location}
          {state.open_to_distance ? ' · open to online' : ''}
        </p>

        <h2 className="font-serif text-[19px] text-[#f5efff] leading-snug mb-3">
          {state.post_headline || 'your headline will appear here'}
        </h2>

        <p className="text-[13px] text-[#a99abb] leading-relaxed mb-4">
          {state.post_body
            ? state.post_body.slice(0, 220) +
              (state.post_body.length > 220 ? '…' : '')
            : 'your post will appear here'}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {publicTags.map(({ name }) => (
            <span
              key={name}
              className="px-2.5 py-1 rounded-full text-[11px] border border-[#3a2b58] bg-[#2a1f42] text-[#a99abb]"
            >
              {name}
            </span>
          ))}

          {sharedCount > 0 && (
            <span className="px-2.5 py-1 rounded-full text-[11px] border border-[#7F77DD] bg-[#EEEDFE]/10 text-[#c3b3ff] italic">
              + {sharedCount} thing{sharedCount > 1 ? 's' : ''} in common you
              haven&apos;t shared yet
            </span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-[#2a1f42] bg-[#1e1530]/40 p-4 text-[12px] text-[#7a6b9a] leading-relaxed space-y-1.5">
        <p>
          <span className="text-[#a99abb]">Grey tags</span> are visible to
          everyone.
        </p>
        <p>
          <span className="text-[#c3b3ff]">Purple tags</span> only surface when a
          match shares them — they&apos;ll see &quot;you have something in
          common&quot;, nothing more.
        </p>
        <p>
          <span className="text-[#5DCAA5]">Green filter tags</span> are invisible
          to everyone — they quietly remove bad fits from your feed.
        </p>
      </div>
    </ScreenWrapper>
  )
}

const SCREENS: React.ComponentType<ScreenProps>[] = [
  S1,
  S2,
  S3,
  S4,
  S5,
  S6,
  S7,
  S8,
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const { state } = useOnboarding()
  const router = useRouter()
  const supabase = createClient()

  const canNext: Record<number, boolean> = {
    1: !!state.intent_type,
    2:
      !!state.display_name.trim() &&
      !!state.age &&
      parseInt(state.age, 10) >= 18 &&
      state.gender_identity.length > 0,
    3: !!state.location_raw.trim(),
    4: state.gender_preference.length > 0,
    5: true,
    6: true,
    7:
      !!state.post_headline.trim() &&
      state.post_headline.trim().length <= 120 &&
      state.post_body.trim().length <= 2000,
    8: true,
  }

  const goNext = () => {
    if (step < TOTAL) setStep((s) => s + 1)
    else void publish()
  }

  const goBack = () => setStep((s) => Math.max(1, s - 1))
  const goSkip = () => setStep((s) => Math.min(TOTAL, s + 1))

  const publish = async () => {
    setSaving(true)
    setError('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const locationDisplay = state.hide_exact_location
        ? state.location_raw.split(',')[0]?.trim() ?? state.location_raw.trim()
        : state.location_raw.trim()

      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: user.id,
        display_name: state.display_name.trim(),
        age: parseInt(state.age, 10),
        gender_identity: state.gender_identity,
        location_raw: state.location_raw.trim(),
        location_display: locationDisplay,
        open_to_distance: state.open_to_distance,
        hide_exact_location: state.hide_exact_location,
        gender_preference: state.gender_preference,
        age_min: state.age_min,
        age_max: state.age_max,
        intent_type: state.intent_type,
        filter_kids: state.filter_kids,
        filter_structure: state.filter_structure,
        filter_smoking: state.filter_smoking,
        filter_alcohol: state.filter_alcohol,
        filter_religion: state.filter_religion,
        onboarding_complete: true,
      })

      if (profileErr) throw profileErr

      const { data: post, error: postErr } = await supabase
        .from('posts')
        .upsert(
          {
            author_id: user.id,
            headline: state.post_headline.trim(),
            post_body: state.post_body.trim(),
            seeking: state.intent_type,
          },
          { onConflict: 'author_id' }
        )
        .select('id')
        .single()

      if (postErr) throw postErr
      if (!post) throw new Error('Post could not be created')

      const { error: deleteProfileTagsErr } = await supabase
        .from('profile_tags')
        .delete()
        .eq('profile_id', user.id)

      if (deleteProfileTagsErr) throw deleteProfileTagsErr

      if (state.tags.length > 0) {
        const profileTagRows = state.tags.map((t) => ({
          profile_id: user.id,
          tag_name: t.name,
          tier: t.tier,
        }))

        const { error: insertProfileTagsErr } = await supabase
          .from('profile_tags')
          .insert(profileTagRows)

        if (insertProfileTagsErr) throw insertProfileTagsErr
      }

      const { error: deletePostTagsErr } = await supabase
        .from('post_tags')
        .delete()
        .eq('post_id', post.id)

      if (deletePostTagsErr) throw deletePostTagsErr

      const publicTags = state.tags.filter((t) => t.tier === 'public')

      if (publicTags.length > 0) {
        const { error: upsertTagsErr } = await supabase
          .from('tags')
          .upsert(
            publicTags.map((t) => ({ name: t.name })),
            { onConflict: 'name' }
          )

        if (upsertTagsErr) throw upsertTagsErr

        const { data: tagRows, error: tagRowsErr } = await supabase
          .from('tags')
          .select('id, name')
          .in(
            'name',
            publicTags.map((t) => t.name)
          )

        if (tagRowsErr) throw tagRowsErr

        const postTagRows = tagRows.map((tag) => ({
          post_id: post.id,
          tag_id: tag.id,
        }))

        if (postTagRows.length > 0) {
          const { error: insertPostTagsErr } = await supabase
            .from('post_tags')
            .insert(postTagRows)

          if (insertPostTagsErr) throw insertPostTagsErr
        }
      }

      router.push('/feed')
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Something went wrong'
      setError(message)
      setSaving(false)
    }
  }

  const Screen = SCREENS[step - 1]

  return (
    <main className="relative min-h-screen bg-[#1b1328] selection:bg-[#8f73e655]">
      <BackgroundGlow />

      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="w-full max-w-sm mx-auto px-6 pt-16 pb-32">
          <ProgressDots current={step} total={TOTAL} />
          <Screen onNext={goNext} />

          {error && (
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-rose-400 mt-6 text-center">
              {error}
            </p>
          )}
        </div>

        <NavBar
          onBack={goBack}
          onNext={goNext}
          onSkip={goSkip}
          backVisible={step > 1}
          skipVisible={step === 5 || step === 6}
          nextDisabled={!canNext[step] || saving}
          nextLabel={
            saving ? 'saving...' : step === TOTAL ? 'publish my folio →' : 'continue'
          }
        />
      </div>
    </main>
  )
}
