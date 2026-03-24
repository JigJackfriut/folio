'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
      className="font-mono text-[10px] uppercase tracking-widest"
      style={{
        color: '#8a7aaa',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      log out
    </button>
  )
}
