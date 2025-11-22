'use client'

import { HorizontalNav } from "@/components/horizontal-nav"
import DreamPulseWizard from "@/components/dreampulse/DreamPulseWizard"

export default function DreamPulsePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 pt-20 pb-8">
        <DreamPulseWizard />
      </div>
    </div>
  )
}