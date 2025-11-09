// Notification system for showing badges when there are actual reminders/tasks

export interface NotificationData {
  hasCalendarReminders: boolean
  hasTaskReminders: boolean
  hasChatNotifications: boolean
  hasWorkflowNotifications: boolean
}

export interface FeatureNotifications {
  discover: boolean
  bizora: boolean
  skilldrops: boolean
  flowmatch: boolean
  pitchpoint: boolean
  calendar: boolean
  hypeos: boolean
}

// Track which features have been "seen" by the user
export function markFeatureAsSeen(feature: keyof FeatureNotifications) {
  if (typeof window === 'undefined') return
  
  const seenFeatures = getSeenFeatures()
  seenFeatures[feature] = true
  localStorage.setItem('dreamscale:seen-features', JSON.stringify(seenFeatures))
}

// Get which features have been seen
export function getSeenFeatures(): FeatureNotifications {
  if (typeof window === 'undefined') {
    return {
      discover: false,
      bizora: false,
      skilldrops: false,
      flowmatch: false,
      pitchpoint: false,
      calendar: false,
      hypeos: false,
    }
  }
  
  const stored = localStorage.getItem('dreamscale:seen-features')
  return stored ? JSON.parse(stored) : {
    discover: false,
    bizora: false,
    skilldrops: false,
    flowmatch: false,
    pitchpoint: false,
    calendar: false,
    hypeos: false,
  }
}

// Check if a feature has updates that haven't been seen
export function hasUnseenUpdates(feature: keyof FeatureNotifications): boolean {
  const seenFeatures = getSeenFeatures()
  const hasUpdates = checkForUpdates(feature)
  
  return hasUpdates && !seenFeatures[feature]
}

// Check if a specific feature has updates
function checkForUpdates(feature: keyof FeatureNotifications): boolean {
  const now = new Date()
  
  switch (feature) {
    case 'discover':
    case 'skilldrops':
    case 'pitchpoint':
      // Check for task reminders
      const storedTasks = typeof window !== 'undefined' 
        ? localStorage.getItem('dreamscale:tasks') 
        : null
      return storedTasks 
        ? JSON.parse(storedTasks).some((t: any) => t.urgent === true || t.priority === 'high' || t.dueToday === true)
        : false
        
    case 'bizora':
      // Check for chat notifications
      const storedChats = typeof window !== 'undefined' 
        ? localStorage.getItem('bizora:conversations') 
        : null
      return storedChats 
        ? JSON.parse(storedChats).some((c: any) => c.unread === true || c.needsResponse === true)
        : false
        
    case 'calendar':
      // Check for calendar reminders
      const storedReminders = typeof window !== 'undefined' 
        ? localStorage.getItem('dreamscale:reminders') 
        : null
      return storedReminders 
        ? JSON.parse(storedReminders).some((r: any) => r.urgent === true || r.priority === 'high')
        : false
        
    case 'hypeos':
    case 'flowmatch':
      // Check for workflow notifications
      const storedWorkflows = typeof window !== 'undefined' 
        ? localStorage.getItem('dreamscale:workflows') 
        : null
      return storedWorkflows 
        ? JSON.parse(storedWorkflows).some((w: any) => w.urgent === true || w.priority === 'high')
        : false
        
    default:
      return false
  }
}

// Mock function to check for actual notifications
// In a real app, this would check your backend/database for pending reminders
export function getNotificationStatus(): NotificationData {
  // For now, return false for all - notifications will only show when there are actual urgent reminders
  // You can modify this to check localStorage, API calls, or other data sources
  
  const now = new Date()
  const today = now.toDateString()
  
  // Check localStorage for any stored reminders/tasks that are URGENT
  const storedReminders = typeof window !== 'undefined' 
    ? localStorage.getItem('dreamscale:reminders') 
    : null
  
  const storedTasks = typeof window !== 'undefined' 
    ? localStorage.getItem('dreamscale:tasks') 
    : null
  
  const storedChats = typeof window !== 'undefined' 
    ? localStorage.getItem('bizora:conversations') 
    : null
  
  // Only show notifications for URGENT items or items that need immediate attention
  const hasUrgentReminders = storedReminders 
    ? JSON.parse(storedReminders).some((r: any) => r.urgent === true || r.priority === 'high')
    : false
    
  const hasUrgentTasks = storedTasks 
    ? JSON.parse(storedTasks).some((t: any) => t.urgent === true || t.priority === 'high' || t.dueToday === true)
    : false
    
  const hasUnreadChats = storedChats 
    ? JSON.parse(storedChats).some((c: any) => c.unread === true || c.needsResponse === true)
    : false
  
  // Debug logging to see what's happening
  if (typeof window !== 'undefined') {
    console.log('Notification check:', {
      storedReminders: storedReminders ? JSON.parse(storedReminders) : null,
      storedTasks: storedTasks ? JSON.parse(storedTasks) : null,
      storedChats: storedChats ? JSON.parse(storedChats) : null,
      hasUrgentReminders,
      hasUrgentTasks,
      hasUnreadChats
    })
  }
  
  return {
    hasCalendarReminders: hasUrgentReminders,
    hasTaskReminders: hasUrgentTasks,
    hasChatNotifications: hasUnreadChats,
    hasWorkflowNotifications: false, // Add logic for workflow notifications
  }
}

// Helper function to add a reminder (for testing)
export function addTestReminder(type: 'calendar' | 'task' | 'chat') {
  if (typeof window === 'undefined') return
  
  const key = `dreamscale:${type === 'chat' ? 'conversations' : type + 's'}`
  const existing = localStorage.getItem(key)
  const data = existing ? JSON.parse(existing) : []
  
  const newItem = {
    id: Date.now().toString(),
    title: `URGENT: ${type} reminder`,
    timestamp: new Date().toISOString(),
    urgent: true,
    priority: 'high',
    dueToday: type === 'task',
    unread: type === 'chat',
    needsResponse: type === 'chat'
  }
  
  data.push(newItem)
  localStorage.setItem(key, JSON.stringify(data))
}

// Helper function to clear notifications
export function clearNotifications(type: 'calendar' | 'task' | 'chat') {
  if (typeof window === 'undefined') return
  
  const key = `dreamscale:${type === 'chat' ? 'conversations' : type + 's'}`
  localStorage.removeItem(key)
}

// Helper function to clear ALL test data
export function clearAllTestData() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('dreamscale:reminders')
  localStorage.removeItem('dreamscale:tasks')
  localStorage.removeItem('bizora:conversations')
  localStorage.removeItem('dreamscale:workflows')
  localStorage.removeItem('dreamscale:seen-features')
  console.log('All test data cleared')
}

// Helper function to add test notifications for demonstration
export function addTestNotification(feature: keyof FeatureNotifications) {
  if (typeof window === 'undefined') return
  
  const now = new Date().toISOString()
  
  switch (feature) {
    case 'discover':
    case 'skilldrops':
    case 'pitchpoint':
      const tasks = JSON.parse(localStorage.getItem('dreamscale:tasks') || '[]')
      tasks.push({
        id: Date.now().toString(),
        title: `URGENT: New ${feature} update`,
        urgent: true,
        priority: 'high',
        dueToday: true,
        timestamp: now
      })
      localStorage.setItem('dreamscale:tasks', JSON.stringify(tasks))
      break
      
    case 'bizora':
      const chats = JSON.parse(localStorage.getItem('bizora:conversations') || '[]')
      chats.push({
        id: Date.now().toString(),
        title: `New chat notification`,
        unread: true,
        needsResponse: true,
        timestamp: now
      })
      localStorage.setItem('bizora:conversations', JSON.stringify(chats))
      break
      
    case 'calendar':
      const reminders = JSON.parse(localStorage.getItem('dreamscale:reminders') || '[]')
      reminders.push({
        id: Date.now().toString(),
        title: `URGENT: Calendar reminder`,
        urgent: true,
        priority: 'high',
        timestamp: now
      })
      localStorage.setItem('dreamscale:reminders', JSON.stringify(reminders))
      break
      
    case 'hypeos':
    case 'flowmatch':
      const workflows = JSON.parse(localStorage.getItem('dreamscale:workflows') || '[]')
      workflows.push({
        id: Date.now().toString(),
        title: `URGENT: ${feature} workflow update`,
        urgent: true,
        priority: 'high',
        timestamp: now
      })
      localStorage.setItem('dreamscale:workflows', JSON.stringify(workflows))
      break
  }
  
  // Reset the "seen" status so notifications appear
  const seenFeatures = getSeenFeatures()
  seenFeatures[feature] = false
  localStorage.setItem('dreamscale:seen-features', JSON.stringify(seenFeatures))
}
