'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: '#f87171',
        background: 'none',
        border: '1px solid #5a2a2a',
        borderRadius: '20px',
        padding: '8px 20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#5a2a2a' }}
    >
      log out
    </button>
  )
}
