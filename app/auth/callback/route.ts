import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error && data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('id', data.user.id)
        .single()
      if (!profile?.onboarding_complete) {
        return NextResponse.redirect(new URL('/onboarding', origin))
      }
      return NextResponse.redirect(new URL('/feed', origin))
    }
  }
  return NextResponse.redirect(new URL('/login', origin))
}
