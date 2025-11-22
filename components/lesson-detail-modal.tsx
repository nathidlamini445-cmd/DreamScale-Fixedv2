"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { X, Clock, Star, BookOpen, Lightbulb, CheckCircle, Users, Play, ExternalLink } from "lucide-react"

interface Lesson {
  id: number
  title: string
  description: string
  duration: number
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  difficultyLevel: number
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

interface LessonDetailModalProps {
  lesson: Lesson
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function LessonDetailModal({ lesson, isOpen, onClose, onComplete }: LessonDetailModalProps) {
  const [activeSection, setActiveSection] = useState("overview")

  if (!isOpen) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    }
  }

  const getDifficultyStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < level ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ))
  }

  const sidebarSections = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "concepts", label: "Key Concepts", icon: Lightbulb },
    { id: "philosophy", label: "Core Philosophy", icon: Star },
    { id: "figures", label: "Key Figures", icon: Users },
    { id: "techniques", label: "Techniques", icon: Play },
    { id: "impact", label: "Modern Impact", icon: ExternalLink }
  ]

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Lesson Overview</h2>
                <p className="text-sm text-gray-500 dark:text-gray-300">Deep dive into the core concepts and philosophy</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={onComplete}
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Lesson Description</p>
                <p className="text-sm text-gray-600 leading-relaxed">{lesson.content.overview}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Duration</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{lesson.duration} minutes</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Difficulty</p>
                  <div className="flex items-center space-x-2">
                    <Badge className={getDifficultyColor(lesson.difficulty)}>
                      {lesson.difficulty}
                    </Badge>
                    <div className="flex space-x-1">
                      {getDifficultyStars(lesson.difficultyLevel)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case "concepts":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Key Concepts</h2>
                <p className="text-sm text-gray-500">Essential ideas and principles to master</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={onComplete}
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              {lesson.content.keyConcepts.map((concept, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3 text-lg">{concept.split(':')[0]}</h4>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">{concept.split(':')[1]}</p>
                      
                      {/* Detailed explanations for each concept */}
                      {index === 0 && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-semibold text-gray-800 mb-2">Deep Dive:</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Freud's revolutionary discovery that our conscious mind actively suppresses thoughts, memories, and desires that society deems unacceptable. The surrealists believed this suppressed material contained the most authentic expressions of human nature. Dreams, slips of the tongue, and "accidental" creative acts were seen as windows into this hidden realm where our true selves reside.
                          </p>
                        </div>
                      )}
                      
                      {index === 1 && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-semibold text-gray-800 mb-2">Deep Dive:</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            A technique where the artist attempts to bypass conscious control entirely, allowing the hand to move freely without premeditation. This could involve writing continuously without lifting the pen, or drawing with eyes closed. The goal was to access a state of "pure creativity" where the unconscious could express itself directly, unfiltered by rational thought or artistic training.
                          </p>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-semibold text-gray-800 mb-2">Deep Dive:</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Dreams were considered the "royal road to the unconscious" by Freud, and surrealists saw them as a direct line to authentic creativity. They studied dream imagery for its symbolic content, illogical narratives, and emotional power. Many surrealist works directly incorporated dream elements, creating visual equivalents of the dream experience.
                          </p>
                        </div>
                      )}
                      
                      {index === 3 && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-semibold text-gray-800 mb-2">Deep Dive:</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            The surrealist technique of placing unrelated objects together to create unexpected meanings and emotional responses. This could be as simple as placing a lobster on a telephone, or as complex as creating entire environments where normal logic doesn't apply. The goal was to shock the viewer out of their rational expectations and into a more open, receptive state.
                          </p>
                        </div>
                      )}
                      
                      {index === 4 && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-semibold text-gray-800 mb-2">Deep Dive:</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            Breton's definition of surrealism as "pure psychic automatism" meant creating without any rational interference whatsoever. This wasn't just about making art—it was about accessing a deeper level of consciousness where creativity flows naturally, without the constraints of logic, morality, or artistic convention. It was a way of being creative that was completely free from conscious control.
                          </p>
                        </div>
                      )}
                      
                      {index === 5 && (
                        <div className="bg-white p-4 rounded-lg border border-blue-100">
                          <h5 className="font-semibold text-gray-800 mb-2">Deep Dive:</h5>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            The ultimate goal of surrealism was to create a "super-reality" that combined the conscious and unconscious worlds. This wasn't about escaping reality, but about expanding it to include the full spectrum of human experience—dreams, fantasies, fears, and desires. In this super-reality, the impossible becomes possible, and the irrational becomes rational.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      
      case "philosophy":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Core Philosophy</h2>
                <p className="text-sm text-gray-500">The fundamental beliefs and principles of Surrealism</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={onComplete}
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              </div>
            </div>
            <div className="space-y-8">
              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">The Birth of Super-Reality</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    At its heart, Surrealism sought to reconcile the unconscious with reality, creating a "super-reality" (the literal meaning of surreal). This wasn't just an artistic technique—it was a revolutionary way of thinking about existence itself. The surrealists believed that the rational world we perceive is only a thin veneer over a much richer, more complex reality that exists in our dreams, fantasies, and unconscious minds.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This super-reality wasn't meant to escape from the real world, but to expand it. By accessing the unconscious, artists could reveal truths that logic and reason could never uncover—truths about desire, fear, love, death, and the fundamental mysteries of human existence.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">The Crisis of Rationalism</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      The devastation of World War I shattered the Enlightenment belief in human progress through reason. The surrealists saw the war as proof that rationalism had failed humanity. They rejected the idea that logic alone could solve human problems or create meaningful art.
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">The Power of the Irrational</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Instead of reason, surrealists turned to the irrational as a source of truth and liberation. They believed that dreams, madness, and unconscious desires held more authentic insights into human nature than any rational analysis could provide.
                    </p>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 text-lg">Pure Psychic Automatism</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    André Breton defined surrealism as "pure psychic automatism," meaning an act of creation completely free from rational interference. This wasn't just about making art—it was about accessing a deeper level of consciousness where creativity flows without censorship or control.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    The concept of automatism challenged the very idea of authorship. If the unconscious is the true creator, then the artist becomes merely a conduit, a medium through which deeper truths can emerge. This democratized creativity—anyone could access their unconscious and create meaningful art.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    This philosophy extended beyond art into daily life. Surrealists sought to live automatically, to let their unconscious guide their actions and decisions, creating a new way of being in the world that was more authentic and free.
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-lg">Core Philosophical Principles</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-1">The Unconscious as Truth</h4>
                      <p className="text-sm text-gray-600">The conscious mind lies and deceives; only the unconscious reveals authentic human nature and desires.</p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-1">Chance as Creative Force</h4>
                      <p className="text-sm text-gray-600">Accident and coincidence are not mistakes but revelations of hidden connections and meanings.</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-1">Revolution Through Art</h4>
                      <p className="text-sm text-gray-600">Artistic creation is a political act that can transform society by changing how people think and perceive.</p>
                    </div>
                    <div className="border-l-4 border-red-500 pl-4">
                      <h4 className="font-semibold text-gray-900 mb-1">The Marvelous in the Everyday</h4>
                      <p className="text-sm text-gray-600">Extraordinary beauty and meaning exist in ordinary objects when viewed through the lens of the unconscious.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case "figures":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Key Figures</h2>
                <p className="text-sm text-gray-500">The pioneers who shaped the Surrealist movement</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={onComplete}
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">André Breton</h3>
                  <p className="text-sm text-gray-600">The writer and theorist who established the philosophical foundation of Surrealism. His manifestos defined its goals and boundaries.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Salvador Dalí</h3>
                  <p className="text-sm text-gray-600">Known for his hyperrealistic dreamscapes filled with melting clocks, distorted figures, and Freudian symbolism (The Persistence of Memory, 1931).</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">René Magritte</h3>
                  <p className="text-sm text-gray-600">Explored perception and logic through ordinary objects placed in strange contexts (The Son of Man, The Treachery of Images).</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Max Ernst</h3>
                  <p className="text-sm text-gray-600">Pioneered collage and "frottage" (rubbing textures to form accidental images). His work visualized dream logic and subconscious associations.</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Joan Miró</h3>
                  <p className="text-sm text-gray-600">Used biomorphic forms and abstract symbols inspired by dreams and automatism, balancing playfulness with depth.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case "techniques":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Techniques and Practices</h2>
                <p className="text-sm text-gray-500">Methods to unlock creativity by disrupting conscious control</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={onComplete}
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 text-xl">The Surrealist Toolkit</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  These techniques were designed to bypass conscious control and access the unconscious mind directly. Each method serves a specific purpose in the surrealist creative process, from breaking down rational barriers to accessing deeper levels of consciousness.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-xl">Automatic Writing</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        The cornerstone of surrealist technique, automatic writing involves writing continuously without planning, editing, or thinking. The goal is to let thoughts spill directly from the unconscious, bypassing all rational control.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-blue-100 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">How to Practice:</h4>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                          <li>Set a timer for 10-15 minutes</li>
                          <li>Write continuously without stopping or lifting your pen</li>
                          <li>Don't read what you've written until the session is complete</li>
                          <li>If you get stuck, write "I don't know what to write" and continue</li>
                          <li>Let your hand move freely across the page</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-blue-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Advanced Techniques:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Try writing with your non-dominant hand, or while in different emotional states. Some surrealists wrote while walking, others while in a trance-like state. The key is to find the conditions that allow your unconscious to emerge most freely.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-xl">Exquisite Corpse</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        A collaborative game where multiple artists contribute to a single image or text without seeing what others have done. This technique was named after the first sentence created: "The exquisite corpse will drink the new wine."
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-green-100 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">How to Play:</h4>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                          <li>Take a piece of paper and fold it into sections (one per participant)</li>
                          <li>First person draws a head, then folds the paper to hide it</li>
                          <li>Next person draws a torso without seeing the head</li>
                          <li>Continue until the figure is complete</li>
                          <li>Unfold to reveal the collaborative creation</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-green-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Variations:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Try with words instead of images, or with different themes. You can also play with time limits, or have participants work in different locations and mail the pieces to each other. The goal is to create something that no single person could have imagined alone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-xl">Dream Recording</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Keeping detailed dream journals to capture the raw material of the unconscious mind. Dreams were considered the "royal road to the unconscious" and provided endless inspiration for surrealist works.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-purple-100 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Dream Journal Method:</h4>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                          <li>Keep a notebook and pen by your bed</li>
                          <li>Write immediately upon waking, before getting out of bed</li>
                          <li>Record everything, even fragments and feelings</li>
                          <li>Don't try to make sense of the dream while writing</li>
                          <li>Include colors, sounds, emotions, and physical sensations</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-purple-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Using Dreams in Art:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Look for recurring symbols, strange juxtapositions, and emotional themes. Create visual representations of dream imagery, or use dream narratives as starting points for stories and poems. The goal is to capture the illogical, emotional quality of dreams in your conscious creative work.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-xl">Collage & Assemblage</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Combining found images, objects, and materials to create new, irrational compositions. This technique allowed surrealists to work with pre-existing elements and create unexpected meanings through juxtaposition.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-yellow-100 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Collage Techniques:</h4>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                          <li>Collect images from magazines, newspapers, and books</li>
                          <li>Cut out elements without thinking about their original context</li>
                          <li>Arrange them on a surface and glue them down</li>
                          <li>Don't try to make logical sense of the combination</li>
                          <li>Let the juxtaposition create its own meaning</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-yellow-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Assemblage Methods:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          For 3D works, collect found objects and arrange them in unexpected ways. Consider scale, texture, and material. The goal is to create something that challenges our normal understanding of how objects relate to each other. Think of it as creating a visual poem where each object is a word.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-rose-50 p-6 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">5</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-xl">Frottage & Grattage</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Techniques developed by Max Ernst that use chance and texture to reveal hidden forms. Frottage involves rubbing a pencil over textured surfaces, while grattage involves scraping paint to reveal underlying layers.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-red-100 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Frottage Method:</h4>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                          <li>Place paper over textured surfaces (wood grain, fabric, leaves)</li>
                          <li>Rub with pencil, charcoal, or crayon</li>
                          <li>Let the texture guide your hand</li>
                          <li>Look for shapes and forms that emerge</li>
                          <li>Develop these into finished drawings</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-red-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Grattage Process:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Apply thick layers of paint to canvas, then place textured objects underneath. Scrape away the paint to reveal the texture below. This creates unexpected patterns and forms that can be developed into finished artworks. The key is to let chance guide the process rather than trying to control the outcome.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">6</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-3 text-xl">Chance Operations</h3>
                      <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        Using random methods to make creative decisions, allowing chance to guide the artistic process. This technique removes the artist's conscious control and lets the unconscious emerge through random selection.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-indigo-100 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Chance Methods:</h4>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                          <li>Roll dice to determine composition elements</li>
                          <li>Use random number generators for color choices</li>
                          <li>Throw darts at a board to select words or images</li>
                          <li>Use a random word generator for inspiration</li>
                          <li>Let the weather or other external factors guide your work</li>
                        </ul>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-indigo-100">
                        <h4 className="font-semibold text-gray-800 mb-2">Modern Applications:</h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Today, artists use computer algorithms, AI, and digital tools to create chance-based art. The principle remains the same: remove conscious control and let randomness guide the creative process. This can lead to unexpected discoveries and new ways of thinking about art and creativity.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case "impact":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Modern Impact</h2>
                <p className="text-sm text-gray-500">How Surrealism continues to influence creativity today</p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClose}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={onComplete}
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark Complete
                </Button>
              </div>
            </div>
            <div className="space-y-8">
              <div className="prose max-w-none">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">The Surrealist Revolution in Cinema</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Surrealism fundamentally transformed cinema from a medium of storytelling into a tool for exploring the unconscious mind. Luis Buñuel's <em>Un Chien Andalou</em> (1929) remains one of the most shocking and influential films ever made, using dream logic to create a narrative that defies rational explanation.
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    The film's famous opening sequence—where a woman's eye is sliced with a razor blade—wasn't meant to shock for shock's sake, but to jolt viewers out of their rational expectations and into a state of heightened awareness where the unconscious could emerge.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Classic Surrealist Films</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• <em>Un Chien Andalou</em> (1929) - Buñuel & Dalí</li>
                        <li>• <em>L'Âge d'Or</em> (1930) - Buñuel</li>
                        <li>• <em>Meshes of the Afternoon</em> (1943) - Maya Deren</li>
                        <li>• <em>Last Year at Marienbad</em> (1961) - Alain Resnais</li>
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Modern Surrealist Directors</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• David Lynch - <em>Mulholland Drive</em></li>
                        <li>• Christopher Nolan - <em>Inception</em></li>
                        <li>• Michel Gondry - <em>Eternal Sunshine</em></li>
                        <li>• Charlie Kaufman - <em>Synecdoche, New York</em></li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">Surrealism in Contemporary Art & Design</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Today's artists continue to push the boundaries of surrealist expression, often combining traditional techniques with cutting-edge technology. Digital artists use algorithms to create "automatic" compositions, while installation artists create immersive environments that challenge our perception of reality.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Digital Surrealism</h4>
                      <p className="text-sm text-gray-600">AI-generated art that mimics unconscious associations, creating dreamlike imagery through machine learning algorithms.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Fashion & Design</h4>
                      <p className="text-sm text-gray-600">Elsa Schiaparelli's collaborations with Dalí inspired decades of surrealist fashion, from Alexander McQueen to Iris van Herpen.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Architecture</h4>
                      <p className="text-sm text-gray-600">Buildings that challenge conventional space and form, like Frank Gehry's Guggenheim Bilbao or Zaha Hadid's fluid structures.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">Surrealism in Psychology & Therapy</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    The therapeutic applications of surrealist techniques have revolutionized mental health treatment. Art therapy, dream analysis, and creative expression are now standard tools for helping people access and process unconscious material.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Art Therapy</h4>
                      <p className="text-sm text-gray-600">Using automatic drawing and collage to help patients express unconscious thoughts and emotions in a safe, non-verbal way.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Dream Work</h4>
                      <p className="text-sm text-gray-600">Techniques for recording and analyzing dreams to gain insights into unconscious patterns and desires.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-purple-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">Surrealism in Business & Innovation</h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    Companies are increasingly using surrealist techniques for creative problem-solving and innovation. The concept of "thinking outside the box" is essentially a business application of surrealist juxtaposition and automatic thinking.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Design Thinking & Innovation</h4>
                      <p className="text-sm text-gray-600">Using random word association, mind mapping, and "what if" scenarios to generate breakthrough ideas and solutions.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Marketing & Advertising</h4>
                      <p className="text-sm text-gray-600">Surrealist imagery and concepts are used to create memorable, emotionally resonant advertisements that bypass rational resistance.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-4 text-xl">Practical Applications for Modern Creators</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Daily Practices</h4>
                      <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                        <li>Keep a dream journal — draw or write immediately after waking to catch raw imagery</li>
                        <li>Try automatic sketching or writing for 10 minutes; don't stop or censor</li>
                        <li>Use juxtaposition exercises: combine random words, images, or concepts to form new ideas</li>
                        <li>Observe your environment and note what feels slightly off — explore that unease in your creative work</li>
                        <li>Create something deliberately irrational, then find meaning afterwards</li>
                        <li>Practice "exquisite corpse" with friends or colleagues for collaborative creativity</li>
                        <li>Use chance operations (dice, random number generators) to make creative decisions</li>
                        <li>Create "found poetry" by cutting up and rearranging existing texts</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Advanced Techniques</h4>
                      <ul className="text-sm text-gray-700 space-y-2 list-disc list-inside">
                        <li>Develop your own personal symbols and mythology through repeated imagery</li>
                        <li>Create "automatic" music or soundscapes using random selection methods</li>
                        <li>Use technology to simulate unconscious processes (AI art, random generators)</li>
                        <li>Practice "walking meditation" to access a trance-like creative state</li>
                        <li>Create art while in altered states (early morning, late night, after exercise)</li>
                        <li>Use constraints and limitations to force creative breakthroughs</li>
                        <li>Collaborate with people from completely different fields or backgrounds</li>
                        <li>Create "time capsules" of your unconscious thoughts and revisit them later</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="lesson-modal bg-white dark:bg-[#2d3748] rounded-lg w-full max-w-7xl h-[90vh] flex overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 bg-gray-50 dark:bg-[#2d3748] border-r border-gray-200 dark:border-gray-600 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Lesson Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Lesson Info */}
          <div className="mb-6 p-3 bg-white dark:bg-[#2d3748] rounded-lg border border-gray-200 dark:border-gray-600">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm mb-2">{lesson.title}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-300 mb-3">{lesson.description}</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-300">Duration</span>
                <span className="text-xs font-medium text-gray-700 dark:text-white">{lesson.duration} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-300">Difficulty</span>
                <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-300">Category</span>
                <span className="text-xs font-medium text-gray-700 dark:text-white">{lesson.category}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-1">
            {sidebarSections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-all duration-300 group ${
                  activeSection === section.id
                    ? 'bg-gray-200 dark:bg-[#39d2c0] text-gray-900 dark:text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d3748]'
                }`}
              >
                <section.icon className={`w-4 h-4 transition-all duration-300 ${
                  activeSection === section.id 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-[#39d2c0]'
                }`} />
                <span className="truncate">{section.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[90vh] bg-white dark:bg-[#2d3748]">
          {renderContent()}
        </div>

      </div>
    </div>
  )
}
