"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { X, User, Settings as SettingsIcon, Bell, Users, Building, Zap, CreditCard, UserCircle, Sliders, Check, Crown } from "lucide-react"

interface SettingsData {
  name: string
  email: string
  theme: string
  language: string
  timezone: string
  startWeekOnMonday: boolean
  autoTimezone: boolean
  openLinksInDesktop: boolean
  openOnStart: string
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
  }
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (settings: SettingsData) => void
  initialData?: SettingsData
}

export function SettingsModal({ isOpen, onClose, onSave, initialData }: SettingsModalProps) {
  const { theme, setTheme } = useTheme()
  const [activeSection, setActiveSection] = useState("account")
  const [settingsData, setSettingsData] = useState<SettingsData>(
    initialData || {
      name: "Nkosinathi Dlamini",
      email: "nkosinathi@example.com",
      theme: theme || "system",
      language: "en",
      timezone: "GMT+2:00",
      startWeekOnMonday: true,
      autoTimezone: true,
      openLinksInDesktop: true,
      openOnStart: "top-page-in-sidebar",
      notifications: {
        email: true,
        push: true,
        marketing: false
      }
    }
  )

  // Update theme when it changes
  useEffect(() => {
    if (theme) {
      setSettingsData(prev => ({ ...prev, theme }))
    }
  }, [theme])

  const sidebarSections = [
    {
      title: "Account",
      items: [
        { id: "account", label: "Nkosinathi Dlamini", icon: UserCircle },
        { id: "preferences", label: "Preferences", icon: Sliders },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "connections", label: "Connections", icon: Zap }
      ]
    },
    {
      title: "Workspace",
      items: [
        { id: "general", label: "General", icon: SettingsIcon },
        { id: "people", label: "People", icon: Users },
        { id: "teamspaces", label: "Teamspaces", icon: Building }
      ]
    },
    {
      title: "",
      items: [
        { id: "upgrade", label: "Upgrade plan", icon: CreditCard }
      ]
    }
  ]

  const handleSave = () => {
    onSave(settingsData)
    onClose()
  }

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Account</h2>
              <p className="text-sm text-gray-500">Manage your account settings</p>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Users name
                </Label>
                <Input
                  id="name"
                  value={settingsData.name}
                  onChange={(e) => setSettingsData({ ...settingsData, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Users Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={settingsData.email}
                  onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        )
      case "preferences":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Appearance</h3>
                <p className="text-sm text-gray-500 mb-3">Customize how Notion looks on your device.</p>
                <Select
                  value={settingsData.theme}
                  onValueChange={(value) => {
                    setSettingsData({ ...settingsData, theme: value })
                    setTheme(value)
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">Use system setting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Language & Time</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Language</Label>
                    <p className="text-sm text-gray-500 mb-2">Change the language used in the user interface.</p>
                    <Select
                      value={settingsData.language}
                      onValueChange={(value) => setSettingsData({ ...settingsData, language: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English (US)</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start week on Monday</p>
                      <p className="text-xs text-gray-500">This will change how all calendars in your app look.</p>
                    </div>
                    <Switch
                      checked={settingsData.startWeekOnMonday}
                      onCheckedChange={(checked) => 
                        setSettingsData({ ...settingsData, startWeekOnMonday: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Set timezone automatically using your location</p>
                      <p className="text-xs text-gray-500">Reminders, notifications and emails are delivered based on your time zone.</p>
                    </div>
                    <Switch
                      checked={settingsData.autoTimezone}
                      onCheckedChange={(checked) => 
                        setSettingsData({ ...settingsData, autoTimezone: checked })
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Timezone</Label>
                    <p className="text-sm text-gray-500 mb-2">Current timezone setting.</p>
                    <Select
                      value={settingsData.timezone}
                      onValueChange={(value) => setSettingsData({ ...settingsData, timezone: value })}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GMT+2:00">(GMT+2:00) Johannesburg</SelectItem>
                        <SelectItem value="GMT+0:00">(GMT+0:00) London</SelectItem>
                        <SelectItem value="GMT-5:00">(GMT-5:00) New York</SelectItem>
                        <SelectItem value="GMT+1:00">(GMT+1:00) Paris</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">Desktop app</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Open links in desktop app</p>
                      <p className="text-xs text-gray-500">You must have the Windows app installed.</p>
                    </div>
                    <Switch
                      checked={settingsData.openLinksInDesktop}
                      onCheckedChange={(checked) => 
                        setSettingsData({ ...settingsData, openLinksInDesktop: checked })
                      }
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2 block">Open on start</Label>
                    <p className="text-sm text-gray-500 mb-2">Choose what to show when Notion starts or when you switch workspaces.</p>
                    <Select
                      value={settingsData.openOnStart}
                      onValueChange={(value) => setSettingsData({ ...settingsData, openOnStart: value })}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-page-in-sidebar">Top page in sidebar</SelectItem>
                        <SelectItem value="last-visited">Last visited page</SelectItem>
                        <SelectItem value="home">Home</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "upgrade":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Upgrade Plan</h2>
              <p className="text-sm text-gray-500">Choose the plan that works best for you</p>
            </div>
            
            <div className="grid gap-6">
              {/* Free Plan */}
              <div className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Check className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">Free</h3>
                      <span className="text-2xl font-bold text-gray-900">$0</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Perfect for getting started</p>
                    <ul className="text-sm text-gray-600 space-y-2 mb-4">
                      <li>• Basic features</li>
                      <li>• Limited projects</li>
                      <li>• Community support</li>
                    </ul>
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50/30 relative">
                <div className="absolute -top-3 left-6">
                  <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-blue-900">Pro</h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-900">$18</span>
                        <span className="text-sm text-blue-600">/month</span>
                      </div>
                    </div>
                    <p className="text-sm text-blue-600 mb-4">Most popular choice</p>
                    <ul className="text-sm text-blue-700 space-y-2 mb-4">
                      <li>• All Free features</li>
                      <li>• Unlimited projects</li>
                      <li>• Priority support</li>
                      <li>• Advanced analytics</li>
                    </ul>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>

              {/* Yearly Plan */}
              <div className="border-2 border-green-200 rounded-lg p-6 bg-green-50/30 relative">
                <div className="absolute -top-3 left-6">
                  <span className="bg-green-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Save 30%
                  </span>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Crown className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-green-900">Yearly</h3>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-green-900">$150</span>
                        <span className="text-sm text-green-600">/year</span>
                        <div className="text-xs text-gray-500 line-through">$216</div>
                      </div>
                    </div>
                    <p className="text-sm text-green-600 mb-4">Best value for teams</p>
                    <ul className="text-sm text-green-700 space-y-2 mb-4">
                      <li>• All Pro features</li>
                      <li>• Team collaboration</li>
                      <li>• Custom integrations</li>
                      <li>• Dedicated support</li>
                    </ul>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Upgrade to Yearly
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{activeSection}</h2>
              <p className="text-sm text-gray-500">This section is coming soon.</p>
            </div>
          </div>
        )
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-4xl h-[600px] flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-6">
            {sidebarSections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    {section.title}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-all duration-300 group ${
                        activeSection === item.id
                          ? 'bg-gray-200 text-gray-900'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 transition-all duration-300 ${
                        activeSection === item.id 
                          ? 'text-gray-900' 
                          : 'text-gray-600 group-hover:text-blue-500 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
