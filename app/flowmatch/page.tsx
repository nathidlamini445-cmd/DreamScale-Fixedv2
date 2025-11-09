"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { HorizontalNav } from "@/components/horizontal-nav"
import { SettingsModal } from "@/components/settings-modal"
import { 
  Brain, 
  Zap, 
  Coffee, 
  Heart, 
  Cloud, 
  Sparkles, 
  Moon, 
  Sun, 
  Wind,
  Smile,
  Flame,
  Droplets,
  Lightbulb,
  Target,
  Battery,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Compass,
  Play,
  Pause,
  Square,
  Timer,
  X,
  PartyPopper
} from "lucide-react"
import { useSessionSafe } from '@/lib/session-context'
import { useSaveSessionData, useLoadSessionData } from '@/lib/session-hooks'

// Define mood types with their properties
interface MoodData {
  mood: string
  intensity: "low" | "medium" | "high"
  icon: React.ReactNode
  color: string
  bgColor: string
  suggested_tasks: string[]
  task_categories: string[]
  motivation: string
  energy_level: string
}

// Comprehensive mood database
const MOOD_DATABASE: Record<string, MoodData> = {
  // Low Intensity Moods
  tired: {
    mood: "Tired",
    intensity: "low",
    icon: <Moon className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#6366f1",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
    suggested_tasks: [
      "Organize workspace",
      "Sort emails into folders",
      "Review notes from yesterday",
      "Update task lists",
      "Light admin work"
    ],
    task_categories: ["Light Work", "Admin/Planning", "Rest & Recharge"],
    motivation: "Gentle steps still move you forward. Rest is productive too.",
    energy_level: "Low energy - focus on simple, restorative tasks"
  },
  
  overwhelmed: {
    mood: "Overwhelmed",
    intensity: "low",
    icon: <Cloud className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#8b5cf6",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    suggested_tasks: [
      "Break down one big task into smaller steps",
      "Journal your thoughts for 5 minutes",
      "Prioritize top 3 tasks only",
      "Take a short walk",
      "Organize digital files"
    ],
    task_categories: ["Admin/Planning", "Rest & Recharge"],
    motivation: "One small step at a time. You don't have to do it all today.",
    energy_level: "Low energy - need to simplify and breathe"
  },

  anxious: {
    mood: "Anxious",
    intensity: "medium",
    icon: <Wind className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#06b6d4",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
    suggested_tasks: [
      "Create a calming playlist",
      "Organize something physical",
      "Review and update schedule",
      "Do breathing exercises",
      "Light creative work (coloring, doodling)"
    ],
    task_categories: ["Light Work", "Rest & Recharge", "Admin/Planning"],
    motivation: "Channel that energy into small, manageable actions. You're safe.",
    energy_level: "Medium energy - need calming, structured tasks"
  },

  lazy: {
    mood: "Lazy",
    intensity: "low",
    icon: <Coffee className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#a855f7",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    suggested_tasks: [
      "Watch an educational video",
      "Browse inspiration boards",
      "Respond to 5 easy emails",
      "Light social media scheduling",
      "Read industry articles"
    ],
    task_categories: ["Learning", "Light Work"],
    motivation: "Low effort doesn't mean no progress. Even this counts.",
    energy_level: "Low energy - passive learning mode"
  },

  peaceful: {
    mood: "Peaceful",
    intensity: "medium",
    icon: <Droplets className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#10b981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    suggested_tasks: [
      "Long-form writing",
      "Strategic planning",
      "Mindful editing",
      "Thoughtful design work",
      "Reflective journaling"
    ],
    task_categories: ["Deep Work", "Creative Flow", "Admin/Planning"],
    motivation: "Your calm mind is perfect for thoughtful, intentional work.",
    energy_level: "Medium energy - clarity and focus available"
  },

  // Medium Intensity Moods
  focused: {
    mood: "Focused",
    intensity: "high",
    icon: <Target className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#3b82f6",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    suggested_tasks: [
      "Deep coding session",
      "Complex problem solving",
      "Writing important content",
      "Detailed editing work",
      "Strategic planning"
    ],
    task_categories: ["Deep Work", "Creative Flow"],
    motivation: "You're in the zone. This is your time to create magic.",
    energy_level: "High energy - peak performance mode"
  },

  motivated: {
    mood: "Motivated",
    intensity: "high",
    icon: <Zap className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#eab308",
    bgColor: "bg-yellow-50",
    suggested_tasks: [
      "Tackle your biggest task",
      "Start that new project",
      "Reach out to new clients",
      "Create ambitious content",
      "Learn something challenging"
    ],
    task_categories: ["Deep Work", "Creative Flow", "Learning"],
    motivation: "Strike while the iron is hot. Channel this energy into your dreams.",
    energy_level: "High energy - unstoppable momentum"
  },

  inspired: {
    mood: "Inspired",
    intensity: "high",
    icon: <Sparkles className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#ec4899",
    bgColor: "bg-pink-50 dark:bg-pink-900/30",
    suggested_tasks: [
      "Brainstorm new ideas",
      "Creative design work",
      "Write that blog post",
      "Record video content",
      "Sketch out new concepts"
    ],
    task_categories: ["Creative Flow", "Deep Work"],
    motivation: "Capture this creative spark before it fades. Your ideas matter.",
    energy_level: "High energy - creative flow state"
  },

  excited: {
    mood: "Excited",
    intensity: "high",
    icon: <Flame className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#f97316",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
    suggested_tasks: [
      "Network with new people",
      "Pitch your ideas",
      "Record energetic content",
      "Tackle multiple quick tasks",
      "Social media engagement"
    ],
    task_categories: ["Creative Flow", "Light Work", "Admin/Planning"],
    motivation: "Your enthusiasm is contagious. Share it with the world!",
    energy_level: "High energy - extroverted action mode"
  },

  calm: {
    mood: "Calm",
    intensity: "medium",
    icon: <Smile className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#14b8a6",
    bgColor: "bg-teal-50",
    suggested_tasks: [
      "Organize long-term plans",
      "Review and reflect",
      "Gentle creative work",
      "Respond to messages thoughtfully",
      "Update documentation"
    ],
    task_categories: ["Admin/Planning", "Light Work", "Creative Flow"],
    motivation: "Your steady energy is perfect for sustainable progress.",
    energy_level: "Medium energy - balanced and grounded"
  },

  restless: {
    mood: "Restless",
    intensity: "medium",
    icon: <RefreshCw className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    suggested_tasks: [
      "Quick task batching",
      "Organize physical space",
      "Switch between multiple tasks",
      "Take an active break",
      "Do hands-on creative work"
    ],
    task_categories: ["Light Work", "Admin/Planning"],
    motivation: "Channel that restless energy into movement and variety.",
    energy_level: "Medium energy - need variety and movement"
  },

  stressed: {
    mood: "Stressed",
    intensity: "medium",
    icon: <AlertCircle className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#ef4444",
    bgColor: "bg-red-50",
    suggested_tasks: [
      "Time-block your day",
      "Delegate one task",
      "Complete one quick win",
      "Take a mindful break",
      "Clear your inbox"
    ],
    task_categories: ["Admin/Planning", "Light Work", "Rest & Recharge"],
    motivation: "Breathe. One priority at a time. You've got this.",
    energy_level: "Medium energy - need structure and wins"
  },

  bored: {
    mood: "Bored",
    intensity: "low",
    icon: <Cloud className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#64748b",
    bgColor: "bg-slate-50",
    suggested_tasks: [
      "Explore new tools or platforms",
      "Try a creative challenge",
      "Learn something new",
      "Experiment with a new skill",
      "Browse inspiration"
    ],
    task_categories: ["Learning", "Creative Flow"],
    motivation: "Boredom is an invitation to explore. What's curious to you?",
    energy_level: "Low energy - need novelty and stimulation"
  },

  confused: {
    mood: "Confused",
    intensity: "low",
    icon: <Compass className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#8b5cf6",
    bgColor: "bg-violet-50",
    suggested_tasks: [
      "Research and gather information",
      "Make a mind map",
      "Ask for help or feedback",
      "Review tutorials",
      "Break down the problem"
    ],
    task_categories: ["Learning", "Admin/Planning"],
    motivation: "Confusion is the first step to clarity. Seek understanding.",
    energy_level: "Low energy - need guidance and structure"
  },

  energetic: {
    mood: "Energetic",
    intensity: "high",
    icon: <Battery className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#22c55e",
    bgColor: "bg-green-50",
    suggested_tasks: [
      "Power through your task list",
      "Record multiple videos",
      "Batch create content",
      "Network and connect",
      "Physical + creative combo work"
    ],
    task_categories: ["Deep Work", "Creative Flow", "Light Work"],
    motivation: "Ride this wave of energy. You're unstoppable right now!",
    energy_level: "High energy - maximum output mode"
  },

  creative: {
    mood: "Creative",
    intensity: "high",
    icon: <Lightbulb className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#f59e0b",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
    suggested_tasks: [
      "Design something new",
      "Write freely without editing",
      "Sketch or prototype",
      "Experiment with new ideas",
      "Brainstorm without limits"
    ],
    task_categories: ["Creative Flow"],
    motivation: "Your creative mind is on fire. Create without judgment.",
    energy_level: "High energy - pure creative mode"
  },

  confident: {
    mood: "Confident",
    intensity: "high",
    icon: <TrendingUp className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#3b82f6",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    suggested_tasks: [
      "Pitch to a client",
      "Record that challenging video",
      "Ask for what you deserve",
      "Take on a stretch goal",
      "Publish your work"
    ],
    task_categories: ["Deep Work", "Creative Flow"],
    motivation: "Your confidence is your superpower. Go claim what's yours.",
    energy_level: "High energy - bold action mode"
  },

  grateful: {
    mood: "Grateful",
    intensity: "medium",
    icon: <Heart className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#ec4899",
    bgColor: "bg-pink-50 dark:bg-pink-900/30",
    suggested_tasks: [
      "Send thank you messages",
      "Reflect on your progress",
      "Create appreciation content",
      "Organize memories/wins",
      "Give back or mentor"
    ],
    task_categories: ["Light Work", "Creative Flow", "Admin/Planning"],
    motivation: "Gratitude multiplies good. Share your appreciation.",
    energy_level: "Medium energy - heart-centered mode"
  },

  curious: {
    mood: "Curious",
    intensity: "medium",
    icon: <Compass className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#06b6d4",
    bgColor: "bg-cyan-50 dark:bg-cyan-900/30",
    suggested_tasks: [
      "Research deep dive",
      "Take an online course",
      "Explore new techniques",
      "Read industry insights",
      "Experiment with new tools"
    ],
    task_categories: ["Learning", "Creative Flow"],
    motivation: "Curiosity is the engine of growth. Follow your questions.",
    energy_level: "Medium energy - exploration mode"
  },

  proud: {
    mood: "Proud",
    intensity: "medium",
    icon: <CheckCircle className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#10b981",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    suggested_tasks: [
      "Showcase your work",
      "Update your portfolio",
      "Share your success",
      "Document your process",
      "Celebrate with others"
    ],
    task_categories: ["Light Work", "Creative Flow"],
    motivation: "Own your wins. You've earned the right to celebrate.",
    energy_level: "Medium energy - reflective celebration mode"
  },

  melancholic: {
    mood: "Melancholic",
    intensity: "low",
    icon: <Cloud className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#6366f1",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
    suggested_tasks: [
      "Reflective journaling",
      "Gentle creative work",
      "Listen to music and organize",
      "Write poetry or prose",
      "Create from emotion"
    ],
    task_categories: ["Creative Flow", "Rest & Recharge"],
    motivation: "Your sensitivity is a gift. Channel it into art.",
    energy_level: "Low energy - introspective mode"
  },

  determined: {
    mood: "Determined",
    intensity: "high",
    icon: <Target className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#dc2626",
    bgColor: "bg-red-50",
    suggested_tasks: [
      "Power through your hardest task",
      "Meet that deadline",
      "Push past resistance",
      "Complete what you started",
      "Marathon work session"
    ],
    task_categories: ["Deep Work"],
    motivation: "Nothing can stop you when you're this determined. Finish strong.",
    energy_level: "High energy - warrior mode"
  },

  playful: {
    mood: "Playful",
    intensity: "medium",
    icon: <Sparkles className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#a855f7",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    suggested_tasks: [
      "Create something fun",
      "Try a creative challenge",
      "Make memes or light content",
      "Collaborate with others",
      "Experiment playfully"
    ],
    task_categories: ["Creative Flow", "Light Work"],
    motivation: "Play is where innovation lives. Have fun creating!",
    energy_level: "Medium energy - joyful experimentation mode"
  },

  neutral: {
    mood: "Neutral",
    intensity: "medium",
    icon: <Brain className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#64748b",
    bgColor: "bg-slate-50",
    suggested_tasks: [
      "Routine task completion",
      "Steady work session",
      "Process-oriented tasks",
      "Methodical planning",
      "Standard workflows"
    ],
    task_categories: ["Light Work", "Admin/Planning", "Deep Work"],
    motivation: "Steady and consistent wins the race. Keep going.",
    energy_level: "Medium energy - balanced productivity mode"
  },

  scattered: {
    mood: "Scattered",
    intensity: "low",
    icon: <Wind className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#94a3b8",
    bgColor: "bg-slate-50",
    suggested_tasks: [
      "Simple list-making",
      "5-minute task sprints",
      "Brain dump everything",
      "Use timers for focus",
      "One task at a time practice"
    ],
    task_categories: ["Admin/Planning", "Light Work"],
    motivation: "Gather your thoughts first. Structure brings clarity.",
    energy_level: "Low energy - need focus and simplicity"
  },

  hopeful: {
    mood: "Hopeful",
    intensity: "medium",
    icon: <Sun className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#fbbf24",
    bgColor: "bg-yellow-50",
    suggested_tasks: [
      "Plan future projects",
      "Set new goals",
      "Vision board creation",
      "Reach out to opportunities",
      "Start something new"
    ],
    task_categories: ["Admin/Planning", "Creative Flow"],
    motivation: "Hope is the beginning of action. Your future is bright.",
    energy_level: "Medium energy - forward-looking mode"
  },

  frustrated: {
    mood: "Frustrated",
    intensity: "medium",
    icon: <AlertCircle className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#f97316",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
    suggested_tasks: [
      "Take a break first",
      "Switch to a different task",
      "Ask for help",
      "Do something physical",
      "Come back to it later"
    ],
    task_categories: ["Rest & Recharge", "Light Work"],
    motivation: "Step back to move forward. Fresh eyes solve problems.",
    energy_level: "Medium energy - need reset and perspective"
  },

  accomplished: {
    mood: "Accomplished",
    intensity: "medium",
    icon: <CheckCircle className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#059669",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/30",
    suggested_tasks: [
      "Document your wins",
      "Share your results",
      "Plan next milestones",
      "Rest and recharge",
      "Mentor or help others"
    ],
    task_categories: ["Light Work", "Rest & Recharge", "Admin/Planning"],
    motivation: "Savor this victory. You've earned this moment of pride.",
    energy_level: "Medium energy - celebration and reflection mode"
  },

  drained: {
    mood: "Drained",
    intensity: "low",
    icon: <Battery className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#64748b",
    bgColor: "bg-slate-50",
    suggested_tasks: [
      "Take a real break",
      "Light organizing only",
      "Queue up tasks for later",
      "Gentle self-care",
      "Early rest recommended"
    ],
    task_categories: ["Rest & Recharge"],
    motivation: "Your rest is not laziness. It's necessary. Recharge guilt-free.",
    energy_level: "Low energy - recovery needed"
  },

  inspired_but_tired: {
    mood: "Inspired but Tired",
    intensity: "low",
    icon: <Moon className="h-6 w-6" style={{ color: '#39d2c0' }} />,
    color: "#8b5cf6",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    suggested_tasks: [
      "Voice record your ideas",
      "Quick idea capture",
      "Light sketching",
      "Save inspiration for later",
      "Short creative burst (10 min)"
    ],
    task_categories: ["Creative Flow", "Light Work"],
    motivation: "Capture the spark, save the execution. Honor both sides.",
    energy_level: "Low energy but creative - gentle capture mode"
  }
}

// Aliases for flexible mood matching
const MOOD_ALIASES: Record<string, string> = {
  "exhausted": "tired",
  "sleepy": "tired",
  "burned out": "drained",
  "burnt out": "drained",
  "meh": "neutral",
  "okay": "neutral",
  "fine": "neutral",
  "pumped": "energetic",
  "hyped": "excited",
  "nervous": "anxious",
  "worried": "anxious",
  "sad": "melancholic",
  "down": "melancholic",
  "happy": "grateful",
  "joyful": "excited",
  "chill": "peaceful",
  "zen": "calm",
  "stressed out": "stressed",
  "freaking out": "overwhelmed",
  "lost": "confused",
  "stuck": "frustrated",
  "annoyed": "frustrated",
  "fired up": "motivated",
  "ready": "focused",
  "in the zone": "focused"
}

export default function FlowMatchPage() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [matchedMood, setMatchedMood] = useState<MoodData | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showDurationDialog, setShowDurationDialog] = useState(false)
  const [workDuration, setWorkDuration] = useState<number | null>(null)
  const [calendarEvents, setCalendarEvents] = useState<any[]>([])
  const [personalizedTasks, setPersonalizedTasks] = useState<string[]>([])
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0) // in seconds
  const [isPaused, setIsPaused] = useState(false)
  const [showCompletionNotification, setShowCompletionNotification] = useState(false)

  // Load calendar events on mount
  useEffect(() => {
    // Try to get events from localStorage (if calendar page stored them)
    try {
      const storedEvents = localStorage.getItem('calendarEvents')
      if (storedEvents) {
        setCalendarEvents(JSON.parse(storedEvents))
      }
    } catch (error) {
      console.log('No calendar events found')
    }
  }, [])

  // Timer countdown logic
  useEffect(() => {
    if (!isTimerActive || isPaused || timeRemaining <= 0) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false)
          setShowCompletionNotification(true)
          // Play completion sound
          if (typeof Audio !== 'undefined') {
            try {
              const audio = new Audio('/notification.mp3')
              audio.play().catch(() => console.log('Could not play sound'))
            } catch (error) {
              console.log('Audio not available')
            }
          }
          // Auto-hide notification after 8 seconds
          setTimeout(() => {
            setShowCompletionNotification(false)
          }, 8000)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isTimerActive, isPaused, timeRemaining])

  // Check if mood is negative
  const isNegativeMood = (moodKey: string): boolean => {
    const negativeMoods = [
      'tired', 'overwhelmed', 'anxious', 'stressed', 'frustrated', 
      'drained', 'scattered', 'confused', 'bored', 'melancholic', 'lazy'
    ]
    return negativeMoods.includes(moodKey)
  }

  // Generate personalized tasks based on calendar events
  const generatePersonalizedTasks = (moodData: MoodData, events: any[], duration: number | null) => {
    const tasks: string[] = []
    const today = new Date().toISOString().split('T')[0]
    
    // Get today's events
    const todayEvents = events.filter(e => e.date === today)
    
    if (todayEvents.length > 0) {
      // Suggest preparation for upcoming events
      todayEvents.forEach(event => {
        if (moodData.intensity === 'low') {
          tasks.push(`Prepare materials for: ${event.title}`)
          tasks.push(`Review notes for: ${event.title}`)
        } else if (moodData.intensity === 'high') {
          tasks.push(`Tackle main deliverables for: ${event.title}`)
          tasks.push(`Create content for: ${event.title}`)
        }
      })
    }

    // Add industry-specific tasks based on event types
    const hasCreativeWork = events.some(e => 
      e.title.toLowerCase().includes('design') || 
      e.title.toLowerCase().includes('creative') ||
      e.title.toLowerCase().includes('content')
    )
    
    const hasClientWork = events.some(e => 
      e.title.toLowerCase().includes('client') || 
      e.title.toLowerCase().includes('meeting')
    )

    if (hasCreativeWork && moodData.intensity === 'high') {
      tasks.push('Work on your creative projects')
      tasks.push('Design new concepts')
    }

    if (hasClientWork && moodData.intensity === 'medium') {
      tasks.push('Prepare client presentations')
      tasks.push('Follow up on client emails')
    }

    // If duration is specified, adjust task complexity
    if (duration !== null) {
      if (duration <= 2) {
        tasks.push(`Quick 30-min task sprint`)
        tasks.push(`Organize next ${duration} hours of work`)
      } else if (duration >= 4) {
        tasks.push('Deep work session on main project')
        tasks.push('Tackle complex problems')
      }
    }

    // Combine with mood-based tasks
    const combinedTasks = [...tasks, ...moodData.suggested_tasks]
    return combinedTasks.slice(0, 8) // Return top 8 tasks
  }

  const handleMoodSelect = (moodKey: string) => {
    setSelectedMood(moodKey)
    const mood = MOOD_DATABASE[moodKey]
    setMatchedMood(mood)
    setSearchQuery("")
    
    // Show duration dialog for all moods
    setShowDurationDialog(true)
  }

  const handleDurationSubmit = (duration: number) => {
    setWorkDuration(duration)
    setShowDurationDialog(false)
    
    if (matchedMood) {
      const tasks = generatePersonalizedTasks(matchedMood, calendarEvents, duration)
      setPersonalizedTasks(tasks)
    }
  }

  // Timer functions
  const startTimer = () => {
    if (workDuration) {
      setTimeRemaining(workDuration * 60 * 60) // Convert hours to seconds
      setIsTimerActive(true)
      setIsPaused(false)
    } else {
      // Default to 1 hour if no duration set
      setTimeRemaining(60 * 60)
      setIsTimerActive(true)
      setIsPaused(false)
    }
  }

  const pauseTimer = () => {
    setIsPaused(!isPaused)
  }

  const stopTimer = () => {
    setIsTimerActive(false)
    setIsPaused(false)
    setTimeRemaining(0)
    setShowCompletionNotification(false)
  }

  // Format time for display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleCustomMoodSearch = (query: string) => {
    setSearchQuery(query)
    const lowerQuery = query.toLowerCase().trim()
    
    // Check aliases first
    if (MOOD_ALIASES[lowerQuery]) {
      const aliasedMood = MOOD_ALIASES[lowerQuery]
      setMatchedMood(MOOD_DATABASE[aliasedMood])
      setSelectedMood(aliasedMood)
      return
    }

    // Check direct match
    if (MOOD_DATABASE[lowerQuery]) {
      setMatchedMood(MOOD_DATABASE[lowerQuery])
      setSelectedMood(lowerQuery)
      return
    }

    // Fuzzy match - find if query is contained in any mood name
    const matchingMood = Object.keys(MOOD_DATABASE).find(mood => 
      mood.includes(lowerQuery) || lowerQuery.includes(mood)
    )

    if (matchingMood) {
      setMatchedMood(MOOD_DATABASE[matchingMood])
      setSelectedMood(matchingMood)
    }
  }

  const filteredMoods = searchQuery 
    ? Object.entries(MOOD_DATABASE).filter(([key, data]) =>
        data.mood.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : Object.entries(MOOD_DATABASE)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-foreground relative overflow-hidden">
      <div className="relative z-10 main-container">
        <HorizontalNav onSettingsClick={() => setIsSettingsModalOpen(true)} />
        <main className="pt-20 pb-12">
          {/* Completion Notification */}
          {showCompletionNotification && (
            <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 duration-500">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-4 border-2 border-green-400">
                <PartyPopper className="h-6 w-6 animate-bounce" />
                <div>
                  <p className="font-bold text-lg">🎉 Great work! Your work session is complete.</p>
                  <p className="text-sm text-green-50">Time for a well-deserved break!</p>
                </div>
                <button
                  onClick={() => setShowCompletionNotification(false)}
                  className="ml-4 hover:bg-slate-900/20 rounded-full p-1 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Header */}
          <header className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-blue-50 dark:bg-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center justify-between px-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-900">
                  {"Flow "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 animate-shimmer">
                    {"Match"}
                  </span>
                </h1>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Match your mood to the perfect work task
                </p>
              </div>
            </div>
          </header>

          <div className="px-8 py-8 space-y-8">
            {/* Mood Input Section */}
            <Card className="border-2 border-[#39d2c0]/20 bg-white dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    How are you feeling right now?
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Select or type your mood to get personalized task recommendations
                  </p>
                </div>

                {/* Search Input */}
                <div className="max-w-md mx-auto mb-8">
                  <input
                    type="text"
                    placeholder="Type your mood... (e.g., tired, inspired, meh)"
                    value={searchQuery}
                    onChange={(e) => handleCustomMoodSearch(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white text-gray-900 dark:placeholder-gray-400 rounded-lg focus:border-[#39d2c0] focus:ring-4 focus:ring-[#39d2c0]/20 focus:outline-none transition-all"
                  />
                </div>

                {/* Mood Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {filteredMoods.slice(0, 24).map(([key, data]) => (
                    <button
                      key={key}
                      onClick={() => handleMoodSelect(key)}
                      className={`group p-4 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#39d2c0]/50 hover:ring-4 hover:ring-[#39d2c0]/30 ${
                        selectedMood === key
                          ? `${data.bgColor} border-current shadow-xl shadow-[#39d2c0]/50 ring-4 ring-[#39d2c0]/30 scale-105`
                          : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-gray-600 hover:border-[#39d2c0]'
                      }`}
                      style={{
                        color: selectedMood === key ? data.color : '#64748b'
                      }}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg ${
                          selectedMood === key ? 'bg-[#39d2c0]/20 border-2 border-[#39d2c0]' : 'border border-gray-600 hover:border-[#39d2c0]/50'
                        } flex items-center justify-center transition-all duration-300 group-hover:scale-105`}>
                          <div className="flowmatch-icon" style={{ color: '#39d2c0' }}>
                            {data.icon}
                          </div>
                        </div>
                        <span className="font-semibold text-sm text-foreground">
                          {data.mood}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Matched Mood Results */}
            {matchedMood && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Mood Summary Card */}
                <Card 
                  className="border-2 shadow-lg dark:bg-gray-800"
                  style={{ borderColor: matchedMood.color }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ 
                          backgroundColor: matchedMood.color,
                          color: 'white'
                        }}
                      >
                        {matchedMood.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {matchedMood.mood}
                          </h3>
                          <Badge 
                            className="capitalize"
                            style={{
                              backgroundColor: matchedMood.color,
                              color: 'white'
                            }}
                          >
                            {matchedMood.intensity} intensity
                          </Badge>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-3">
                          "{matchedMood.motivation}"
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {matchedMood.energy_level}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Task Categories */}
                <Card className="dark:bg-gray-800">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Recommended Task Types
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {matchedMood.task_categories.map((category) => (
                        <Badge
                          key={category}
                          className="px-4 py-2 text-sm"
                          style={{
                            backgroundColor: `${matchedMood.color}20`,
                            color: matchedMood.color,
                            border: `2px solid ${matchedMood.color}40`
                          }}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Suggested Tasks */}
                <Card className="dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {personalizedTasks.length > 0 ? 'Personalized Tasks Based on Your Calendar' : 'Perfect Tasks for You Right Now'}
                      </h3>
                      {workDuration && (
                        <Badge className="bg-blue-100 text-blue-700">
                          {workDuration}h work session
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(personalizedTasks.length > 0 ? personalizedTasks : matchedMood.suggested_tasks).map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                        >
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: matchedMood.color }}
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">
                            {task}
                          </span>
                        </div>
                      ))}
                    </div>
                    {calendarEvents.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 italic">
                        📅 Tasks generated based on your calendar events and work style
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Timer Display (when active) */}
                {isTimerActive && (
                  <Card className="border-2 border-[#39d2c0] shadow-xl animate-in fade-in slide-in-from-top-4 duration-500 dark:bg-gray-800">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-4">
                          <Timer className="h-6 w-6 text-[#39d2c0] animate-pulse" />
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Work Session In Progress</h3>
                        </div>
                        
                        {/* Timer Display */}
                        <div className="mb-6">
                          <div className="text-6xl font-bold text-[#39d2c0] mb-2 font-mono">
                            {formatTime(timeRemaining)}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300">
                            {workDuration ? `${workDuration}h session` : 'Stay focused!'}
                          </p>
                        </div>

                        {/* Timer Controls */}
                        <div className="flex justify-center gap-3">
                          <Button
                            onClick={pauseTimer}
                            variant="outline"
                            className="px-6"
                          >
                            {isPaused ? (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Resume
                              </>
                            ) : (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={stopTimer}
                            variant="destructive"
                            className="px-6"
                          >
                            <Square className="h-4 w-4 mr-2" />
                            Stop
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Quick Actions */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      setSelectedMood(null)
                      setMatchedMood(null)
                      setSearchQuery("")
                      stopTimer()
                    }}
                    variant="outline"
                    className="px-6"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Check Another Mood
                  </Button>
                  {!isTimerActive && (
                    <Button
                      onClick={startTimer}
                      className="px-6"
                      style={{
                        backgroundColor: matchedMood.color,
                        color: 'white'
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Working
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!matchedMood && (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Brain className="h-9 w-9 text-[#39d2c0]" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Select your mood to begin
                </h3>
                <p className="text-muted-foreground">
                  We'll match you with tasks that fit your current energy and mindset
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Work Duration Dialog (for all moods) */}
      <Dialog open={showDurationDialog} onOpenChange={setShowDurationDialog}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold dark:text-white">
              {selectedMood && isNegativeMood(selectedMood) 
                ? "How long can we work today" 
                : "That's the energy, how long are we working today"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Let's match your energy with realistic time commitments. How many hours are you willing to work today?
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { hours: 1, label: "1 hour", desc: "Just getting started" },
                { hours: 2, label: "2 hours", desc: "Short session" },
                { hours: 3, label: "3 hours", desc: "Half day" },
                { hours: 4, label: "4 hours", desc: "Solid session" },
                { hours: 6, label: "6 hours", desc: "Full day" },
                { hours: 8, label: "8+ hours", desc: "Extended work" }
              ].map((option) => (
                <button
                  key={option.hours}
                  onClick={() => handleDurationSubmit(option.hours)}
                  className="p-4 text-left border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 rounded-lg hover:border-[#39d2c0] hover:bg-[#39d2c0]/5 dark:hover:bg-[#39d2c0]/10 hover:shadow-lg hover:shadow-[#39d2c0]/30 transition-all duration-300 group"
                >
                  <div className="font-bold text-gray-900 dark:text-white group-hover:text-[#39d2c0]">
                    {option.label}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDurationDialog(false)
                  if (matchedMood) {
                    const tasks = generatePersonalizedTasks(matchedMood, calendarEvents, null)
                    setPersonalizedTasks(tasks)
                  }
                }}
                className="w-full"
              >
                Skip - Show all recommendations
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={(settings) => console.log('Settings saved:', settings)}
      />
    </div>
  )
}

