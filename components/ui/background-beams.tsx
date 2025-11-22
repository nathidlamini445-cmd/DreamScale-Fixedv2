"use client"
import React from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export const BackgroundBeams = React.memo(({ className }: { className?: string }) => {
  const paths = [
    // Original paths
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867",
    "M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859",
    "M-359 -213C-359 -213 -291 192 173 319C637 446 705 851 705 851",
    "M-352 -221C-352 -221 -284 184 180 311C644 438 712 843 712 843",
    "M-345 -229C-345 -229 -277 176 187 303C651 430 719 835 719 835",
    "M-338 -237C-338 -237 -270 168 194 295C658 422 726 827 726 827",
    "M-331 -245C-331 -245 -263 160 201 287C665 414 733 819 733 819",
    "M-324 -253C-324 -253 -256 152 208 279C672 406 740 811 740 811",
    "M-317 -261C-317 -261 -249 144 215 271C679 398 747 803 747 803",
    // Additional paths for full coverage
    "M-500 -100C-500 -100 -400 300 0 400C400 500 500 800 500 800",
    "M-450 -150C-450 -150 -350 250 50 350C450 450 550 750 550 750",
    "M-400 -200C-400 -200 -300 200 100 300C500 400 600 700 600 700",
    "M-350 -250C-350 -250 -250 150 150 250C550 350 650 650 650 650",
    "M-300 -300C-300 -300 -200 100 200 200C600 300 700 600 700 600",
    "M-250 -350C-250 -350 -150 50 250 150C650 250 750 550 750 550",
    "M-200 -400C-200 -400 -100 0 300 100C700 200 800 500 800 500",
    "M-150 -450C-150 -450 -50 -50 350 50C750 150 850 450 850 450",
    "M-100 -500C-100 -500 0 -100 400 0C800 100 900 400 900 400",
    "M-50 -550C-50 -550 50 -150 450 -50C850 50 950 350 950 350",
  ]

  return (
    <div
      className={cn("absolute inset-0 flex h-full w-full items-center justify-center pointer-events-none", className)}
    >
      <svg
        className="absolute z-0 h-full w-full opacity-80 transition-all duration-500"
        width="100%"
        height="100%"
        viewBox="0 0 1200 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={`path-` + index}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="1.0"
            strokeWidth="2.5"
            fill="none"
          />
        ))}

        <defs>
          {paths.map((path, index) => (
            <motion.linearGradient
              id={`linearGradient-${index}`}
              key={`gradient-${index}`}
              initial={{
                x1: "0%",
                x2: "0%",
                y1: "0%",
                y2: "0%",
              }}
              animate={{
                x1: ["0%", "100%"],
                x2: ["0%", "95%"],
                y1: ["0%", "100%"],
                y2: ["0%", `${93 + Math.random() * 8}%`],
              }}
              transition={{
                duration: Math.random() * 8 + 12,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 5,
              }}
            >
              <stop stopColor="#1E3A8A" stopOpacity="0" />
              <stop stopColor="#1E3A8A" stopOpacity="1" />
              <stop offset="32.5%" stopColor="#3B4F7D" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#6B7280" stopOpacity="0.6" />
            </motion.linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  )
})

BackgroundBeams.displayName = "BackgroundBeams"
