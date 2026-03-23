import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/ui/bottom-nav'
import { BackgroundGlow } from '@/components/ui/background-glow'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_complete')
    .eq('id', user.id)
    .single()

  if (!profile?.onboarding_complete) redirect('/onboarding')

  return (
    <div className="relative min-h-screen" style={{ background: '#1b1328' }}>
      <BackgroundGlow />
      <div className="relative z-10 pb-20">
        {children}
      </div>
      <BottomNav />
    </div>
  )
}
