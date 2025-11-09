'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type SessionData = {
  email: string | null
  calendarEvents: any[]
  hypeos: {
    user: any
    tasks: any[]
    miniWins: any[]
    quests: any[]
    tasksLastDate?: string | null
    allGoals?: any[]
  }
  chat: {
    conversations: any[]
  }
  [key: string]: any
}

type SessionContextType = {
  sessionData: SessionData
  updateEmail: (email: string) => void
  updateCalendarEvents: (events: any[]) => void
  updateHypeOSData: (data: any) => void
  updateChatData: (data: any) => void
  updateSessionData: (key: string, data: any) => void
  clearSession: () => void
  isSessionActive: boolean
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

const INITIAL_DATA: SessionData = {
  email: null,
  calendarEvents: [],
  hypeos: {
    user: null,
    tasks: [],
    miniWins: [],
    quests: []
  },
  chat: {
    conversations: []
  }
}

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [sessionData, setSessionData] = useState<SessionData>(INITIAL_DATA)
  const [mounted, setMounted] = useState(false)
  const [isSessionActive, setIsSessionActive] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    try {
      const stored = localStorage.getItem('dreamscale_session')
      if (stored) {
        const parsedData = JSON.parse(stored)
        setSessionData(parsedData)
        setIsSessionActive(!!parsedData.email)
      }
    } catch (error) {
      console.error('Error loading session:', error)
    }
  }, [])

  useEffect(() => {
    if (mounted && isSessionActive) {
      try {
        console.log('💾 Saving session to localStorage:', sessionData)
        localStorage.setItem('dreamscale_session', JSON.stringify(sessionData))
      } catch (error) {
        console.error('Error saving session:', error)
      }
    }
  }, [sessionData, mounted, isSessionActive])

  const updateEmail = useCallback((email: string) => {
    setSessionData(prev => ({ ...prev, email }))
    setIsSessionActive(true)
  }, [])

  const updateCalendarEvents = useCallback((events: any[]) => {
    setSessionData(prev => ({ 
      ...prev, 
      calendarEvents: events 
    }))
  }, [])

  const updateHypeOSData = useCallback((data: any) => {
    setSessionData(prev => {
      // Deep merge to ensure tasks, miniWins, and other arrays are properly preserved
      const updatedHypeos = {
        ...prev.hypeos,
        ...data,
        // Ensure arrays are properly replaced, not merged
        tasks: data.tasks !== undefined ? data.tasks : prev.hypeos?.tasks,
        miniWins: data.miniWins !== undefined ? data.miniWins : prev.hypeos?.miniWins,
        quests: data.quests !== undefined ? data.quests : prev.hypeos?.quests,
        allGoals: data.allGoals !== undefined ? data.allGoals : prev.hypeos?.allGoals,
        user: data.user !== undefined ? data.user : prev.hypeos?.user
      };
      
      return {
        ...prev,
        hypeos: updatedHypeos
      };
    });
  }, [])

  const updateChatData = useCallback((data: any) => {
    setSessionData(prev => ({ 
      ...prev, 
      chat: { ...prev.chat, ...data }
    }))
  }, [])

  const updateSessionData = useCallback((key: string, data: any) => {
    setSessionData(prev => ({ ...prev, [key]: data }))
  }, [])

  const clearSession = useCallback(() => {
    setSessionData(INITIAL_DATA)
    setIsSessionActive(false)
    localStorage.removeItem('dreamscale_session')
  }, [])

  return (
    <SessionContext.Provider 
      value={{ 
        sessionData, 
        updateEmail, 
        updateCalendarEvents,
        updateHypeOSData,
        updateChatData,
        updateSessionData,
        clearSession,
        isSessionActive
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return context
}

// Safe hook that returns null if not in provider (for optional usage)
export function useSessionSafe() {
  const context = useContext(SessionContext)
  return context
}
