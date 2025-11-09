"use client"

import { Home, Zap, Cpu, Atom, Target, TrendingUp, GraduationCap, Search, Layers, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationItems = [
  { icon: Home, label: "Home", href: "/", animation: "animate-gentle-pulse", aiPowered: false },
  { icon: Zap, label: "Discover", href: "/discover", animation: "animate-smooth-bounce", aiPowered: false },
  { icon: Cpu, label: "HypeOS", href: "/hypeos", animation: "animate-glow-pulse", aiPowered: true },
  { icon: Atom, label: "Bizora AI", href: "/bizora", animation: "animate-slow-spin", aiPowered: true },
  { icon: GraduationCap, label: "SkillDrops", href: "/skilldrops", animation: "animate-smooth-bounce", aiPowered: false },
  { icon: Target, label: "FlowMatch", href: "/flowmatch", animation: "animate-gentle-pulse", aiPowered: true },
  { icon: TrendingUp, label: "PitchPoint", href: "/marketplace", animation: "animate-float", aiPowered: true },
]

// Function to get icon color based on label
function getIconColor(label: string): string {
  switch (label) {
    case "Discover": return "#22c55e" // Green
    case "Projects": return "#ec4899" // Pink
    case "Studio": return "#eab308" // Yellow
    case "HypeOS": return "#a855f7" // Purple
    case "Bizora AI": return "#ef4444" // Red
    case "FlowMatch": return "#000000" // Black
    case "PitchPoint": return "#22c55e" // Green
    case "Publishing": return "#eab308" // Yellow
    case "Settings": return "#000000" // Black
    default: return "var(--sidebar-foreground)" // Default
  }
}

export function Sidebar() {
  const pathname = usePathname()
  
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border glass-morphism">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center arc-reactor-glow animate-glow-pulse">
            <Layers className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground animate-gentle-pulse">{"Workspace"}</span>
        </div>

        <div className="h-[calc(100vh-200px)] overflow-y-auto scrollbar-hide">
          <nav className="space-y-2">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group holographic-hover gradient-animation relative",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-lg hover:shadow-primary/30 hover:border hover:border-primary/30",
                  )}
                >
                <item.icon
                  className={cn(
                    "w-6 h-6 transition-all duration-300 flex-shrink-0",
                    isActive 
                      ? "text-sidebar-primary-foreground" 
                      : "group-hover:scale-110",
                    item.animation
                  )}
                  style={{
                    color: isActive ? 'var(--sidebar-primary-foreground)' : getIconColor(item.label),
                    minWidth: '24px',
                    minHeight: '24px'
                  }}
                />
                <span className={cn(
                  "font-medium transition-all duration-300",
                  isActive ? "" : "group-hover:text-shimmer"
                )}>{item.label}</span>
                
                {/* AI Powered Badge */}
                {item.aiPowered && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                    <div className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#39d2c0]/15 to-purple-500/15 border border-[#39d2c0]/20 text-[10px] font-medium text-[#39d2c0]/90 animate-ai-glow whitespace-nowrap">
                      <span>AI</span>
                    </div>
                  </div>
                )}
              </Link>
              )
            })}
            
            {/* Additional Navigation Items */}
            <Link
              href="/dreampulse"
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300 group holographic-hover gradient-animation relative",
                pathname === "/dreampulse" || pathname.startsWith("/dreampulse")
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-lg hover:shadow-primary/30 hover:border hover:border-primary/30",
              )}
            >
              <Search
                className={cn(
                  "w-5 h-5 transition-all duration-300 flex-shrink-0",
                  (pathname === "/dreampulse" || pathname.startsWith("/dreampulse"))
                    ? ""
                    : "group-hover:scale-105 group-hover:translate-y-0.5",
                  "animate-float"
                )}
              />
              <span className={cn(
                "font-medium transition-all duration-300",
                (pathname === "/dreampulse" || pathname.startsWith("/dreampulse")) ? "" : "group-hover:text-shimmer"
              )}>{"Competitor Intelligence Dashboard"}</span>
              
              {/* AI Powered Badge */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1 group-hover:translate-x-0">
                <div className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[#39d2c0]/15 to-purple-500/15 border border-[#39d2c0]/20 text-[10px] font-medium text-[#39d2c0]/90 animate-ai-glow whitespace-nowrap">
                  <span>AI</span>
                </div>
              </div>
            </Link>
          </nav>
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-300 group holographic-hover gradient-animation hover:shadow-lg hover:shadow-primary/30 hover:border hover:border-primary/30">
          <Settings 
            className="w-6 h-6 group-hover:scale-110 transition-all duration-300 animate-gentle-pulse flex-shrink-0" 
            style={{ 
              color: '#000000',
              minWidth: '24px',
              minHeight: '24px'
            }}
          />
          <div>
            <div className="font-medium text-left group-hover:text-shimmer transition-all duration-300">{"Settings"}</div>
            <div className="text-sm text-muted-foreground text-left group-hover:text-foreground/80 transition-colors duration-300">{"Customize your experience"}</div>
          </div>
        </button>
      </div>
    </div>
  )
}
