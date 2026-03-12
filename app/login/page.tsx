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
  const [usernameStatus, setUsernameStatus] = useState<
    'idle' | 'checking' | 'taken' | 'available'
  >('idle')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const router = useRouter()
  const supabase = createClient()

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

    if (mode === 'signup') {
      if (usernameStatus !== 'available') {
        setError('Username is not available.')
        return
      }
      if (password.length < 6) {
        setError('Password is too short.')
        return
      }
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: authErr } = await supabase.auth.signUp({
          email,
          password,
        })
        if (authErr) throw authErr

        if (data.user) {
          const { error: profErr } = await supabase.from('profiles').upsert({
            id: data.user.id,
            handle: username,
            email: email.toLowerCase(),
          })
          if (profErr) throw profErr
        }

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

        const { error: logErr } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        })

        if (logErr) throw new Error('Invalid login credentials.')
        router.push('/feed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFormInvalid =
    mode === 'signup'
      ? !email || !password || usernameStatus !== 'available' || password.length < 6
      : !identifier || !password

  const inputStyle =
    'w-full rounded-xl border border-[#4f3c73] bg-[#2a1f42]/90 px-4 py-3 font-sans text-sm text-[#f5efff] outline-none transition-all placeholder:text-[#a99abb] focus:border-[#c3b3ff] focus:ring-2 focus:ring-[#8f73e633]'

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#1b1328] px-6 selection:bg-[#8f73e655]">
      <BackgroundGlow />

      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm">
          <header className="mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-3 font-serif text-6xl italic tracking-tighter text-[#f5efff] drop-shadow-[0_10px_25px_rgba(143,115,230,0.22)]"
            >
              folio.
            </motion.h1>

            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.42em] text-[#ddd2f7] opacity-100">
              Any meaningful connection
            </p>
          </header>

          <form
            onSubmit={handleSubmit}
            className="rounded-[24px] border border-[#4b376f]/80 bg-[#241936]/75 p-6 shadow-[0_20px_90px_rgba(5,0,20,0.45),0_0_45px_rgba(109,75,195,0.18)] backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4">
              <LayoutGroup>
                <div className="relative flex rounded-xl border border-[#4b376f] bg-[#2c2044]/90 p-1">
                  {(['login', 'signup'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setMode(t)
                        setError('')
                      }}
                      className={`relative z-10 flex-1 rounded-lg py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition-colors ${
                        mode === t
                          ? 'font-bold text-white'
                          : 'text-[#c1b4df] hover:text-[#f0eaff]'
                      }`}
                    >
                      {t === 'login' ? 'log in' : 'sign up'}

                      {mode === t && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 -z-10 rounded-lg bg-[#6d4bc3]"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.55 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </LayoutGroup>

              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-4"
                >
                  {mode === 'signup' && (
                    <>
                      <div className="space-y-1.5">
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[#a696c8]">
                            @
                          </span>

                          <input
                            type="text"
                            autoComplete="username"
                            placeholder="username"
                            value={username}
                            onChange={(e) => checkUsername(e.target.value)}
                            className={`${inputStyle} pl-8`}
                          />

                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            {usernameStatus === 'checking' && (
                              <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#c3b3ff] border-t-transparent" />
                            )}
                            {usernameStatus === 'available' && (
                              <span className="text-xs text-violet-300">✓</span>
                            )}
                            {usernameStatus === 'taken' && (
                              <span className="text-xs text-rose-400">×</span>
                            )}
                          </div>
                        </div>

                        <p
                          className={`px-1 font-mono text-[10px] ${
                            usernameStatus === 'taken'
                              ? 'text-rose-400'
                              : 'text-[#c1b4dc]'
                          }`}
                        >
                          {usernameStatus === 'taken'
                            ? 'Already taken'
                            : 'At least 3 characters'}
                        </p>
                      </div>

                      <input
                        type="email"
                        autoComplete="email"
                        placeholder="email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputStyle}
                      />
                    </>
                  )}

                  {mode === 'login' && (
                    <input
                      type="text"
                      autoComplete="username"
                      placeholder="email or username"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className={inputStyle}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={inputStyle}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.15em] text-[#b3a5d0] hover:text-[#f0eaff]"
                  >
                    {showPassword ? 'hide' : 'show'}
                  </button>
                </div>

                {mode === 'signup' && (
                  <div className="flex h-1.5 gap-1 px-1">
                    {[1, 2, 3].map((step) => (
                      <div
                        key={step}
                        className={`h-full flex-1 rounded-full transition-colors duration-500 ${
                          strength >= step
                            ? strength === 1
                              ? 'bg-rose-500/70'
                              : strength === 2
                              ? 'bg-amber-400/70'
                              : 'bg-violet-400/80'
                            : 'bg-[#3a2b58]'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex h-4 items-center justify-center">
                {error && (
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-rose-400">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || isFormInvalid}
                className="w-full rounded-xl bg-[#6d4bc3] py-4 font-mono text-sm font-bold uppercase tracking-[0.22em] text-white shadow-lg shadow-[#6d4bc340] transition-all hover:shadow-[#6d4bc360] active:scale-[0.98] disabled:bg-[#3b2f4f] disabled:text-[#9587b0] disabled:opacity-60"
              >
                {loading
                  ? 'Processing...'
                  : mode === 'login'
                  ? '→ log in'
                  : '→ create account'}
              </button>

              <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-[#b8abcf]">
                {mode === 'login' ? "don't have an account?" : 'already a member?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-[#e4dbff] hover:underline"
                >
                  {mode === 'login' ? 'sign up' : 'log in'}
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
