import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login', origin))
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error || !data.user) {
    return NextResponse.redirect(new URL('/login', origin))
  }

  const isOnboarded =
    data.user.user_metadata?.onboarding_complete === true

  if (!isOnboarded) {
    return NextResponse.redirect(new URL('/onboarding', origin))
  }

  return NextResponse.redirect(new URL('/feed', origin))
}
