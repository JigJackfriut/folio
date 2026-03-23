import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This fetches the JWT, which contains user_metadata
  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isPublicRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/dev')

  const isOnboardingRoute = pathname.startsWith('/onboarding')

  // 1. Not logged in + trying to access private route -> Send to Login
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (user) {
    // Check our fast JWT metadata instead of hitting the database
    const isOnboarded = user.user_metadata?.onboarding_complete === true

    // 2. Logged in + not onboarded + trying to access app -> Send to Onboarding
    if (!isOnboarded && !isPublicRoute && !isOnboardingRoute) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // 3. Logged in + onboarded + trying to access Auth routes -> Send to Feed
    if (isOnboarded && isPublicRoute) {
      return NextResponse.redirect(new URL('/feed', request.url))
    }
    
    // 4. Logged in + onboarded + trying to access Onboarding -> Send to Feed
    if (isOnboarded && isOnboardingRoute) {
        return NextResponse.redirect(new URL('/feed', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
