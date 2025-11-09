"use client"
import { motion } from "motion/react"

export const HolographicPlanet = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="relative w-96 h-96"
      >
        <div className="absolute inset-0 rounded-full border-2 border-[#1C05B3] bg-gradient-to-br from-[#1C05B3]/20 to-transparent backdrop-blur-sm">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-[#4c7fff]/30"
            style={{ transform: "rotateX(60deg)" }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-[#6b8fff]/20"
            style={{ transform: "rotateX(45deg)" }}
          />

          <div className="absolute inset-0 rounded-full">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border border-[#1C05B3]/20 rounded-full"
                style={{
                  transform: `rotateY(${i * 22.5}deg) rotateX(60deg)`,
                }}
              />
            ))}
          </div>

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-[#1C05B3] rounded-full blur-sm"
          />
        </div>
      </motion.div>
    </div>
  )
}
