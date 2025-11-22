"use client"

import { Card } from "@/components/ui/card"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import { Zap, Calendar, Cpu, Search } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { getNotificationStatus, hasUnseenUpdates, markFeatureAsSeen } from "@/lib/notifications"

const quickActions = [
  {
    icon: Zap,
    title: "Bizora AI",
    description: "Continue where you left off with your chat",
    gradient: "from-[#39d2c0] to-[#2bb3a3]",
    href: "/bizora",
    hasNotification: false,
  },
  {
    icon: Calendar,
    title: "Calendar",
    description: "Take a look at what's happening",
    gradient: "from-[#39d2c0] to-[#2bb3a3]",
    href: "/calendar",
    hasNotification: false,
  },
  {
    icon: Cpu,
    title: "HypeOS",
    description: "AI-powered workflow automation",
    gradient: "from-[#39d2c0] to-[#2bb3a3]",
    href: "/hypeos",
    hasNotification: false,
  },
  {
    icon: Search,
    title: "Discover",
    description: "Find new content and opportunities",
    gradient: "from-[#39d2c0] to-[#2bb3a3]",
    href: "/discover",
    hasNotification: false,
  },
]

export function QuickActions() {
  const [notifications, setNotifications] = useState({
    hasCalendarReminders: false,
    hasTaskReminders: false,
    hasChatNotifications: false,
    hasWorkflowNotifications: false,
  })
  
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
  
  // Function to determine if a card should show notification
  const shouldShowNotification = (title: string) => {
    switch (title) {
      case "Bizora AI": return hasUnseenUpdates('bizora')
      case "Calendar": return hasUnseenUpdates('calendar')
      case "HypeOS": return hasUnseenUpdates('hypeos')
      case "Discover": return hasUnseenUpdates('discover')
      default: return false
    }
  }

  // Function to handle card clicks
  const handleCardClick = (title: string) => {
    switch (title) {
      case "Bizora AI": markFeatureAsSeen('bizora'); break
      case "Calendar": markFeatureAsSeen('calendar'); break
      case "HypeOS": markFeatureAsSeen('hypeos'); break
      case "Discover": markFeatureAsSeen('discover'); break
    }
  }
  return (
    <div className="quick-actions">
      <h2 className="text-2xl font-bold mb-6 text-foreground">{"Jump back in"}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href} onClick={() => handleCardClick(action.title)}>
            <CardContainer containerClassName="py-2">
              <CardBody className="h-auto w-auto group">
                <Card className="p-6 bg-blue-100/30 dark:bg-gray-800/50 backdrop-blur-sm border border-[#39d2c0] dark:border-gray-600 shadow-sm hover:shadow-lg hover:shadow-[#39d2c0]/70 ring-1 ring-[#39d2c0]/20 dark:ring-gray-600/20 transition-all duration-300 cursor-pointer group relative overflow-hidden h-full title-glow-hover" style={{boxShadow: '0 0 10px rgba(57, 210, 192, 0.3), 0 0 20px rgba(57, 210, 192, 0.1)'}}>
                  {/* Red Notification Badge */}
                  {shouldShowNotification(action.title) && (
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full shadow-sm border border-white dark:border-gray-800 z-10">
                    </div>
                  )}
                  
                  <CardItem translateZ="80" rotateX={5} rotateY={5}>
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-125 transition-all duration-500 shadow-lg group-hover:shadow-primary/50`}
                    >
                      <action.icon className="w-8 h-8 text-white group-hover:text-white transition-colors duration-300" />
                    </div>
                  </CardItem>
                  <CardItem translateZ="60" rotateX={3}>
                    <h3 className="font-bold text-lg mb-2 text-blue-700 dark:text-gray-200 group-hover:text-blue-800 dark:group-hover:text-white transition-colors duration-300 title-glow">
                      {action.title}
                    </h3>
                  </CardItem>
                  <CardItem translateZ="40" rotateX={2}>
                    <p className="text-sm text-blue-600 dark:text-gray-400 text-pretty group-hover:text-blue-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                      {action.description}
                    </p>
                  </CardItem>
                </Card>
              </CardBody>
            </CardContainer>
          </Link>
        ))}
      </div>
    </div>
  )
}
