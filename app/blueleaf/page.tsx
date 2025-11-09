"use client"

import { HorizontalNav } from "@/components/horizontal-nav"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { HolographicPlanet } from "@/components/ui/holographic-planet"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Clock, Sparkles, HelpCircle, MessageSquare } from "lucide-react"
import { UpgradeDropdown } from "@/components/upgrade-dropdown"

export default function BlueLeafPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="background-beams-container">
        <BackgroundBeams className="background-beams" />
      </div>
      <HolographicPlanet />
      <div className="relative z-10 main-container">
        <HorizontalNav />
        <main className="pt-24">
          {/* PitchPoint Header */}
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 backdrop-blur-sm">
            <div className="flex items-center justify-between px-8 py-6 mt-4">
              <div>
                <h1 className="text-3xl font-bold text-balance text-black dark:text-white">
                  {"Pitch"}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22c55e] to-cyan-300 animate-pulse">{"Point"}</span>
                </h1>
                <p className="text-black dark:text-gray-300 mt-2">{"Perfect your pitch and presentation skills"}</p>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {"Help"}
                </Button>
                <Button variant="ghost" size="sm" className="text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {"Contact Support"}
                </Button>
                <UpgradeDropdown />
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-[#39d2c0]/30 text-[#39d2c0] hover:bg-[#39d2c0]/40 hover:text-white"
                >
                  {"?"}
                </Button>
              </div>
            </div>
          </header>
          <div className="p-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <Card className="p-12 glass-morphism holographic-hover enhanced-3d-hover gradient-animation gradient-sweep text-center max-w-2xl">
                <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-r from-blue-900/20 to-teal-500/20 rounded-2xl flex items-center justify-center">
                  <Leaf className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl font-bold text-foreground dark:text-white mb-4">Blue Leaf</h1>
                <p className="text-xl text-muted-foreground dark:text-gray-300 mb-8">
                  Sustainable and eco-friendly creative solutions
                </p>
                <div className="flex items-center justify-center gap-3 text-lg text-muted-foreground dark:text-gray-400 mb-8">
                  <Clock className="w-5 h-5" />
                  <span>Features coming soon</span>
                  <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                </div>
                <div className="bg-muted/20 dark:bg-gray-800/50 rounded-lg p-6 text-left">
                  <h3 className="text-lg font-semibold text-foreground dark:text-white mb-3">What to expect:</h3>
                  <ul className="space-y-2 text-muted-foreground dark:text-gray-300">
                    <li>• Carbon footprint tracking</li>
                    <li>• Sustainable design tools</li>
                    <li>• Eco-friendly material library</li>
                    <li>• Green project templates</li>
                    <li>• Environmental impact reports</li>
                  </ul>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

