'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [identifier, setIdentifier] = useState('')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [usernameStatus, setUsernameStatus] =
    useState<'idle' | 'checking' | 'taken' | 'available'>('idle')
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

  return (
    <main className="relative min-h-screen flex items-center justify-center">
      <BackgroundGlow />

      <div className="relative z-10">
        {/* your actual login form goes here */}
      </div>
    </main>
  )
}
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')
    
    // Final Validations
    if (mode === 'signup') {
      if (usernameStatus !== 'available') return setError('Username is not available.')
      if (password.length < 6) return setError('Password is too short.')
    }

    setLoading(true)

    try {
      if (mode === 'signup') {
        const { data, error: authErr } = await supabase.auth.signUp({ email, password })
        if (authErr) throw authErr

        if (data.user) {
          const { error: profErr } = await supabase
            .from('profiles')
            .upsert({ id: data.user.id, handle: username, email: email.toLowerCase() })
          if (profErr) throw profErr
        }
        router.push('/onboarding')
      } else {
        // Login Logic
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

        const { error: logErr } = await supabase.auth.signInWithPassword({ email: loginEmail, password })
        if (logErr) throw new Error('Invalid login credentials.')
        
        router.push('/feed')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isFormInvalid = mode === 'signup' 
    ? (!email || !password || usernameStatus !== 'available' || password.length < 6)
    : (!identifier || !password)

  const inputStyle = "w-full bg-[#221e19] border border-[#2e2820] rounded-md px-4 py-3 font-mono text-[#e8dcc8] text-sm outline-none focus:border-[#c8922a] transition-all placeholder:text-[#a3978d]"

  return (
    <main className="min-h-screen bg-[#1a1612] flex flex-col items-center justify-center px-6 selection:bg-[#c8922a55]">
      <header className="text-center mb-10">
        <h1 className="font-serif italic text-6xl text-[#e8dcc8] mb-2 tracking-tighter">folio.</h1>
        <p className="text-[#5a5048] font-mono text-[10px] tracking-[0.3em] uppercase">any meaningful connection</p>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
        {/* Toggle with smooth slide feel */}
        <div className="flex bg-[#221e19] border border-[#2e2820] rounded-lg p-1">
          {(['login', 'signup'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => { setMode(t); setError('') }}
              className={`flex-1 py-2 font-mono text-xs tracking-widest rounded-md transition-all ${mode === t ? 'bg-[#c8922a] text-[#1a1410] font-bold shadow-sm' : 'text-[#5a5048] hover:text-[#8b7e74]'}`}
            >
              {t === 'login' ? 'log in' : 'sign up'}
            </button>
          ))}
        </div>

        {mode === 'signup' && (
          <>
            <div className="space-y-1">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5a5048] font-mono text-sm">@</span>
                <input
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={(e) => checkUsername(e.target.value)}
                  className={`${inputStyle} pl-8`}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  {usernameStatus === 'checking' && <div className="w-3 h-3 border-2 border-[#c8922a] border-t-transparent rounded-full animate-spin" />}
                  {usernameStatus === 'available' && <span className="text-green-500 text-xs">✓</span>}
                  {usernameStatus === 'taken' && <span className="text-red-500 text-xs">×</span>}
                </div>
              </div>
              <p className={`text-[10px] font-mono px-1 ${usernameStatus === 'taken' ? 'text-red-400' : 'text-[#8b7e74]'}`}>
                {usernameStatus === 'taken' ? 'Already taken' : 'At least 3 characters'}
              </p>
            </div>

            <input
              type="email"
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
            placeholder="email or username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className={inputStyle}
          />
        )}

        <div className="space-y-2">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputStyle}
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#5a5048] uppercase tracking-tighter hover:text-[#c8922a]"
            >
              {showPassword ? 'hide' : 'show'}
            </button>
          </div>
          
          {mode === 'signup' && (
            <div className="flex gap-1 px-1 h-1">
              {[1, 2, 3].map((step) => (
                <div 
                  key={step} 
                  className={`h-full flex-1 rounded-full transition-colors duration-500 ${strength >= step ? (strength === 1 ? 'bg-red-900' : strength === 2 ? 'bg-yellow-700' : 'bg-green-700') : 'bg-[#2e2820]'}`} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Error area with fixed height to prevent layout shift */}
        <div className="h-4">
          {error && <p className="text-red-400 font-mono text-[10px] text-center animate-pulse">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading || isFormInvalid}
          className="w-full bg-[#c8922a] text-[#1a1410] font-mono text-sm font-bold tracking-[0.2em] py-4 rounded-md disabled:opacity-30 disabled:grayscale transition-all active:scale-[0.98] shadow-lg shadow-[#c8922a10] hover:shadow-[#c8922a20] uppercase"
        >
          {loading ? 'Processing...' : mode === 'login' ? '→ log in' : '→ create account'}
        </button>

        <p className="text-center text-[#5a5048] font-mono text-[10px] mt-4 uppercase tracking-widest">
          {mode === 'login' ? "don't have an account?" : "already a member?"}{' '}
          <button 
            type="button" 
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} 
            className="text-[#c8922a] hover:underline"
          >
            {mode === 'login' ? 'sign up' : 'log in'}
          </button>
        </p>
      </form>
    </main>
  )
}
