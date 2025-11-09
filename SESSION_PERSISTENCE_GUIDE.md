# DreamScale Session Persistence Guide

## Overview
All user data now persists across page refreshes within a single session. Data is automatically saved to localStorage and restored on page load. Everything is cleared when the user logs out.

## What Data Persists?

### 📧 Email
- **Where:** Captured on first visit
- **Persists:** Until logout
- **Clears:** On logout

### 📅 Calendar
- **What:** Events, expenses, time balance
- **Where:** `/app/calendar/page.tsx`
- **Persists:** Until logout
- **Auto-save:** Yes (on creation/deletion)

### 🎯 HypeOS
- **What:** User goals, tasks, mini-wins, quests, streaks
- **Where:** `/app/hypeos/page.tsx`
- **Persists:** Until logout
- **Auto-save:** Yes (on task completion)

### 💬 Bizora AI (Chat)
- **What:** Conversation history
- **Where:** `/app/bizora/page.tsx`
- **Persists:** Until logout
- **Auto-save:** Yes (on message send)

### 📚 SkillDrops
- **What:** Completed lessons, progress
- **Where:** `/app/skilldrops/page.tsx`
- **Auto-save:** Using `useSaveSessionData` hook

### 🎨 FlowMatch, Marketplace, Projects
- **Auto-save:** Hooks available for all pages

## How It Works

### 1. Session Provider (`lib/session-context.tsx`)
- Wraps the entire app in `app/layout.tsx`
- Manages session data in React Context
- Auto-saves to localStorage when data changes
- Auto-loads from localStorage on app start

### 2. Session Storage Structure
```typescript
SessionData = {
  email: string | null
  calendarEvents: any[]
  hypeos: {
    user: any
    tasks: any[]
    miniWins: any[]
    quests: any[]
  }
  chat: {
    conversations: any[]
  }
  [key: string]: any  // Custom data
}
```

### 3. Using Session in Pages

#### Option A: Direct Context (Full Control)
```typescript
import { useSessionSafe } from '@/lib/session-context'

const sessionContext = useSessionSafe()

// Load
useEffect(() => {
  if (sessionContext?.sessionData?.myData) {
    setData(sessionContext.sessionData.myData)
  }
}, [sessionContext?.sessionData?.myData])

// Save
useEffect(() => {
  if (sessionContext && myData) {
    sessionContext.updateSessionData('myData', myData)
  }
}, [myData, sessionContext])
```

#### Option B: Custom Hooks (Easy!)
```typescript
import { useSaveSessionData, useLoadSessionData } from '@/lib/session-hooks'

// Load data
const myData = useLoadSessionData('myData')

// Auto-save data
useSaveSessionData('myData', myData)
```

## Logout Flow

1. User clicks "Logout" button
2. `clearSession()` is called
3. All session data is cleared
4. localStorage is emptied
5. User redirected to home page
6. Email modal appears for new session

## Debugging

### Check Browser DevTools
1. Open DevTools → Application → Local Storage
2. Look for key: `dreamscale_session`
3. View saved JSON data

### Check Console
The system logs all save/load operations:
```
💾 Saving session to localStorage: {...}
💾 Saving Bizora conversations to session: [...]
Loading Bizora conversations from session: [...]
```

### Force Clear Session
```javascript
// In browser console
localStorage.removeItem('dreamscale_session')
location.reload()
```

## Testing Checklist

- [ ] Enter email → Session starts
- [ ] Create calendar event → Refresh page → Event still there
- [ ] Create HypeOS goal → Refresh page → Goal still there
- [ ] Create Bizora chat → Refresh page → Chat still there
- [ ] Navigate to different pages → Return → Data persists
- [ ] Click Logout → Confirm → All data cleared
- [ ] Try accessing after logout → Email modal appears

## Environment Variables

To enable email notifications:
```bash
GEMINI_API_KEY=your_gemini_key
RESEND_API_KEY=your_resend_key  # or SENDGRID_API_KEY
```

## File Structure

```
lib/
├── session-context.tsx      # Main provider & hooks
├── session-hooks.ts         # Utility hooks for pages
└── ...

app/
├── layout.tsx               # Wrapped with SessionProvider
├── page.tsx                 # Dashboard with session UI
├── calendar/page.tsx        # Auto-saves events
├── bizora/page.tsx          # Auto-saves chats
├── hypeos/page.tsx          # Auto-saves goals
└── api/send-welcome-email/  # Email with Gemini
```

## Common Issues & Solutions

### Problem: Data disappears after refresh
**Solution:** Check browser console for errors, verify localStorage is enabled

### Problem: Chats/events not saving
**Solution:** 
1. Open DevTools Console
2. Look for error messages
3. Verify sessionContext is not null
4. Check `conversationHistory` state

### Problem: Logout not clearing data
**Solution:**
1. Manually clear: `localStorage.removeItem('dreamscale_session')`
2. Hard refresh: Ctrl+Shift+Delete

## Future Enhancements

- [ ] Backend sync (save to database)
- [ ] Real-time sync across tabs
- [ ] Session encryption
- [ ] Auto-logout timeout
- [ ] Session recovery
- [ ] Export session data
