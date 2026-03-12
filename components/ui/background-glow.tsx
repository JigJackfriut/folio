'use client'

import { motion } from 'framer-motion'

export const BackgroundGlow = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#1b1328]">
      <motion.div
        animate={{
          x: [0, 40, 0],
          y: [0, 60, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -left-[10%] -top-[10%] h-[50%] w-[50%] rounded-full bg-[#6d4bc3]/24 blur-[140px]"
      />

      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.22, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full bg-[#b7a1ff]/18 blur-[130px]"
      />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.07),_transparent_35%)]" />
    </div>
  )
}
