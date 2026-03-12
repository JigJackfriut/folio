'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' 
| 'taken' | 'available'>('idle')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  const checkUsername = async (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9._]/g, '')
    setUsername(cleaned)

    if (cleaned.length < 3) {
      setUsernameStatus('idle')
      return
    }

    setUsernameStatus('checking')

    const { data } = await supabase
      .from('profiles')
      .select('handle')
      .eq('handle', cleaned)
      .maybeSingle()

    setUsernameStatus(data ? 'taken' : 'available')
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    if (mode === 'signup') {
      if (usernameStatus !== 'available') {
        setError('Please choose an available username.')
        setLoading(false)
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ handle: username })
          .eq('id', data.user.id)

        if (profileError) {
          setError(profileError.message)
          setLoading(false)
          return
        }
      }

      setLoading(false)
      router.push('/onboarding')
      return
    }

    let loginEmail = identifier.trim().toLowerCase()

    if (!loginEmail.includes('@')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('handle', loginEmail.replace(/[^a-z0-9._]/g, ''))
        .maybeSingle()

      if (!profile?.email) {
        setError('No account found with that username.')
        setLoading(false)
        return
      }

      loginEmail = profile.email
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password
    })

    if (loginError) {
      setError('Invalid email or password.')
      setLoading(false)
      return
    }

    setLoading(false)
    router.push('/feed')
  }

  const hint = () => {
    if (usernameStatus === 'checking') return { text: 'checking...', 
color: 'text-[#5a5048]' }
    if (usernameStatus === 'taken') return { text: `@${username} is 
already taken`, color: 'text-red-400' }
    if (usernameStatus === 'available') return { text: `@${username} is 
available`, color: 'text-green-400' }
    if (username.length > 0 && username.length < 3) return { text: 'at least 3 characters', color: 'text-[#5a5048]' }
    return null
  }

  const h = hint()

  return (
    <main suppressHydrationWarning className="min-h-screen bg-[#1a1612] 
flex flex-col items-center justify-center px-6">
      <h1 className="font-serif italic text-5xl text-[#e8dcc8] mb-3 
tracking-tight">folio.</h1>

      <p className="text-[#5a5048] font-mono text-xs tracking-widest mb-12 
uppercase">
        any meaningful connection
      </p>

      <div className="w-full max-w-sm flex flex-col gap-3">

        <div className="flex bg-[#221e19] border border-[#2e2820] 
rounded-md p-1 mb-2">

          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 font-mono text-xs tracking-widest rounded transition-all ${mode === 'login' ? 'bg-[#c8922a] text-[#1a1410] font-bold' : 'text-[#5a5048]'}`}
          >
            log in
          </button>

          <button
            onClick={() => { setMode('signup'); setError('') }}
            className={`flex-1 py-2 font-mono text-xs tracking-widest rounded transition-all ${mode === 'signup' ? 'bg-[#c8922a] text-[#1a1410] font-bold' : 'text-[#5a5048]'}`}
          >
            sign up
          </button>

        </div>

        {mode === 'signup' && (
          <>
            <div className="flex flex-col gap-1">

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 
text-[#5a5048] font-mono text-sm">
                  @
                </span>

                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => checkUsername(e.target.value)}
                  maxLength={30}
                  className="w-full bg-[#221e19] border border-[#2e2820] 
rounded-md pl-8 pr-4 py-3 font-mono text-[#e8dcc8] text-sm outline-none 
focus:border-[#c8922a55] placeholder:text-[#5a5048]"
                />

                {usernameStatus === 'available' && (
                  <span className="absolute right-4 top-1/2 
-translate-y-1/2 text-green-400">✓</span>
                )}

                {usernameStatus === 'taken' && (
                  <span className="absolute right-4 top-1/2 
-translate-y-1/2 text-red-400">✗</span>
                )}

              </div>

              {h && (
                <p className={`font-mono text-xs px-1 ${h.color}`}>
                  {h.text}
                </p>
              )}

              {usernameStatus === 'idle' && username.length === 0 && (
                <p className="font-mono text-xs text-[#5a5048] px-1">
                  this is how you'll appear to others
                </p>
              )}

            </div>

            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#221e19] border border-[#2e2820] 
rounded-md px-4 py-3 font-mono text-[#e8dcc8] text-sm outline-none 
focus:border-[#c8922a55] placeholder:text-[#5a5048]"
            />

          </>
        )}

        {mode === 'login' && (
          <input
            type="text"
            placeholder="email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-[#221e19] border border-[#2e2820] 
rounded-md px-4 py-3 font-mono text-[#e8dcc8] text-sm outline-none 
focus:border-[#c8922a55] placeholder:text-[#5a5048]"
          />
        )}

        <div className="flex flex-col gap-1">

          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            className="w-full bg-[#221e19] border border-[#2e2820] 
rounded-md px-4 py-3 font-mono text-[#e8dcc8] text-sm outline-none 
focus:border-[#c8922a55] placeholder:text-[#5a5048]"
          />

          {mode === 'signup' && (
            <p className="font-mono text-xs text-[#5a5048] px-1">
              at least 6 characters
            </p>
          )}

        </div>

        {error && (
          <p className="text-red-400 font-mono text-xs px-1">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={
            loading ||
            (mode === 'signup' && (!email || !password || usernameStatus 
!== 'available')) ||
            (mode === 'login' && (!identifier || !password))
          }
          className="w-full bg-[#c8922a] text-[#1a1410] font-mono text-sm 
font-bold tracking-widest py-3 rounded-md disabled:opacity-40 
hover:bg-[#d4a843] transition-colors mt-1"
        >
          {loading ? '...' : mode === 'login' ? '→ log in' : '→ create account'}
        </button>

        {mode === 'login' && (
          <p className="text-center text-[#5a5048] font-mono text-xs 
mt-2">
            don't have an account?{' '}
            <button
              onClick={() => setMode('signup')}
              className="text-[#c8922a] underline"
            >
              sign up
            </button>
          </p>
        )}

      </div>
    </main>
  )
}
