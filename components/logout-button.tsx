'use client'

import { Button } from '@/components/ui/button'
import { useSessionSafe } from '@/lib/session-context'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const sessionContext = useSessionSafe()

  if (!sessionContext || !sessionContext.sessionData.email) return null

  const handleLogout = () => {
    if (window.confirm('Are you sure? All your test data will be cleared.')) {
      sessionContext.clearSession()
      window.location.href = '/'
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  )
}
