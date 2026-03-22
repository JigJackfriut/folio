'use client'

import { Heading, Sub, ScreenWrapper } from '@/components/onboarding/ui'
import { motion } from 'framer-motion'

export function TagExplainerScreen() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  }

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <ScreenWrapper>
      <div className="mb-8">
        <Heading>the language of folio.</Heading>
        <Sub>Privacy is a gradient here. Here is how it works.</Sub>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-10"
      >
        {/* 01. PUBLIC TAGS */}
        <motion.section variants={item} className="group">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#9b85e8]/40 bg-[#9b85e8]/10 flex items-center justify-center font-mono text-[10px] text-[#9b85e8] group-hover:bg-[#9b85e8]/20 transition-colors">
              01
            </div>
            <div className="space-y-3">
              <header className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#9b85e8]">Public Tags</span>
                <span className="h-[1px] w-8 bg-[#9b85e8]/30" />
              </header>
              <p className="font-serif text-[17px] leading-relaxed text-[#f5efff]">
                The things you lead with. They live on your folio like a <span className="italic">secret handshake</span> for people who speak your language.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {['Bookworm', 'Night owl', 'Cinephile', '420 friendly'].map(tag => (
                  <TagPill key={tag} color="#9b85e8">{tag}</TagPill>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 02. ECHO TAGS */}
        <motion.section variants={item} className="group">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#c8922a]/40 bg-[#c8922a]/10 flex items-center justify-center font-mono text-[10px] text-[#c8922a] group-hover:bg-[#c8922a]/20 transition-colors">
              02
            </div>
            <div className="space-y-3">
              <header className="flex items-center gap-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#c8922a]">Echo Tags</span>
                <span className="h-[1px] w-8 bg-[#c8922a]/30" />
              </header>
              <p className="font-serif text-[17px] leading-relaxed text-[#f5efff]">
                The things you whisper. These are hidden until you start talking to someone who <span className="italic text-[#c8922a]">also</span> has them. 
              </p>
              
              {/* The "Visual Proof" Mockup */}
              <div className="bg-[#c8922a]/5 border border-[#c8922a]/20 rounded-xl p-4 my-2 border-dashed">
                <div className="flex flex-col gap-2 font-mono text-[11px] text-[#a07840]">
                  <div className="flex justify-between items-center opacity-60">
                    <span>You: [Late ADHD]</span>
                    <span>Them: [Late ADHD]</span>
                  </div>
                  <div className="h-px bg-[#c8922a]/20 w-full" />
                  <p className="text-[#f5efff] animate-pulse">✨ You both share a hidden signal.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Rejection sensitive', 'Never dated', 'Anxious attachment'].map(tag => (
                  <TagPill key={tag} color="#c8922a">{tag}</TagPill>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* 03. FILTERING */}
        <motion.section variants={item} className="group opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full border border-[#5a4b78]/40 bg-[#5a4b78]/10 flex items-center justify-center font-mono text-[10px] text-[#7a6b9a]">
              ✕
            </div>
            <div className="space-y-2">
              <p className="font-serif text-[16px] leading-relaxed text-[#ddd2f7]">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#5a4b78] mr-2">Quiet Filters</span>
                In the feed, you can cross out any public tag to hide those people. No judgment, just peace.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Footer Note */}
        <motion.footer variants={item} className="pt-4">
          <div className="bg-[#1e1530]/40 border border-[#2a1f42] rounded-2xl p-5">
            <p className="font-serif text-[15px] italic text-[#7a6b9a] leading-relaxed text-center">
              "The only way to find someone who actually fits is to lead with who you actually are."
            </p>
          </div>
        </motion.footer>
      </motion.div>
    </ScreenWrapper>
  )
}

function TagPill({ children, color }: { children: React.ReactNode, color: string }) {
  return (
    <span 
      className="font-mono text-[10px] rounded-full px-3 py-1.5 transition-all"
      style={{ 
        background: `${color}10`, 
        border: `1px solid ${color}30`, 
        color: color 
      }}
    >
      {children}
    </span>
  )
}
