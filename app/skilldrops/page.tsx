"use client"

import { useState, useEffect } from 'react'
import { useSessionSafe } from '@/lib/session-context'
import { useSaveSessionData, useLoadSessionData } from '@/lib/session-hooks'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, BookOpen, Star, ArrowRight, Play, CheckCircle } from "lucide-react"
import { LessonDetailModal } from "@/components/lesson-detail-modal"
import { HorizontalNav } from "@/components/horizontal-nav"
import { SettingsModal } from "@/components/settings-modal"

interface Lesson {
  id: number
  title: string
  description: string
  duration: number // in minutes
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  difficultyLevel: number // 1-5
  category: string
  completed: boolean
  content: {
    overview: string
    keyConcepts: string[]
    practicalExercises: string[]
    resources: string[]
    realWorldExamples: string[]
  }
}

const lessons: Lesson[] = [
  {
    id: 1,
    title: "Surrealism & the Subconscious",
    description: "Explore the depths of surrealist art and learn to tap into your subconscious creative processes",
    duration: 45,
    difficulty: "Intermediate",
    difficultyLevel: 3,
    category: "Art Theory",
    completed: false,
    content: {
      overview: "Surrealism emerged in the early 1920s as a cultural and artistic movement that sought to free the human mind from the constraints of rational thought and societal norms. The movement formally began in 1924, when André Breton, often called the 'Pope of Surrealism,' published The Surrealist Manifesto. Surrealism was rooted in the ideas of Sigmund Freud's psychoanalysis, particularly his theories on dreams, repression, and the unconscious mind. Artists and writers believed that true creativity came not from reason, but from tapping into the irrational, dreamlike, and subconscious aspects of human thought.",
      keyConcepts: [
        "The Unconscious Mind: Creative truth lies in what the conscious mind suppresses — dreams, fantasies, fears, desires",
        "Automatic Writing/Drawing: Creating without censorship, allowing the subconscious to guide the hand",
        "Dream Imagery: Exploring the illogical and uncanny worlds that appear in dreams",
        "Juxtaposition: Placing unrelated objects together to spark new meanings or emotional responses",
        "Pure Psychic Automatism: An act of creation free from rational interference",
        "Super-reality: Reconciling the unconscious with reality to create a heightened state of being"
      ]
    }
  },
  {
    id: 2,
    title: "The Bauhaus Blueprint: Designing with Purpose",
    description: "Master the principles of functional design and learn how form follows function in modern design",
    duration: 60,
    difficulty: "Beginner",
    difficultyLevel: 2,
    category: "Design Principles",
    completed: false,
    content: {
      overview: "The Bauhaus school revolutionized design thinking by emphasizing the unity of art, craft, and technology. Founded in 1919 by Walter Gropius, Bauhaus principles continue to influence contemporary design. This lesson explores the fundamental concepts of functional design, the relationship between form and function, and how to apply these principles to create purposeful, beautiful designs.",
      keyConcepts: [
        "Form follows function principle",
        "Unity of art, craft, and technology",
        "Minimalism and essentialism",
        "Geometric forms and primary colors",
        "Typography and grid systems",
        "Industrial design principles"
      ],
      practicalExercises: [
        "Design a functional chair using only geometric shapes",
        "Create a minimalist poster using primary colors",
        "Develop a grid system for a magazine layout",
        "Design a simple household object with maximum functionality",
        "Practice Bauhaus typography exercises"
      ],
      resources: [
        "Bauhaus: 1919-1933 by Magdalena Droste",
        "The New Typography by Jan Tschichold",
        "Bauhaus Archive Museum collections",
        "Documentary: 'Bauhaus: The Face of the 20th Century'",
        "Online course: 'Bauhaus Design Principles'"
      ],
      realWorldExamples: [
        "Apple's product design philosophy",
        "IKEA's functional furniture design",
        "Google's Material Design system",
        "Swiss graphic design movement",
        "Contemporary minimalist architecture"
      ]
    }
  },
  {
    id: 3,
    title: "Creative Problem-Solving from Pixar's Playbook",
    description: "Learn Pixar's innovative approach to storytelling and creative problem-solving techniques",
    duration: 50,
    difficulty: "Intermediate",
    difficultyLevel: 3,
    category: "Creative Process",
    completed: false,
    content: {
      overview: "Pixar Animation Studios has revolutionized storytelling through their unique creative process and problem-solving methodologies. This lesson explores their 'Braintrust' approach, iterative storytelling techniques, and how they maintain creative excellence while meeting commercial demands. Learn to apply these methods to your own creative projects.",
      keyConcepts: [
        "The Braintrust collaborative feedback system",
        "Iterative storytelling and rapid prototyping",
        "Emotional truth in creative work",
        "Balancing creativity with constraints",
        "Failure as a learning tool",
        "Cross-disciplinary collaboration"
      ],
      practicalExercises: [
        "Conduct a Braintrust-style feedback session",
        "Create multiple iterations of a single story concept",
        "Develop a character through emotional truth exercises",
        "Practice rapid prototyping for creative projects",
        "Design a collaborative creative workflow"
      ],
      resources: [
        "Creativity, Inc. by Ed Catmull",
        "The Art of Pixar: 25th Anniversary book",
        "Pixar in a Box online course",
        "Documentary: 'The Pixar Story'",
        "Pixar's official behind-the-scenes content"
      ],
      realWorldExamples: [
        "Toy Story's development process",
        "Inside Out's emotional storytelling approach",
        "Pixar's short film program",
        "Disney's creative collaboration methods",
        "Modern animation studio workflows"
      ]
    }
  },
  {
    id: 4,
    title: "The Myth of Originality",
    description: "Understand how all creative work builds upon what came before and learn to embrace influence",
    duration: 40,
    difficulty: "Beginner",
    difficultyLevel: 2,
    category: "Creative Philosophy",
    completed: false,
    content: {
      overview: "The concept of complete originality is a myth. All creative work is built upon the foundation of what came before, whether consciously or unconsciously. This lesson explores the nature of creative influence, how to study and learn from existing work ethically, and how to develop your unique voice while acknowledging your creative lineage.",
      keyConcepts: [
        "Creative influence and inspiration",
        "The remix culture and sampling",
        "Finding your unique voice",
        "Ethical appropriation vs. plagiarism",
        "Creative lineage and artistic heritage",
        "Building upon existing ideas"
      ],
      practicalExercises: [
        "Create a creative family tree of your influences",
        "Practice ethical remixing of existing works",
        "Develop a personal creative manifesto",
        "Study and analyze your favorite artists' influences",
        "Create original work inspired by specific influences"
      ],
      resources: [
        "Steal Like an Artist by Austin Kleon",
        "Everything is a Remix documentary series",
        "The Creative Act by Rick Rubin",
        "Influence: The Psychology of Persuasion by Robert Cialdini",
        "Online course: 'Creative Influence and Inspiration'"
      ],
      realWorldExamples: [
        "Musical sampling and remix culture",
        "Literary influence and homage",
        "Fashion design and trend cycles",
        "Architectural revival movements",
        "Contemporary art's relationship to art history"
      ]
    }
  },
  {
    id: 5,
    title: "Architectural Thinking for Artists",
    description: "Apply architectural principles to enhance your creative work and develop spatial awareness",
    duration: 55,
    difficulty: "Advanced",
    difficultyLevel: 4,
    category: "Spatial Design",
    completed: false,
    content: {
      overview: "Architecture teaches us to think in three dimensions, consider user experience, and create spaces that serve both function and emotion. This lesson explores how architectural principles can enhance any creative practice, from visual art to digital design. Learn to think spatially, consider scale and proportion, and create work that engages with its environment.",
      keyConcepts: [
        "Spatial thinking and 3D awareness",
        "Scale, proportion, and human factors",
        "Light, shadow, and materiality",
        "User experience and interaction design",
        "Environmental context and site-specific work",
        "Structural thinking and problem-solving"
      ],
      practicalExercises: [
        "Design a space for a specific creative activity",
        "Create a site-specific installation concept",
        "Develop a 3D model of an abstract idea",
        "Study and document architectural details",
        "Design an interactive public art piece"
      ],
      resources: [
        "The Architecture of Happiness by Alain de Botton",
        "Thinking Architecture by Peter Zumthor",
        "Architecture: Form, Space, and Order by Francis D.K. Ching",
        "Documentary: 'Abstract: The Art of Design - Architecture'",
        "Online course: 'Introduction to Architecture'"
      ],
      realWorldExamples: [
        "Olafur Eliasson's architectural installations",
        "James Turrell's light and space works",
        "Christo and Jeanne-Claude's environmental art",
        "Contemporary museum architecture",
        "Digital art and virtual spaces"
      ]
    }
  },
  {
    id: 6,
    title: "Synesthesia & Multisensory Creation",
    description: "Explore the intersection of senses in creative work and learn to create multisensory experiences",
    duration: 50,
    difficulty: "Advanced",
    difficultyLevel: 4,
    category: "Sensory Design",
    completed: false,
    content: {
      overview: "Synesthesia is a neurological condition where stimulation of one sense leads to automatic experiences in another sense. This lesson explores how artists can create multisensory experiences that engage multiple senses simultaneously, creating more immersive and memorable creative work. Learn to think beyond visual design and consider sound, touch, smell, and taste in your creative practice.",
      keyConcepts: [
        "Cross-modal perception and synesthesia",
        "Multisensory design principles",
        "Sound design and visual music",
        "Tactile and haptic experiences",
        "Scent and memory in art",
        "Immersive installation design"
      ],
      practicalExercises: [
        "Create a visual representation of a piece of music",
        "Design a multisensory installation concept",
        "Develop a tactile art piece",
        "Create a scent-based artwork",
        "Design an interactive multisensory experience"
      ],
      resources: [
        "The Man Who Tasted Shapes by Richard Cytowic",
        "Synesthesia: A Union of the Senses by Richard Cytowic",
        "Multisensory Design by Stephen Anderson",
        "Documentary: 'The Mind's Eye'",
        "Online course: 'Multisensory Design'"
      ],
      realWorldExamples: [
        "Wassily Kandinsky's synesthetic paintings",
        "Contemporary immersive art installations",
        "Multisensory museum experiences",
        "Virtual reality and haptic feedback",
        "Sensory branding in commercial design"
      ]
    }
  }
]

export default function SkillDropsPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const { session } = useSessionSafe()

  useEffect(() => {
    if (session?.user?.id) {
      const savedCompletedLessons = session.user.completedLessons || []
      setCompletedLessons(savedCompletedLessons)
    }
  }, [session])

  const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0)
  const completedCount = completedLessons.length
  const progressPercentage = (completedCount / lessons.length) * 100

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings)
    // Here you would typically save to localStorage, database, etc.
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="relative z-10 main-container">
        <HorizontalNav onSettingsClick={() => setIsSettingsModalOpen(true)} />
        <main className="pt-24">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-1">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Skill<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39d2c0] to-cyan-300 animate-shimmer">Drops</span>
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Daily creativity lessons and articles</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{completedCount}/{lessons.length} lessons</p>
                  </div>
                  <div className="w-32">
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Course Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg skilldrops-icon">
                    <BookOpen className="w-6 h-6 text-[#39d2c0]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Lessons</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{lessons.length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg skilldrops-icon">
                    <Clock className="w-6 h-6 text-[#39d2c0]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Duration</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{totalDuration} minutes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg skilldrops-icon">
                    <Users className="w-6 h-6 text-[#39d2c0]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Difficulty</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">Mixed Levels</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="hover:shadow-lg hover:shadow-[#39d2c0]/20 hover:ring-2 hover:ring-[#39d2c0]/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer group dark:bg-gray-800 dark:border-gray-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-[#39d2c0] transition-colors">
                          {lesson.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {lesson.description}
                        </CardDescription>
                      </div>
                      {completedLessons.includes(lesson.id) && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{lesson.duration} min</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {lesson.category}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedLesson(lesson)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start Lesson
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSettingsSave}
      />

      {/* Lesson Detail Modal */}
      {selectedLesson && (
        <LessonDetailModal
          lesson={selectedLesson}
          isOpen={!!selectedLesson}
          onClose={() => setSelectedLesson(null)}
          onComplete={() => {
            if (!completedLessons.includes(selectedLesson.id)) {
              setCompletedLessons([...completedLessons, selectedLesson.id])
            }
            setSelectedLesson(null)
          }}
        />
      )}
    </div>
  )
}
