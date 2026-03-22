'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { BackgroundGlow } from '@/components/ui/background-glow'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'taken' | 'available'>('idle')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // 🔥 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    if (password.length === 0) return 0
    if (password.length < 6) return 1
    const hasMixed = /[A-Z]/.test(password) && /[0-9]/.test(password)
    return hasMixed && password.length >= 8 ? 3 : 2
  }
  const strength = getPasswordStrength()

  const checkUsername = (value: string) => {
    const cleaned = value.toLowerCase().replace(/[^a-z0-9._]/g, '')
    setUsername(cleaned)
    setUsernameStatus('idle')
    if (cleaned.length < 3) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (abortControllerRef.current) abortControllerRef.current.abort()
    setUsernameStatus('checking')
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController()
      abortControllerRef.current = controller
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('handle')
          .eq('handle', cleaned)
          .maybeSingle()
        if (controller.signal.aborted) return
        if (fetchError) throw fetchError
        setUsernameStatus(data ? 'taken' : 'available')
      } catch (err: any) {
        if (err.name !== 'AbortError') setUsernameStatus('idle')
      }
    }, 400)
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'signup') {
        if (usernameStatus !== 'available') throw new Error('Username is not available.')

        const { error: authErr } = await supabase.auth.signUp({
          email: email.toLowerCase().trim(),
          password,
          options: {
            data: { handle: username }
          }
        })
        if (authErr) throw authErr

        router.push('/onboarding')
      } else {
        let loginEmail = identifier.trim().toLowerCase()

        if (!loginEmail.includes('@')) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email')
            .eq('handle', loginEmail.replace(/[^a-z0-9._]/g, ''))
            .maybeSingle()

          if (!profile) throw new Error('Invalid login credentials.')
          loginEmail = profile.email
        }

        const { data: signInData, error: logErr } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password
        })
        if (logErr) throw new Error('Invalid login credentials.')

        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', signInData.user.id)
          .single()

        if (profile?.onboarding_complete) {
          router.push('/feed')
        } else {
          router.push('/onboarding')
        }
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFormInvalid = mode === 'signup'
    ? (!email || !password || usernameStatus !== 'available' || password.length < 6)
    : (!identifier || !password)

  const inputStyle = 'w-full rounded-xl border border-[#4f3c73] bg-[#2a1f42]/90 px-4 py-3 font-sans text-sm text-[#f5efff] outline-none transition-all placeholder:text-[#a99abb] focus:border-[#c3b3ff] focus:ring-2 focus:ring-[#8f73e633]'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1b1328] px-6">
      <BackgroundGlow />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm">

          <header className="mb-8 text-center">
            <h1 className="mb-3 font-serif text-6xl italic text-[#f5efff]">folio.</h1>
            <p className="font-mono text-[11px] uppercase tracking-[0.42em] text-[#ddd2f7]">
              Any meaningful connection
            </p>
          </header>

          <form onSubmit={handleSubmit} className="rounded-[24px] border border-[#4b376f]/80 bg-[#241936]/75 p-6 backdrop-blur-xl">

            <div className="flex flex-col gap-4">

              {/* TOGGLE */}
              <LayoutGroup>
                <div className="flex rounded-xl border border-[#4b376f] bg-[#2c2044]/90 p-1">
                  {(['login', 'signup'] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setMode(t)}
                      className={`flex-1 py-2.5 font-mono text-xs uppercase ${
                        mode === t ? 'text-white font-bold' : 'text-[#c1b4df]'
                      }`}>
                      {t === 'login' ? 'log in' : 'sign up'}
                    </button>
                  ))}
                </div>
              </LayoutGroup>

              {/* GOOGLE BUTTON */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-white py-3 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" />
                Continue with Google
              </button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#4b376f]" />
                <span className="text-[10px] text-[#a99abb] uppercase">or</span>
                <div className="h-px flex-1 bg-[#4b376f]" />
              </div>

              {/* INPUTS */}
              {mode === 'login' && (
                <input
                  placeholder="email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className={inputStyle}
                />
              )}

              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputStyle}
              />

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <button
                type="submit"
                disabled={loading || isFormInvalid}
                className="w-full rounded-xl bg-[#6d4bc3] py-3 text-white"
              >
                {loading ? 'please wait...' : mode === 'login' ? 'log in' : 'sign up'}
              </button>

            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
