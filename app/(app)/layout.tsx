import { BottomNav } from '@/components/ui/bottom-nav'
import { BackgroundGlow } from '@/components/ui/background-glow'

export default function AppLayout({ children }: { children: React.ReactNode }) {
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
