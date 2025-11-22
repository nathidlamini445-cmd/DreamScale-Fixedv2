"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, Plus, ArrowLeft, Clock, MapPin, Users, AlignLeft, Smile, Sparkles, Flame, Heart, Zap, Brain, Coffee, Trash2, Wallet, TrendingUp, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useSessionSafe } from "@/lib/session-context"

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

type ViewMode = 'day' | 'week' | 'month'

// Personal Time Balance types
type BalanceCategory = 'work' | 'rest' | 'exercise' | 'family' | 'learning' | 'social'

interface TimeBalance {
  category: BalanceCategory
  hours: number
  color: string
  bgColor: string
  label: string
  icon: React.ReactNode
  targetHours: number
}

// Money & Time Sync types
interface EventExpense {
  id: string
  eventTitle: string
  amount: number
  currency: string
  category: string
  date: string
  description?: string
}

const BALANCE_CATEGORIES: Record<BalanceCategory, Omit<TimeBalance, 'hours'>> = {
  work: {
    category: 'work',
    color: '#3b82f6',
    bgColor: 'bg-blue-100',
    label: 'Work',
    icon: <Brain className="h-4 w-4" />,
    targetHours: 40
  },
  rest: {
    category: 'rest',
    color: '#06b6d4',
    bgColor: 'bg-cyan-100',
    label: 'Rest',
    icon: <Smile className="h-4 w-4" />,
    targetHours: 56
  },
  exercise: {
    category: 'exercise',
    color: '#f97316',
    bgColor: 'bg-orange-100',
    label: 'Exercise',
    icon: <Zap className="h-4 w-4" />,
    targetHours: 5
  },
  family: {
    category: 'family',
    color: '#a855f7',
    bgColor: 'bg-purple-100',
    label: 'Family',
    icon: <Heart className="h-4 w-4" />,
    targetHours: 20
  },
  learning: {
    category: 'learning',
    color: '#eab308',
    bgColor: 'bg-yellow-100',
    label: 'Learning',
    icon: <Sparkles className="h-4 w-4" />,
    targetHours: 10
  },
  social: {
    category: 'social',
    color: '#10b981',
    bgColor: 'bg-emerald-100',
    label: 'Social',
    icon: <Coffee className="h-4 w-4" />,
    targetHours: 7
  }
}

export default function CalendarPage() {
  const sessionContext = useSessionSafe()
  const { sessionData, updateCalendarEvents } = sessionContext || {
    sessionData: { calendarEvents: [] },
    updateCalendarEvents: () => {}
  }
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  
  // Personal Time Balance state
  const [timeBalance, setTimeBalance] = useState<Record<BalanceCategory, number>>({
    work: 0,
    rest: 0,
    exercise: 0,
    family: 0,
    learning: 0,
    social: 0
  })
  
  // Money & Time Sync state
  const [expenses, setExpenses] = useState<EventExpense[]>([])
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false)
  
  // Expense form state
  const [expenseAmount, setExpenseAmount] = useState("")
  const [expenseCategory, setExpenseCategory] = useState("")
  const [expenseDescription, setExpenseDescription] = useState("")
  const [selectedExpenseEvent, setSelectedExpenseEvent] = useState("")
  
  // Event form state
  const [eventTitle, setEventTitle] = useState("")
  const [eventDate, setEventDate] = useState("")
  const [eventTime, setEventTime] = useState("")
  const [eventDescription, setEventDescription] = useState("")
  const [eventLocation, setEventLocation] = useState("")
  const [eventAttendees, setEventAttendees] = useState("")
  
  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Load calendar events from session on mount
  useEffect(() => {
    if (sessionData?.calendarEvents && sessionData.calendarEvents.length > 0) {
      setEvents(sessionData.calendarEvents)
    }
  }, [sessionData?.calendarEvents])

  // Save events to session whenever they change (only if session context exists)
  useEffect(() => {
    if (sessionContext && events.length > 0) {
      updateCalendarEvents(events)
    }
  }, [events])

  // Get first day of the month and how many days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Get days from previous month to fill the grid
  const daysFromPrevMonth = new Date(currentYear, currentMonth, 0).getDate()

  const handleCreateEvent = () => {
    if (!eventTitle || !eventDate || !eventTime) {
      alert("Please fill in the required fields (Title, Date, Time)")
      return
    }

    const newEvent = {
      id: Date.now(),
      title: eventTitle,
      date: eventDate,
      time: eventTime,
      description: eventDescription,
      location: eventLocation,
      attendees: eventAttendees.split(',').map(email => email.trim()).filter(email => email)
    }

    setEvents(prev => [...prev, newEvent])
    
    // Categorize event and update time balance
    const category = categorizeEvent(eventTitle, eventDescription)
    const duration = calculateEventDuration(eventTime)
    
    setTimeBalance(prev => ({
      ...prev,
      [category]: prev[category] + duration
    }))
    
    // Reset form
    setEventTitle("")
    setEventDate("")
    setEventTime("")
    setEventDescription("")
    setEventLocation("")
    setEventAttendees("")
    setIsEventModalOpen(false)
    
    console.log("Event created successfully:", newEvent)
    console.log("Categorized as:", category, "Duration:", duration, "hours")
  }

  const handleDeleteEvent = (eventId: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      const eventToDelete = events.find(event => event.id === eventId)
      if (eventToDelete) {
        // Remove from time balance
        const category = categorizeEvent(eventToDelete.title, eventToDelete.description)
        const duration = calculateEventDuration(eventToDelete.time)
        
        setTimeBalance(prev => ({
          ...prev,
          [category]: Math.max(0, prev[category] - duration)
        }))
        
        // Remove from expenses if any exist for this event
        setExpenses(prev => prev.filter(expense => expense.eventTitle !== eventToDelete.title))
      }
      
      setEvents(prev => prev.filter(event => event.id !== eventId))
    }
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const isToday = (day: number) => {
    return today.getDate() === day && 
           today.getMonth() === currentMonth && 
           today.getFullYear() === currentYear
  }

  // Event categorization for time balance
  const categorizeEvent = (title: string, description: string): BalanceCategory => {
    const text = `${title} ${description}`.toLowerCase()
    
    // Work-related keywords
    if (
      text.includes('meeting') || 
      text.includes('work') || 
      text.includes('client') || 
      text.includes('project') || 
      text.includes('presentation') || 
      text.includes('conference') || 
      text.includes('office') || 
      text.includes('deadline') || 
      text.includes('standup') || 
      text.includes('sprint') || 
      text.includes('review') ||
      text.includes('call') ||
      text.includes('sync') ||
      text.includes('team') ||
      text.includes('business') ||
      text.includes('boss') ||
      text.includes('colleague') ||
      text.includes('zoom') ||
      text.includes('interview') ||
      text.includes('email') ||
      text.includes('report') ||
      text.includes('task') ||
      text.includes('job') ||
      text.includes('shift') ||
      text.includes('editing') ||
      text.includes('filming') ||
      text.includes('recording') ||
      text.includes('writing') ||
      text.includes('designing') ||
      text.includes('brainstorming') ||
      text.includes('brainstorm') ||
      text.includes('collaboration') ||
      text.includes('research') ||
      text.includes('planning') ||
      text.includes('organizing') ||
      text.includes('producing') ||
      text.includes('animation') ||
      text.includes('coding') ||
      text.includes('developing') ||
      text.includes('rendering') ||
      text.includes('scripting') ||
      text.includes('reviewing') ||
      text.includes('content creation') ||
      text.includes('strategy session') ||
      text.includes('strategy') ||
      text.includes('marketing') ||
      text.includes('post-production') ||
      text.includes('pitching') ||
      text.includes('pitch') ||
      text.includes('networking') ||
      text.includes('workshop')
    ) {
      return 'work'
    }
    
    // Exercise keywords
    if (
      text.includes('gym') || 
      text.includes('workout') || 
      text.includes('exercise') || 
      text.includes('run') || 
      text.includes('yoga') || 
      text.includes('fitness') || 
      text.includes('training') || 
      text.includes('sport') || 
      text.includes('swim') || 
      text.includes('cycling') || 
      text.includes('hiking') ||
      text.includes('jog') ||
      text.includes('crossfit') ||
      text.includes('pilates')
    ) {
      return 'exercise'
    }
    
    // Family keywords
    if (
      text.includes('family') || 
      text.includes('kids') || 
      text.includes('children') || 
      text.includes('mom') || 
      text.includes('dad') || 
      text.includes('parent') || 
      text.includes('dinner') || 
      text.includes('birthday') || 
      text.includes('anniversary') || 
      text.includes('visit') ||
      text.includes('baby') ||
      text.includes('son') ||
      text.includes('daughter') ||
      text.includes('spouse') ||
      text.includes('wife') ||
      text.includes('husband')
    ) {
      return 'family'
    }
    
    // Learning keywords
    if (
      text.includes('class') || 
      text.includes('course') || 
      text.includes('study') || 
      text.includes('learn') || 
      text.includes('tutorial') || 
      text.includes('workshop') || 
      text.includes('seminar') || 
      text.includes('lecture') || 
      text.includes('book') || 
      text.includes('reading') ||
      text.includes('lesson') ||
      text.includes('training') ||
      text.includes('education') ||
      text.includes('school')
    ) {
      return 'learning'
    }
    
    // Social keywords
    if (
      text.includes('friend') || 
      text.includes('party') || 
      text.includes('coffee') || 
      text.includes('lunch') || 
      text.includes('hangout') || 
      text.includes('social') || 
      text.includes('drinks') || 
      text.includes('brunch') || 
      text.includes('catch up') || 
      text.includes('movie') ||
      text.includes('date') ||
      text.includes('dinner out') ||
      text.includes('bar') ||
      text.includes('pub') ||
      text.includes('game night')
    ) {
      return 'social'
    }
    
    // Default to rest
    return 'rest'
  }

  // Calculate event duration in hours
  const calculateEventDuration = (timeString: string): number => {
    if (timeString.includes('-')) {
      const [start, end] = timeString.split('-').map(t => t.trim())
      const startHour = parseTimeToHours(start)
      const endHour = parseTimeToHours(end)
      return Math.max(0.5, endHour - startHour)
    }
    return 1
  }

  const parseTimeToHours = (timeStr: string): number => {
    const isPM = timeStr.toLowerCase().includes('pm')
    const isAM = timeStr.toLowerCase().includes('am')
    const cleanTime = timeStr.replace(/am|pm/gi, '').trim()
    const [hourStr, minuteStr] = cleanTime.split(':')
    
    let hour = parseInt(hourStr)
    const minute = minuteStr ? parseInt(minuteStr) : 0
    
    if (isPM && hour !== 12) {
      hour += 12
    } else if (isAM && hour === 12) {
      hour = 0
    }
    
    return hour + (minute / 60)
  }

  // Money & Time Sync functions
  const handleCreateExpense = () => {
    if (!expenseAmount.trim() || !selectedExpenseEvent) {
      return
    }

    const newExpense: EventExpense = {
      id: Date.now().toString(),
      eventTitle: selectedExpenseEvent,
      amount: parseFloat(expenseAmount),
      currency: 'R',
      category: expenseCategory || 'General',
      date: new Date().toISOString().split('T')[0],
      description: expenseDescription
    }

    setExpenses(prev => [newExpense, ...prev])
    
    setExpenseAmount("")
    setExpenseCategory("")
    setExpenseDescription("")
    setSelectedExpenseEvent("")
    setIsExpenseModalOpen(false)
  }

  const handleDeleteExpense = (expenseId: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId))
  }

  const getWeeklyExpenses = () => {
    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    return expenses
      .filter(expense => new Date(expense.date) >= weekAgo)
      .reduce((sum, expense) => sum + expense.amount, 0)
  }

  const getTotalHours = () => {
    return Object.values(timeBalance).reduce((sum, hours) => sum + hours, 0)
  }

  const getBalancePercentage = (category: BalanceCategory) => {
    const total = getTotalHours()
    return total > 0 ? (timeBalance[category] / total) * 100 : 0
  }

  const isBalanceHealthy = (category: BalanceCategory) => {
    const current = timeBalance[category]
    const target = BALANCE_CATEGORIES[category].targetHours
    const difference = Math.abs(current - target)
    return difference <= target * 0.2
  }

  const getEventsForDay = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return []
    
    const dayString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const dayEvents = events.filter(event => event.date === dayString)
    
    if (dayEvents.length > 0) {
      console.log(`Events for ${dayString}:`, dayEvents)
    }
    
    return dayEvents
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setIsEventDetailsOpen(true)
  }

  const calendarDays = []
  
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysFromPrevMonth - i,
      isCurrentMonth: false,
      isPrevMonth: true
    })
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      isPrevMonth: false
    })
  }
  
  const remainingCells = 42 - calendarDays.length
  for (let day = 1; day <= remainingCells; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      isPrevMonth: false
    })
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="relative z-10 main-container">
        <main className="pt-8">
          {/* Calendar Header */}
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 backdrop-blur-sm">
            <div className="flex items-center justify-between px-8 py-6">
              <div className="flex items-center gap-6">
                <Link href="/" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                  <span className="font-medium">Back to Home</span>
                </Link>
                <div>
                  <h1 className="text-3xl font-bold text-balance text-black dark:text-white">
                    {"My "}
                    <span className="text-blue-900 dark:text-blue-400 font-bold">{"Calendar"}</span>
                  </h1>
                  <p className="text-black dark:text-gray-300 mt-2">{"Organize your schedule and events"}</p>
                </div>
                <Button
                  onClick={goToToday}
                  variant="outline"
                  className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  Today
                </Button>
              </div>
            </div>
          </header>

          <div className="p-8">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('prev')}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 min-w-[200px]">
                  {viewMode === 'day' && `${MONTHS[currentMonth]} ${currentDate.getDate()}, ${currentYear}`}
                  {viewMode === 'week' && `Week of ${MONTHS[currentMonth]} ${currentDate.getDate()}, ${currentYear}`}
                  {viewMode === 'month' && `${MONTHS[currentMonth]} ${currentYear}`}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigateMonth('next')}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/20"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'day' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('day')}
                    className={cn(
                      "px-4",
                      viewMode === 'day' && "bg-white dark:bg-slate-900 shadow-sm"
                    )}
                  >
                    Day
                  </Button>
                  <Button
                    variant={viewMode === 'week' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('week')}
                    className={cn(
                      "px-4",
                      viewMode === 'week' && "bg-white dark:bg-slate-900 shadow-sm"
                    )}
                  >
                    Week
                  </Button>
                  <Button
                    variant={viewMode === 'month' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('month')}
                    className={cn(
                      "px-4",
                      viewMode === 'month' && "bg-white dark:bg-slate-900 shadow-sm"
                    )}
                  >
                    Month
                  </Button>
                </div>
              </div>
              
              <Dialog open={isEventModalOpen} onOpenChange={setIsEventModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Event Title */}
                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        <AlignLeft className="w-4 h-4" />
                        Event Title *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Enter event title..."
                        value={eventTitle}
                        onChange={(e) => setEventTitle(e.target.value)}
                        className="w-full"
                      />
                    </div>

                    {/* Date and Time */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="time" className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Time *
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        placeholder="Enter event location..."
                        value={eventLocation}
                        onChange={(e) => setEventLocation(e.target.value)}
                      />
                    </div>

                    {/* Attendees */}
                    <div className="space-y-2">
                      <Label htmlFor="attendees" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Attendees (Email addresses)
                      </Label>
                      <Input
                        id="attendees"
                        placeholder="Enter email addresses separated by commas..."
                        value={eventAttendees}
                        onChange={(e) => setEventAttendees(e.target.value)}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Enter event description..."
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsEventModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateEvent}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Create Event
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Calendar Views - Month View */}
            {viewMode === 'month' && (
            <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
              <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                {DAYS_OF_WEEK.map((day) => (
                  <div
                    key={day}
                    className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                  {calendarDays.map((dayInfo, index) => {
                    return (
                  <div
                    key={index}
                    className={cn(
                        "h-32 border-r border-b border-gray-200 dark:border-gray-700 p-2 relative hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors flex flex-col",
                      !dayInfo.isCurrentMonth && "bg-gray-50/50 dark:bg-gray-800/50",
                        isToday(dayInfo.day) && dayInfo.isCurrentMonth && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                      <div className="flex items-center justify-between mb-1">
                    <div
                      className={cn(
                        "w-8 h-8 flex items-center justify-center text-sm rounded-full",
                        !dayInfo.isCurrentMonth && "text-gray-400 dark:text-gray-600",
                        dayInfo.isCurrentMonth && "text-gray-900 dark:text-gray-100",
                        isToday(dayInfo.day) && dayInfo.isCurrentMonth && "bg-blue-600 text-white font-medium"
                      )}
                    >
                      {dayInfo.day}
                    </div>
                      </div>
                      
                      <div className="mt-2 space-y-1 flex-1 overflow-hidden">
                        {getEventsForDay(dayInfo.day, dayInfo.isCurrentMonth).slice(0, 3).map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded cursor-pointer transition-colors truncate font-medium shadow-sm"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {getEventsForDay(dayInfo.day, dayInfo.isCurrentMonth).length > 3 && (
                          <div className="bg-gray-500 text-white text-xs px-2 py-1 rounded font-medium">
                            +{getEventsForDay(dayInfo.day, dayInfo.isCurrentMonth).length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  )})}
                </div>
              </div>
            )}

            {/* Week View */}
            {viewMode === 'week' && (
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200">
                  <div className="p-4 border-r border-gray-600 bg-slate-800"></div>
                  {(() => {
                    const weekStart = new Date(currentDate)
                    weekStart.setDate(currentDate.getDate() - currentDate.getDay())
                    return Array.from({ length: 7 }, (_, i) => {
                      const date = new Date(weekStart)
                      date.setDate(weekStart.getDate() + i)
                      return (
                        <div key={i} className="p-4 text-center border-r border-gray-600 last:border-r-0 bg-slate-800">
                          <div className="text-xs font-medium text-gray-400 uppercase">
                            {DAYS_OF_WEEK[i]}
                          </div>
                          <div className={cn(
                            "text-2xl font-semibold mt-1",
                            date.toDateString() === today.toDateString() ? "text-blue-400" : "text-white"
                          )}>
                            {date.getDate()}
                          </div>
                        </div>
                      )
                    })
                  })()}
                </div>
                <div className="overflow-y-auto max-h-[600px]">
                  {Array.from({ length: 24 }, (_, hour) => (
                    <div key={hour} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-700 last:border-b-0">
                      <div className="p-3 border-r border-gray-600 bg-slate-800 text-right">
                        <span className="text-xs font-medium text-gray-300">
                          {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                        </span>
                      </div>
                      {(() => {
                        const weekStart = new Date(currentDate)
                        weekStart.setDate(currentDate.getDate() - currentDate.getDay())
                        return Array.from({ length: 7 }, (_, dayIndex) => {
                          const date = new Date(weekStart)
                          date.setDate(weekStart.getDate() + dayIndex)
                          const dayString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
                          const dayEvents = events.filter(event => {
                            if (event.date !== dayString) return false
                            const eventHour = parseInt(event.time.split(':')[0])
                            const isPM = event.time.toLowerCase().includes('pm')
                            const isAM = event.time.toLowerCase().includes('am')
                            let adjustedHour = eventHour
                            if (isPM && eventHour !== 12) adjustedHour += 12
                            if (isAM && eventHour === 12) adjustedHour = 0
                            return adjustedHour === hour
                          })
                          
                          return (
                            <div key={dayIndex} className="min-h-[60px] border-r border-gray-700 last:border-r-0 p-2 hover:bg-slate-700 transition-colors relative">
                              {dayEvents.map((event) => (
                                <div
                                  key={event.id}
                                  onClick={() => handleEventClick(event)}
                                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md cursor-pointer transition-all shadow-sm hover:shadow-md mb-1 text-xs"
                                >
                                  <div className="font-semibold truncate">{event.title}</div>
                                  <div className="opacity-90">{event.time}</div>
                                </div>
                              ))}
                            </div>
                          )
                        })
                      })()}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Day View */}
            {viewMode === 'day' && (
              <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-600 bg-slate-800 p-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-400 uppercase">
                      {DAYS_OF_WEEK[currentDate.getDay()]}
                    </div>
                    <div className="text-4xl font-bold text-white mt-2">
                      {currentDate.getDate()}
                    </div>
                    <div className="text-sm text-gray-300 mt-1">
                      {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  {(() => {
                    const dayString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
                    const dayEvents = events.filter(event => event.date === dayString).sort((a, b) => a.time.localeCompare(b.time))
                    
                    return dayEvents.length > 0 ? (
                      <div className="space-y-4">
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 p-6 rounded-xl cursor-pointer transition-all hover:shadow-md"
                          >
                            <div className="flex items-start gap-4">
                              <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center min-w-[80px]">
                                <div className="text-sm font-bold">{event.time}</div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                                {event.location && (
                                  <div className="flex items-center gap-2 mt-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">{event.location}</span>
                                  </div>
                                )}
                                {event.description && (
                                  <p className="text-gray-700 mt-3">{event.description}</p>
                                )}
                                {event.attendees.length > 0 && (
                                  <div className="flex items-center gap-2 mt-3 text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span className="text-sm">{event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}</span>
                                  </div>
                                )}
                              </div>
                    </div>
                  </div>
                ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 text-gray-500">
                        <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium">No events scheduled for this day</p>
                        <p className="text-sm mt-1">Click "Create Event" to add one</p>
                      </div>
                    )
                  })()}
              </div>
            </div>
            )}

            {/* Events List */}
            {events.length > 0 ? (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Events</h3>
                <div className="space-y-3">
                  {events.map((event) => (
                    <div key={event.id} className="bg-gray-800 dark:bg-gray-800 border border-gray-600 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-100 dark:text-gray-100">{event.title}</h4>
                          <p className="text-sm text-gray-300 dark:text-gray-300 mt-1">
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </p>
                          {event.location && (
                            <p className="text-sm text-gray-400 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {event.location}
                            </p>
                          )}
                          {event.description && (
                            <p className="text-sm text-gray-300 dark:text-gray-300 mt-2">{event.description}</p>
                          )}
                          {event.attendees.length > 0 && (
                            <p className="text-sm text-gray-400 dark:text-gray-400 flex items-center gap-1 mt-1">
                              <Users className="w-3 h-3" />
                              {event.attendees.length} attendee{event.attendees.length > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="ml-4 p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors"
                          title="Delete event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center mt-8 text-gray-500">
                <p className="text-lg">No events scheduled</p>
                <p className="text-sm mt-1">Click "Create Event" to add your first event</p>
              </div>
            )}

          {/* Money & Time Sync Section */}
          <div className="mt-12 pb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-blue-400" />
                  Money & Time Sync
                </h2>
                <p className="text-sm text-gray-500 mt-1">Track how much you're spending on time-related events</p>
              </div>
              <Dialog open={isExpenseModalOpen} onOpenChange={setIsExpenseModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-gray-900">Track Event Expense 💰</DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">Log how much this event cost you</p>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {/* Event Selection */}
                    <div className="space-y-2">
                      <Label htmlFor="expense-event">Event *</Label>
                      <select
                        id="expense-event"
                        value={selectedExpenseEvent}
                        onChange={(e) => setSelectedExpenseEvent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        disabled={events.length === 0}
                      >
                        <option value="">
                          {events.length === 0 ? "Create an event first..." : "Select an event..."}
                        </option>
                        {events.map((event) => (
                          <option key={event.id} value={event.title}>
                            {event.title} - {new Date(event.date).toLocaleDateString()}
                          </option>
                        ))}
                      </select>
                      {events.length === 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Create some calendar events first, then you can track their expenses here.
                        </p>
                      )}
                    </div>

                    {/* Amount */}
                    <div className="space-y-2">
                      <Label htmlFor="expense-amount">Amount (R) *</Label>
                      <Input
                        id="expense-amount"
                        type="number"
                        placeholder="e.g., 340"
                        value={expenseAmount}
                        onChange={(e) => setExpenseAmount(e.target.value)}
                      />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                      <Label htmlFor="expense-category">Category</Label>
                      <Input
                        id="expense-category"
                        placeholder="e.g., Transport, Gym, Meeting, etc."
                        value={expenseCategory}
                        onChange={(e) => setExpenseCategory(e.target.value)}
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="expense-description">Notes (Optional)</Label>
                      <Textarea
                        id="expense-description"
                        placeholder="Any additional details..."
                        value={expenseDescription}
                        onChange={(e) => setExpenseDescription(e.target.value)}
                        className="w-full min-h-[80px] resize-none"
                      />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsExpenseModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleCreateExpense}
                        className="flex-1 bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950"
                      >
                        Add Expense
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Weekly Summary Card */}
            <div className="bg-slate-900/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-400" />
                    This Week's Total
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Events cost you</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-gray-900">
                    R{getWeeklyExpenses().toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{expenses.filter(e => {
                    const now = new Date()
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    return new Date(e.date) >= weekAgo
                  }).length} expenses tracked</p>
                </div>
              </div>
            </div>

            {/* Expenses List */}
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-white dark:bg-slate-900 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-green-400 hover:shadow-md transition-all duration-200 group relative"
                >
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="absolute top-4 right-4 p-2 rounded-lg bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all duration-200"
                    title="Delete expense"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <div className="flex items-start justify-between pr-10">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {expense.eventTitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {expense.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(expense.date).toLocaleDateString()}
                        </span>
                      </div>
                      {expense.description && (
                        <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">
                        {expense.currency}{expense.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {expenses.length === 0 && (
              <div className="text-center py-16 bg-slate-900/95 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-200">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="h-10 w-10" style={{ color: '#39d2c0' }} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Start Tracking Your Expenses</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  See exactly how much your time costs. Track gym classes, transport, meetings, and more.
                </p>
                <Button 
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="bg-gradient-to-r from-blue-800 to-blue-900 hover:from-blue-900 hover:to-blue-950 text-white shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Expense
                </Button>
              </div>
            )}
          </div>
          </div>
        </main>
      </div>

      {/* Event Details Modal */}
      <Dialog open={isEventDetailsOpen} onOpenChange={setIsEventDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Event Details</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                </p>
              </div>

              {selectedEvent.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Location</p>
                    <p className="text-sm text-gray-600">{selectedEvent.location}</p>
                  </div>
                </div>
              )}

              {selectedEvent.description && (
                <div className="flex items-start gap-2">
                  <AlignLeft className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Description</p>
                    <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                  </div>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Attendees</p>
                    <p className="text-sm text-gray-600">{selectedEvent.attendees.join(', ')}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button
                  onClick={() => setIsEventDetailsOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Personal Time Balance Dashboard */}
      <div className="fixed bottom-6 right-6 bg-slate-900/95 backdrop-blur-sm border-2 border-gray-200 rounded-xl shadow-lg p-4 max-w-sm z-40">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Activity className="h-4 w-4 text-purple-600" />
          Personal Time Balance
        </h3>
        
        <div className="space-y-3 mb-4">
          {(Object.keys(BALANCE_CATEGORIES) as BalanceCategory[]).map((categoryKey) => {
            const category = BALANCE_CATEGORIES[categoryKey]
            const currentHours = timeBalance[categoryKey]
            const percentage = getBalancePercentage(categoryKey)
            const isHealthy = isBalanceHealthy(categoryKey)
            
            return (
              <div key={categoryKey} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div style={{ color: category.color }}>
                      {category.icon}
                    </div>
                    <span className="font-medium text-gray-700">{category.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-gray-900">
                      {currentHours}h
                    </span>
                    {!isHealthy && (
                      <span className="text-orange-500" title="Out of balance">⚠</span>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isHealthy ? "opacity-100" : "opacity-70"
                    )}
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: category.color 
                    }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>{percentage.toFixed(1)}% of week</span>
                  <span>Target: {category.targetHours}h</span>
                </div>
              </div>
            )
          })}
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Total Hours/Week:</span>
            <span className="font-bold text-gray-900">{getTotalHours()}h</span>
          </div>
          {getTotalHours() > 168 && (
            <p className="text-[10px] text-orange-600 mt-2">
              ⚠ You're tracking more than 168 hours in a week
            </p>
          )}
          {Object.keys(BALANCE_CATEGORIES).some(key => !isBalanceHealthy(key as BalanceCategory)) && (
            <p className="text-[10px] text-blue-600 mt-2 italic">
              💡 Some categories need adjustment for better balance
            </p>
          )}
        </div>
      </div>

    </div>
  )
}
