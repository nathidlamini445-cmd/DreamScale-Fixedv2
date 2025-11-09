import { useEffect } from 'react'
import { useSessionSafe } from './session-context'

/**
 * Convert serialized dates (strings) back to Date objects
 * This is needed because localStorage converts Date objects to strings
 */
export function deserializeDates(obj: any): any {
  if (obj === null || obj === undefined) return obj
  
  if (typeof obj === 'string') {
    // Check if it looks like an ISO date string
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) {
      return new Date(obj)
    }
    return obj
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => deserializeDates(item))
  }
  
  if (typeof obj === 'object') {
    const deserialized: any = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        // Convert timestamp-like fields
        if ((key.includes('date') || key.includes('timestamp') || key.includes('time')) && typeof value === 'string') {
          deserialized[key] = new Date(value)
        } else {
          deserialized[key] = deserializeDates(value)
        }
      }
    }
    return deserialized
  }
  
  return obj
}

/**
 * Hook to save data to a specific session key
 * Usage: useSessionData('myFeature', data)
 */
export function useSaveSessionData(key: string, data: any) {
  const sessionContext = useSessionSafe()

  useEffect(() => {
    if (sessionContext && data !== undefined) {
      console.log(`💾 Saving ${key} to session:`, data)
      sessionContext.updateSessionData(key, data)
    }
  }, [data, key, sessionContext])
}

/**
 * Hook to load data from a specific session key
 * Usage: const data = useLoadSessionData('myFeature')
 */
export function useLoadSessionData(key: string) {
  const sessionContext = useSessionSafe()
  const rawData = sessionContext?.sessionData?.[key]
  
  // Deserialize dates when loading
  return rawData ? deserializeDates(rawData) : undefined
}
