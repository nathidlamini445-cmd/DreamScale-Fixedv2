"use client"

import { useState, useEffect } from "react"

interface ThinkingAnimationProps {
  className?: string
}

export function ThinkingAnimation({ className = "" }: ThinkingAnimationProps) {
  const [currentText, setCurrentText] = useState("Thinking")
  const [textIndex, setTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)
  
  const thinkingTexts = [
    "Thinking",
    "Thinking even better"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % thinkingTexts.length)
    }, 2000) // Change text every 2 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Add a subtle fade effect when text changes
    setIsVisible(false)
    const timer = setTimeout(() => {
      setCurrentText(thinkingTexts[textIndex])
      setIsVisible(true)
    }, 150)

    return () => clearTimeout(timer)
  }, [textIndex])

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Text with ChatGPT-style shimmer effect */}
      <span 
        className={`font-medium text-sm transition-opacity duration-150 ${
          isVisible ? 'opacity-100' : 'opacity-70'
        } animate-text-shimmer`}
      >
        {currentText}
      </span>
      
      {/* Bouncing dots */}
      <div className="flex items-center space-x-1">
        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
      </div>
    </div>
  )
}
