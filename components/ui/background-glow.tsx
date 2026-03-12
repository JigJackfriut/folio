'use client'

import { motion } from 'framer-motion'

export const BackgroundGlow = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#1e132b]">

      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 60, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#6b46c1]/20 blur-[140px]"
      />

      <motion.div
        animate={{ x: [0, -50, 0], y: [0, -30, 0], scale: [1, 1.25, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] rounded-full bg-[#a78bfa]/20 blur-[120px]"
      />

    </div>
  )
}
