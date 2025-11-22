"use client"

import { useState, useEffect } from "react"
import { Search, Globe, FileText, Brain, CheckCircle, Clock } from "lucide-react"

interface ResearchThinkingProps {
  className?: string
  topic?: string
}

export function ResearchThinking({ className = "", topic = "your request" }: ResearchThinkingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])


  const generateResearchSteps = (topic: string) => {
    const lowerTopic = topic.toLowerCase()
    
    // Generate contextual research steps based on the topic
    let steps = []
    
    // Always start with workspace check
    steps.push({
      id: 1,
      icon: Search,
      title: `${topic} notes and information`,
      description: "Checking your workspace for any existing notes or content",
      type: "workspace"
    })
    
    // Generate topic-specific research steps
    if (lowerTopic.includes('war') || lowerTopic.includes('battle') || lowerTopic.includes('conflict')) {
      steps.push(
        {
          id: 2,
          icon: Globe,
          title: `Timeline of major events in ${topic}`,
          description: "Gathering comprehensive timeline and key battles",
          type: "research"
        },
        {
          id: 3,
          icon: Globe,
          title: `Causes and outbreak of ${topic}`,
          description: "Analyzing political tensions and triggering events",
          type: "research"
        },
        {
          id: 4,
          icon: Globe,
          title: `Key leaders and commanders in ${topic}`,
          description: "Identifying major military and political figures",
          type: "research"
        },
        {
          id: 5,
          icon: Globe,
          title: `Impact and aftermath of ${topic}`,
          description: "Evaluating casualties, territorial changes, and long-term effects",
          type: "research"
        }
      )
    } else if (lowerTopic.includes('ai') || lowerTopic.includes('artificial intelligence') || lowerTopic.includes('technology')) {
      steps.push(
        {
          id: 2,
          icon: Globe,
          title: `Evolution and development of ${topic}`,
          description: "Tracing technological milestones and breakthroughs",
          type: "research"
        },
        {
          id: 3,
          icon: Globe,
          title: `Key technologies and applications in ${topic}`,
          description: "Exploring current implementations and use cases",
          type: "research"
        },
        {
          id: 4,
          icon: Globe,
          title: `Leading researchers and companies in ${topic}`,
          description: "Identifying key innovators and industry leaders",
          type: "research"
        },
        {
          id: 5,
          icon: Globe,
          title: `Future implications of ${topic}`,
          description: "Analyzing potential impact and ethical considerations",
          type: "research"
        }
      )
    } else if (lowerTopic.includes('climate') || lowerTopic.includes('environment') || lowerTopic.includes('global warming')) {
      steps.push(
        {
          id: 2,
          icon: Globe,
          title: `Scientific evidence for ${topic}`,
          description: "Gathering climate data and research findings",
          type: "research"
        },
        {
          id: 3,
          icon: Globe,
          title: `Causes and contributing factors of ${topic}`,
          description: "Analyzing greenhouse gases and human activities",
          type: "research"
        },
        {
          id: 4,
          icon: Globe,
          title: `Global initiatives addressing ${topic}`,
          description: "Reviewing international agreements and policies",
          type: "research"
        },
        {
          id: 5,
          icon: Globe,
          title: `Future projections and solutions for ${topic}`,
          description: "Evaluating mitigation strategies and adaptation measures",
          type: "research"
        }
      )
    } else if (lowerTopic.includes('business') || lowerTopic.includes('marketing') || lowerTopic.includes('strategy')) {
      steps.push(
        {
          id: 2,
          icon: Globe,
          title: `Market analysis for ${topic}`,
          description: "Researching industry trends and competitive landscape",
          type: "research"
        },
        {
          id: 3,
          icon: Globe,
          title: `Best practices and case studies in ${topic}`,
          description: "Analyzing successful strategies and implementations",
          type: "research"
        },
        {
          id: 4,
          icon: Globe,
          title: `Key metrics and KPIs for ${topic}`,
          description: "Identifying performance indicators and measurement tools",
          type: "research"
        },
        {
          id: 5,
          icon: Globe,
          title: `Implementation roadmap for ${topic}`,
          description: "Developing actionable steps and timeline",
          type: "research"
        }
      )
    } else {
      // Generic research steps for other topics
      steps.push(
        {
          id: 2,
          icon: Globe,
          title: `Overview and background of ${topic}`,
          description: "Gathering foundational information and context",
          type: "research"
        },
        {
          id: 3,
          icon: Globe,
          title: `Key aspects and components of ${topic}`,
          description: "Breaking down main elements and characteristics",
          type: "research"
        },
        {
          id: 4,
          icon: Globe,
          title: `Current trends and developments in ${topic}`,
          description: "Researching recent updates and innovations",
          type: "research"
        },
        {
          id: 5,
          icon: Globe,
          title: `Implications and future of ${topic}`,
          description: "Analyzing significance and potential outcomes",
          type: "research"
        }
      )
    }
    
    return steps
  }

  const researchSteps = generateResearchSteps(topic)

  const generateIntroText = (topic: string) => {
    const lowerTopic = topic.toLowerCase()
    
    // Generate contextual introduction based on the topic
    if (lowerTopic.includes('notion') || lowerTopic.includes('business')) {
      return (
        <>
          Sure, let me do a deep research on <span className="font-semibold text-gray-900 dark:text-gray-100">{topic}</span>. I'll start by checking your workspace for any existing notes or content about this topic. Then, I'll dive into comprehensive research covering market analysis, business strategies, competitive landscape, and key insights that could help you understand this space better.
        </>
      )
    } else if (lowerTopic.includes('war') || lowerTopic.includes('battle') || lowerTopic.includes('conflict')) {
      return (
        <>
          Absolutely! Let me conduct thorough research on <span className="font-semibold text-gray-900 dark:text-gray-100">{topic}</span>. I'll begin by checking your workspace for any existing notes or content. Then, I'll gather comprehensive information about the timeline, key events, major figures, causes, and long-term impact of this historical period.
        </>
      )
    } else if (lowerTopic.includes('ai') || lowerTopic.includes('artificial intelligence') || lowerTopic.includes('technology')) {
      return (
        <>
          Perfect! Let me dive deep into researching <span className="font-semibold text-gray-900 dark:text-gray-100">{topic}</span>. I'll start by checking your workspace for any existing notes or content. Then, I'll explore the latest developments, key technologies, industry leaders, applications, and future implications to give you a comprehensive understanding.
        </>
      )
    } else if (lowerTopic.includes('climate') || lowerTopic.includes('environment') || lowerTopic.includes('global warming')) {
      return (
        <>
          Excellent! Let me conduct comprehensive research on <span className="font-semibold text-gray-900 dark:text-gray-100">{topic}</span>. I'll begin by checking your workspace for any existing notes or content. Then, I'll gather scientific data, analyze causes and effects, explore solutions, and examine global initiatives to provide you with thorough insights.
        </>
      )
    } else if (lowerTopic.includes('business') || lowerTopic.includes('marketing') || lowerTopic.includes('strategy')) {
      return (
        <>
          Great! Let me do an in-depth research on <span className="font-semibold text-gray-900 dark:text-gray-100">{topic}</span>. I'll start by checking your workspace for any existing notes or content. Then, I'll analyze market trends, best practices, case studies, key metrics, and implementation strategies to give you actionable insights.
        </>
      )
    } else {
      return (
        <>
          Sure, let me do a deep research on <span className="font-semibold text-gray-900 dark:text-gray-100">{topic}</span>. I'll start by checking your workspace for any existing notes or content. Then, I'll gather comprehensive information covering key aspects, current trends, important developments, and practical insights to give you a thorough understanding.
        </>
      )
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % researchSteps.length
        if (nextStep === 0) {
          // Reset and start over
          setCompletedSteps([])
          return 0
        }
        return nextStep
      })
    }, 2000) // Change step every 2 seconds

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Mark current step as completed after a delay
    const timer = setTimeout(() => {
      setCompletedSteps(prev => [...prev, currentStep])
    }, 1500)

    return () => clearTimeout(timer)
  }, [currentStep])

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full animate-spin">
            <div className="w-2 h-2 bg-[#39d2c0] rounded-full absolute top-0 left-1/2 transform -translate-x-1/2"></div>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Researching
        </h3>
      </div>

      {/* Introduction */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        {generateIntroText(topic)}
      </p>

      {/* Research Steps */}
      <div className="space-y-4">
        {researchSteps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = completedSteps.includes(index)
          
          return (
            <div
              key={step.id}
              className={`flex items-start gap-4 p-4 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-[#39d2c0]/10 border border-[#39d2c0]/20' 
                  : isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600'
              }`}
            >
              {/* Icon */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : isActive
                  ? 'bg-[#39d2c0] text-white animate-pulse'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium mb-1 ${
                  isActive 
                    ? 'text-[#39d2c0] dark:text-[#39d2c0]' 
                    : isCompleted
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {step.title}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {step.description}
                </p>
                
                {/* Progress indicator for active step */}
                {isActive && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-[#39d2c0] rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-[#39d2c0] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-1 h-1 bg-[#39d2c0] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-xs text-[#39d2c0] font-medium">In progress...</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <span>Research Beta</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Processing complex request...</span>
          </div>
        </div>
      </div>
    </div>
  )
}
