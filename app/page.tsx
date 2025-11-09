"use client"

import { useState, useEffect } from "react"
import { HorizontalNav } from "@/components/horizontal-nav"
import { Header } from "@/components/header"
import { QuickActions } from "@/components/quick-actions"
import { TasksPanel } from "@/components/tasks-panel"
import { EventsTimeline } from "@/components/events-timeline"
import { MotivationalQuotes } from "@/components/motivational-quotes"
import { MarketplaceWidget } from "@/components/marketplace/marketplace-widget"
import { SettingsModal } from "@/components/settings-modal"
import { EmailCaptureModal } from "@/components/email-capture-modal"
import { LogoutButton } from "@/components/logout-button"
import { useSessionSafe } from "@/lib/session-context"

export default function DashboardPage() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const sessionContext = useSessionSafe()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="relative z-10 main-container">
        <HorizontalNav />
        <main className="pt-16">
          <Header onSettingsClick={() => setIsSettingsModalOpen(true)} />
          <div className="p-8 space-y-8">
            {/* Session Info Bar */}
            {mounted && sessionContext && sessionContext.sessionData.email && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700 flex justify-between items-center">
                <div className="text-sm">
                  <span className="font-semibold text-gray-900 dark:text-white">Session Active:</span>
                  <span className="ml-2 text-blue-600 dark:text-blue-400 font-medium">{sessionContext.sessionData.email}</span>
                </div>
                <LogoutButton />
              </div>
            )}
            <QuickActions />
            <TasksPanel />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <EventsTimeline />
                <div className="mt-8">
                  <MotivationalQuotes />
                </div>
              </div>
              <div>
                <MarketplaceWidget />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Email Capture Modal */}
      <EmailCaptureModal />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  )
}
