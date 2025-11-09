"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { HorizontalNav } from "@/components/horizontal-nav"
import { SettingsModal } from "@/components/settings-modal"
import { Heart, Eye, Grid3X3, List, RotateCcw, X, Plus, Folder } from "lucide-react"

interface RecommendedResource {
  id: string
  title: string
  author: string
  likes: string
  views: string
  thumbnail: string
  color: string
}

interface RecentlyViewed {
  id: string
  title: string
  type: string
  lastEdited: string
  thumbnail: string
  icon: string
  iconColor: string
}

const recommendedResources: RecommendedResource[] = [
      {
        id: 1,
        title: "Startup Pitch",
        author: "DreamScale",
        likes: "3.5k",
        views: "86.5k",
        thumbnail: "Startup Pitch",
        color: "bg-yellow-400"
      },
  {
    id: 2,
    title: "Organization chart",
    author: "FigJam Templates",
    likes: "114",
    views: "13k",
    thumbnail: "org-chart",
    color: "bg-white"
  },
  {
    id: 3,
    title: "Data Flow Diagram",
    author: "FigJam Templates",
    likes: "118",
    views: "7.5k",
    thumbnail: "data-flow",
    color: "bg-white"
  },
  {
    id: 4,
    title: "Our Blooms®",
    author: "Brand Template",
    likes: "2.1k",
    views: "45.2k",
    thumbnail: "blooms",
    color: "bg-gray-800"
  }
]

const recentlyViewed: RecentlyViewed[] = [
  {
    id: 1,
    title: "Untitled",
    type: "Drafts",
    lastEdited: "16 days ago",
    thumbnail: "document",
    icon: "🌐",
    iconColor: "text-purple-500"
  },
  {
    id: 2,
    title: "Untitled",
    type: "Drafts",
    lastEdited: "1 month ago",
    thumbnail: "abstract",
    icon: "🔵",
    iconColor: "text-blue-500"
  },
  {
    id: 3,
    title: "Untitled",
    type: "Drafts",
    lastEdited: "2 months ago",
    thumbnail: "slide-deck",
    icon: "🟠",
    iconColor: "text-orange-500"
  }
]

export default function StudioPage() {
  const [activeTab, setActiveTab] = useState("recently-viewed")
  const [viewMode, setViewMode] = useState("grid")
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Horizontal Navigation */}
      <HorizontalNav onSettingsClick={() => setIsSettingsModalOpen(true)} />
      
      {/* Main Content */}
        <main className="pt-32">
        {/* Studio Header - Notion Style */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-start justify-between">
                  <div className="space-y-2 -ml-12">
                    <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-pulse">Studio</h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">Creative workspace for your projects</p>
                  </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-gray-300 dark:border-gray-600">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button size="sm" className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-none mx-auto px-8 py-8">
          {/* Quick Access Section */}
          <div className="mb-12">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Quick access</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {recommendedResources.map((resource) => (
                <div key={resource.id} className="group bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200 cursor-pointer">
                  <div className={`h-24 ${resource.color} rounded-t-lg flex items-center justify-center relative overflow-hidden`}>
                    {resource.thumbnail === "Startup Pitch" && (
                      <div className="text-center">
                        <div className="text-xs text-gray-600 mb-1">MONTH XX YEAR</div>
                        <div className="text-lg font-bold text-black">Startup Pitch</div>
                        <div className="text-xs bg-black text-white px-2 py-0.5 rounded mt-1">TAGLINE</div>
                      </div>
                    )}
                    {resource.thumbnail === "org-chart" && (
                      <div className="flex flex-col items-center space-y-1">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-pink-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                      </div>
                    )}
                    {resource.thumbnail === "data-flow" && (
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-3 bg-blue-500 rounded"></div>
                        <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                      </div>
                    )}
                    {resource.thumbnail === "blooms" && (
                      <div className="text-center">
                        <div className="w-full h-4 bg-gradient-to-r from-purple-500 to-green-500 to-orange-500 mb-2 rounded"></div>
                        <div className="text-lg font-bold text-white">Our Blooms®</div>
                        <div className="text-red-400 text-lg">🌸</div>
                      </div>
                    )}
                  </div>
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 group-hover:text-[#39d2c0] transition-colors">{resource.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">by {resource.author}</p>
                      </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-8">
                <button 
                  onClick={() => setActiveTab("recently-viewed")}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "recently-viewed" 
                      ? "border-[#39d2c0] text-[#39d2c0]" 
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Recently viewed
                </button>
                <button 
                  onClick={() => setActiveTab("shared-files")}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "shared-files" 
                      ? "border-[#39d2c0] text-[#39d2c0]" 
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Shared files
                </button>
                <button 
                  onClick={() => setActiveTab("shared-projects")}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === "shared-projects" 
                      ? "border-[#39d2c0] text-[#39d2c0]" 
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  Shared projects
                </button>
              </div>
              
              <div className="flex items-center gap-4">
                <select className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39d2c0] focus:border-transparent">
                  <option>All organizations</option>
                </select>
                <select className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39d2c0] focus:border-transparent">
                  <option>All files</option>
                </select>
                <select className="text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#39d2c0] focus:border-transparent">
                  <option>Last viewed</option>
                </select>
                
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 text-sm transition-colors ${
                      viewMode === "grid" 
                        ? "bg-[#39d2c0] text-white" 
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 text-sm transition-colors ${
                      viewMode === "list" 
                        ? "bg-[#39d2c0] text-white" 
                        : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Recently viewed</h3>
              <Button variant="link" className="p-0 text-[#39d2c0] hover:text-[#2bb3a3] text-sm">
                View all
              </Button>
            </div>
            
            {/* No Project Connected State */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No project connected</h4>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                You haven't connected any projects yet. Start by creating a new project or connecting an existing one to see your recent work here.
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button size="sm" className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border-gray-300 dark:border-gray-600"
                  onClick={() => setIsConnectModalOpen(true)}
                >
                  Connect Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSettingsSave}
      />

      {/* Connect Project Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Connect Your Projects</h2>
              <button
                onClick={() => setIsConnectModalOpen(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <p className="text-gray-600 dark:text-gray-400">
                Connect your projects from popular design and development tools to sync them with DreamScale Studio.
              </p>

              {/* Software Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Figma */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#39d2c0] hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-purple-500 rounded"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Figma</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Design files and prototypes</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Connect Figma
                  </Button>
                </div>

                {/* Adobe Creative Suite */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#39d2c0] hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-red-500 rounded"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Adobe Creative Suite</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Photoshop, Illustrator, XD</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Connect Adobe
                  </Button>
                </div>

                {/* Sketch */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#39d2c0] hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-yellow-500 rounded"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Sketch</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">UI/UX design files</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700 text-white">
                    Connect Sketch
                  </Button>
                </div>

                {/* GitHub */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#39d2c0] hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-800 rounded"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">GitHub</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Code repositories and projects</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-gray-800 hover:bg-gray-900 text-white">
                    Connect GitHub
                  </Button>
                </div>

                {/* Notion */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#39d2c0] hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-gray-600 rounded"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Notion</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Documentation and wikis</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                    Connect Notion
                  </Button>
                </div>

                {/* Trello */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-[#39d2c0] hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">Trello</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Project management boards</p>
                    </div>
                  </div>
                  <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Connect Trello
                  </Button>
                </div>
              </div>

              {/* Manual Import */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Manual Import</h3>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">Upload files directly or paste project URLs</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button variant="outline" size="sm">
                      Upload Files
                    </Button>
                    <Button variant="outline" size="sm">
                      Add URL
                    </Button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Button 
                  variant="outline" 
                  onClick={() => setIsConnectModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                  onClick={() => {
                    // Handle connection logic here
                    setIsConnectModalOpen(false)
                  }}
                >
                  Save Connections
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
