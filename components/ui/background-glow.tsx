'use client'

import { motion } from "framer-motion"

export const BackgroundGlow = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#1a1612]">
      
      {/* Top Left Blob */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] 
rounded-full bg-[#c8922a]/10 blur-[120px]"
      />

      {/* Bottom Right Blob */}
      <motion.div
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] 
rounded-full bg-[#5a3e1a]/20 blur-[100px]"
      />
      
    </div>
  )
}
