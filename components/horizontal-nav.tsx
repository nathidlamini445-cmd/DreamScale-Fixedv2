"use client"

import { Home, Zap, Cpu, Atom, Target, TrendingUp, GraduationCap, Layers, Search, Settings, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getNotificationStatus, hasUnseenUpdates, markFeatureAsSeen } from "@/lib/notifications"

const navigationItems = [
  { icon: Home, label: "Home", href: "/", animation: "animate-gentle-pulse", aiPowered: false, hasNotification: false },
  { icon: Zap, label: "Discover", href: "/discover", animation: "animate-smooth-bounce", aiPowered: false, hasNotification: false },
  { icon: Cpu, label: "HypeOS", href: "/hypeos", animation: "animate-glow-pulse", aiPowered: true, hasNotification: false },
  { icon: Atom, label: "Bizora AI", href: "/bizora", animation: "animate-slow-spin", aiPowered: true, hasNotification: false },
  { icon: GraduationCap, label: "SkillDrops", href: "/skilldrops", animation: "animate-smooth-bounce", aiPowered: false, hasNotification: false },
  { icon: Target, label: "FlowMatch", href: "/flowmatch", animation: "animate-gentle-pulse", aiPowered: true, hasNotification: false },
  { icon: TrendingUp, label: "PitchPoint", href: "/marketplace", animation: "animate-float", aiPowered: true, hasNotification: false },
  { icon: Search, label: "Competitor Intelligence Dashboard", href: "/dreampulse", animation: "animate-float", aiPowered: true, hasNotification: false },
]

// Function to get icon color based on label
function getIconColor(label: string): string {
  switch (label) {
    case "Discover": return "#22c55e" // Green
    case "Projects": return "#ec4899" // Pink
    case "Studio": return "#eab308" // Yellow
    case "HypeOS": return "#a855f7" // Purple
    case "Bizora AI": return "#ef4444" // Red
    case "SkillDrops": return "#2563eb" // Blue
    case "FlowMatch": return "#8b5cf6" // Purple (mood-based feature)
    case "PitchPoint": return "#22c55e" // Green
    case "Publishing": return "#eab308" // Yellow
    case "Settings": return "#6b7280" // Dark gray
    case "Competitor Intelligence Dashboard": return "#2563eb" // Blue
    default: return "#2563eb" // Default blue
  }
}

export function HorizontalNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [notifications, setNotifications] = useState({
    hasCalendarReminders: false,
    hasTaskReminders: false,
    hasChatNotifications: false,
    hasWorkflowNotifications: false,
  })
  const [savedPulsesCount, setSavedPulsesCount] = useState(0)
  
  useEffect(() => {
    // Check for notifications on mount and periodically
    const checkNotifications = () => {
      setNotifications(getNotificationStatus())
    }
    
    checkNotifications()
    
    // Check every 30 seconds for new notifications
    const interval = setInterval(checkNotifications, 30000)
    
    return () => clearInterval(interval)
  }, [])

  // Load saved pulses count from localStorage
  useEffect(() => {
    const loadSavedPulses = () => {
      try {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('dreamPulseSavedAnalyses') : null
        if (saved) {
          const parsed = JSON.parse(saved)
          setSavedPulsesCount(Array.isArray(parsed) ? parsed.length : 0)
        } else {
          setSavedPulsesCount(0)
        }
      } catch (e) {
        console.warn('Failed to load saved pulses count', e)
        setSavedPulsesCount(0)
      }
    }

    loadSavedPulses()
    
    // Listen for storage changes (when pulses are saved/deleted)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dreamPulseSavedAnalyses') {
        loadSavedPulses()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check periodically in case localStorage is updated in the same tab
    const interval = setInterval(loadSavedPulses, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])
  
  // Function to determine if a nav item should show notification
  const shouldShowNotification = (label: string) => {
    switch (label) {
      case "Discover": return hasUnseenUpdates('discover')
      case "Bizora AI": return hasUnseenUpdates('bizora')
      case "SkillDrops": return hasUnseenUpdates('skilldrops')
      case "FlowMatch": return hasUnseenUpdates('flowmatch')
      case "PitchPoint": return hasUnseenUpdates('pitchpoint')
      case "HypeOS": return hasUnseenUpdates('hypeos')
      default: return false
    }
  }

  // Function to handle navigation clicks
  const handleNavClick = (label: string) => {
    switch (label) {
      case "Discover": markFeatureAsSeen('discover'); break
      case "Bizora AI": markFeatureAsSeen('bizora'); break
      case "SkillDrops": markFeatureAsSeen('skilldrops'); break
      case "FlowMatch": markFeatureAsSeen('flowmatch'); break
      case "PitchPoint": markFeatureAsSeen('pitchpoint'); break
      case "HypeOS": markFeatureAsSeen('hypeos'); break
    }
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm" style={{ isolation: 'isolate' }}>
      {/* Logo and Navigation Row */}
      <div className="flex items-center gap-4 px-4 py-3">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#39d2c0] to-[#2bb3a3] rounded-lg flex items-center justify-center arc-reactor-glow animate-glow-pulse shadow-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[#39d2c0] dark:text-[#39d2c0] animate-gentle-pulse drop-shadow-lg">{"Workspace"}</span>
        </div>

        {/* Navigation Items */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 min-w-0">
          {navigationItems.map((item, index) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            const isDreamPulse = item.label === "Competitor Intelligence Dashboard"
            
            return (
              <div key={index} className="flex items-center gap-1">
                <Link
                  href={item.href}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavClick(item.label);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all duration-300 group relative whitespace-nowrap min-w-fit cursor-pointer pointer-events-auto",
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm border border-gray-200 dark:border-gray-600",
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-all duration-300 flex-shrink-0",
                      isActive 
                        ? "text-white" 
                        : "group-hover:scale-105",
                      item.animation
                    )}
                    style={{
                      color: isActive ? (item.label === "Studio" ? '#000000' : 'white') : '#d1d5db',
                      minWidth: '20px',
                      minHeight: '20px'
                    }}
                  />
                  <span className={cn(
                    "font-medium transition-all duration-300 text-sm",
                    isActive ? (item.label === "Studio" ? "text-black font-bold" : "text-white") : "text-gray-700 dark:text-gray-300 group-hover:text-gray-800 dark:group-hover:text-gray-200"                )}>{item.label}</span>
                  
                  {/* AI Powered Badge */}
                  {item.aiPowered && (
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                      <div className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#39d2c0]/15 to-purple-500/15 border border-[#39d2c0]/20 text-[10px] font-medium text-[#39d2c0]/90 animate-ai-glow whitespace-nowrap">
                        <span>AI</span>
                      </div>
                    </div>
                  )}

                  {/* Red Notification Badge */}
                  {shouldShowNotification(item.label) && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full shadow-sm border border-white dark:border-gray-900">
                    </div>
                  )}
                </Link>
                
                {/* Saved Analysis Button - Only show for DreamPulse */}
                {isDreamPulse && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      router.push('/dreampulse')
                      // Trigger viewMode change via localStorage event
                      setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('dreampulse:viewSaved'))
                      }, 100)
                    }}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-300 whitespace-nowrap",
                      savedPulsesCount > 0
                        ? "bg-[#39d2c0] text-white hover:bg-[#2bb3a3] shadow-sm"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                    )}
                    title={savedPulsesCount > 0 ? `View ${savedPulsesCount} saved analysis${savedPulsesCount !== 1 ? 'es' : ''}` : 'View Saved Analysis'}
                  >
                    <BookOpen className="w-3 h-3" />
                    {savedPulsesCount > 0 ? (
                      <span className="font-semibold">{savedPulsesCount}</span>
                    ) : (
                      <span className="hidden sm:inline">Saved</span>
                    )}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
