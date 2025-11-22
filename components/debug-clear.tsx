"use client"

import { Button } from "@/components/ui/button"
import { clearAllTestData, addTestNotification } from "@/lib/notifications"

export function DebugClear() {
  const handleClear = () => {
    clearAllTestData()
    // Force a page refresh to see the notifications disappear
    window.location.reload()
  }

  const addNotification = (feature: 'discover' | 'bizora' | 'skilldrops' | 'flowmatch' | 'pitchpoint' | 'calendar' | 'hypeos') => {
    addTestNotification(feature)
    // Force a page refresh to see the notification appear
    window.location.reload()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <div className="flex gap-2">
        <Button 
          onClick={() => addNotification('discover')}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Test Discover
        </Button>
        <Button 
          onClick={() => addNotification('bizora')}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Test Bizora
        </Button>
        <Button 
          onClick={() => addNotification('calendar')}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          Test Calendar
        </Button>
      </div>
      <Button 
        onClick={handleClear}
        variant="destructive"
        size="sm"
        className="text-xs w-full"
      >
        Clear All Test Data
      </Button>
    </div>
  )
}
