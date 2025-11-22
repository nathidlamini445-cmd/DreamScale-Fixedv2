"use client"

import { useState, useEffect, useRef } from "react"
import { Inter } from "next/font/google"
import { useSessionSafe } from "@/lib/session-context"
import { Button } from "@/components/ui/button"
import { HorizontalNav } from "@/components/horizontal-nav"
import { AIResponse } from "@/components/ai-response"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})
import { 
  Send, 
  Plus, 
  MessageCircle, 
  Clock, 
  Brain,
  Image as ImageIcon,
  RefreshCw,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  Link,
  FileText,
  X,
  Share,
  Search,
  Sparkles,
  Globe,
  Square,
  Trash2,
  Menu
} from "lucide-react"
import { ThinkingAnimation } from "@/components/thinking-animation"
import { ResearchThinking } from "@/components/research-thinking"
import { ShareModal } from "@/components/share-modal"

// Utility to merge conversations uniquely by id
function mergeConversations(
  existing: { id: string, title: string, lastMessage: string, timestamp: Date, messages: any[] }[],
  incoming: { id: string, title: string, lastMessage: string, timestamp: Date, messages: any[] }[],
) {
  const byId: Record<string, { id: string, title: string, lastMessage: string, timestamp: Date, messages: any[] }> = {}
  for (const conv of existing) {
    byId[conv.id] = conv
  }
  for (const conv of incoming) {
    const current = byId[conv.id]
    if (!current) {
      byId[conv.id] = conv
    } else {
      // Prefer conversation with more messages; otherwise, keep the latest timestamp
      const preferIncoming = (conv.messages?.length || 0) > (current.messages?.length || 0)
        || new Date(conv.timestamp).getTime() > new Date(current.timestamp).getTime()
      if (preferIncoming) byId[conv.id] = conv
    }
  }
  return Object.values(byId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

interface Message {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
  attachments?: Attachment[]
}

interface Attachment {
  id: string
  name: string
  type: 'file' | 'link'
  url?: string
  file?: File
  content?: string
  processed?: boolean
}

export default function BizoraAIPage() {
  const sessionContext = useSessionSafe()
  const [currentMessage, setCurrentMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<{id: string, title: string, lastMessage: string, timestamp: Date, messages: Message[]}[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [shareModal, setShareModal] = useState<{isOpen: boolean, messageContent: string, conversationTitle?: string}>({
    isOpen: false,
    messageContent: "",
    conversationTitle: undefined
  })
  const [isComplexThinking, setIsComplexThinking] = useState(false)
  const [currentResearchTopic, setCurrentResearchTopic] = useState("")
  const [isDeepResearch, setIsDeepResearch] = useState(false)
  const [showGlowEffect, setShowGlowEffect] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const hasLoadedRef = useRef(false) // Track if we've loaded initial data
  const isSavingRef = useRef(false) // Prevent saving during initial load
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  // Load sidebar collapsed state from localStorage
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('bizora:sidebarCollapsed') : null
      if (saved !== null) {
        setIsSidebarCollapsed(JSON.parse(saved))
      }
    } catch (e) {
      console.warn('Failed to load sidebar state from localStorage', e)
    }
  }, [])

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('bizora:sidebarCollapsed', JSON.stringify(isSidebarCollapsed))
      }
    } catch (e) {
      console.warn('Failed to save sidebar state to localStorage', e)
    }
  }, [isSidebarCollapsed])

  // Load conversations from session
  useEffect(() => {
    // Load from localStorage first (fast path) - PRIORITY
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('bizora:conversations') : null
      console.log('Loading from localStorage:', saved ? 'found data' : 'no data')
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log('Parsed conversations:', parsed.length)
        const withDates = (parsed || []).map((conv: any) => ({
          ...conv,
          timestamp: typeof conv.timestamp === 'string' ? new Date(conv.timestamp) : conv.timestamp,
          messages: (conv.messages || []).map((msg: any) => ({
            ...msg,
            timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
          }))
        }))
        setConversationHistory(withDates)
        console.log('✅ Set conversation history from localStorage (PRIORITY):', withDates.length)
        hasLoadedRef.current = true // Mark as loaded
        // If localStorage has data, DON'T merge with session - localStorage is the source of truth
        // This prevents deleted conversations from being restored from session
        return; // Exit early - localStorage takes priority
      }
    } catch (e) {
      console.warn('Failed to load conversations from localStorage', e)
    }

    // Only load from session if localStorage is empty
    // This ensures deleted conversations stay deleted
    if (sessionContext && sessionContext.sessionData?.chat?.conversations && sessionContext.sessionData.chat.conversations.length > 0) {
      const deserializedConversations = sessionContext.sessionData.chat.conversations.map((conv: any) => ({
        ...conv,
        timestamp: typeof conv.timestamp === 'string' ? new Date(conv.timestamp) : conv.timestamp,
        messages: (conv.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: typeof msg.timestamp === 'string' ? new Date(msg.timestamp) : msg.timestamp
        }))
      }))
      console.log('✅ Loading from session (localStorage empty):', deserializedConversations.length)
      setConversationHistory(deserializedConversations) // Don't merge - just set directly
      hasLoadedRef.current = true // Mark as loaded
    }
  }, [])

  // Save conversations to session whenever they change
  // Note: This runs after state updates, but handleDeleteConversation also updates immediately
  useEffect(() => {
    // Don't save during initial load - wait until we've loaded from localStorage/session
    if (!hasLoadedRef.current || isSavingRef.current) return;
    
    // Only save if sessionContext exists and we have a valid updateChatData function
    // Don't include sessionContext in dependencies to prevent infinite loops
    if (conversationHistory && conversationHistory.length >= 0 && sessionContext?.updateChatData) {
      isSavingRef.current = true; // Prevent re-entry
      // Save even if empty (to ensure deletions persist)
      console.log('💾 Saving Bizora conversations to session:', conversationHistory.length, 'conversations')
      sessionContext.updateChatData({ conversations: conversationHistory })
      // Reset saving flag after a brief delay
      setTimeout(() => {
        isSavingRef.current = false;
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationHistory.length]) // Only depend on length, not the full array or sessionContext

  // Persist conversations to localStorage on change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && conversationHistory.length > 0) {
        console.log('Saving to localStorage:', conversationHistory.length, 'conversations')
        localStorage.setItem('bizora:conversations', JSON.stringify(conversationHistory))
      }
    } catch (e) {
      console.warn('Failed to save conversations to localStorage', e)
    }
  }, [conversationHistory.length])

  // Handle Deep Research toggle with glow effect
  const handleDeepResearchToggle = () => {
    setIsDeepResearch(!isDeepResearch)
    if (!isDeepResearch) {
      setShowGlowEffect(true)
      setTimeout(() => setShowGlowEffect(false), 4000)
    }
  }

  // Handle Deep Research button click - toggle mode and send message
  const handleDeepResearchClick = () => {
    handleDeepResearchToggle()
    if (!isDeepResearch) {
      // If turning ON deep research, send a message to trigger thinking
      setCurrentMessage("Deep research")
      // Force complex thinking mode for deep research
      setIsComplexThinking(true)
      setCurrentResearchTopic("your request")
      // Trigger the send after a brief delay to ensure state is updated
      setTimeout(() => {
        handleSendMessage()
      }, 100)
    }
  }

  // Handle stopping the current request
  const handleStopRequest = () => {
    if (abortController) {
      abortController.abort()
      setAbortController(null)
    }
    setIsThinking(false)
    setIsComplexThinking(false)
    setCurrentResearchTopic("")
  }

  // Generate AI response using API route
  const handleAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Check if this is a research request (either toggle is on or message contains research keywords)
      const isResearchRequest = isDeepResearch || requiresComplexThinking(userMessage)
      
      const controller = new AbortController()
      setAbortController(controller)
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 120 second timeout to allow for thinking/analysis
      
      console.log('Sending API request for:', userMessage)
      // Collect file content from attachments
      const fileContent = attachments
        .filter(att => att.type === 'file' && att.content && att.processed)
        .map(att => `File: ${att.name}\n${att.content}`)
        .join('\n\n---\n\n')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          isResearch: isResearchRequest,
          fileContent: fileContent || undefined
        }),
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      setAbortController(null)
      console.log('API response status:', response.status)

      if (!response.ok) {
        console.error('API request failed with status:', response.status)
        throw new Error('API request failed')
      }

      const data = await response.json()
      console.log('API response data:', data)
      console.log('Response length:', data.response?.length || 0)
      console.log('First 200 chars:', data.response?.substring(0, 200) || 'No response')
      return data.response || 'Sorry, I could not generate a response.'
    } catch (error) {
      setAbortController(null)
      console.error('AI Response Error:', error)
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        })
      }
      // Only use fallback for actual errors, not for successful responses
      if (error instanceof Error && error.name === 'AbortError') {
        return 'Request was cancelled. Please try again.'
      }
      // Fallback to simple response
      return `I understand you're asking about "${userMessage}". Let me provide you with some insights and recommendations.`
    }
  }

  const handleSendMessage = () => {
    if (!currentMessage.trim() && attachments.length === 0) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage("")
    setAttachments([])
    setIsThinking(true)
    
    // Determine if this requires complex thinking
    const needsComplexThinking = requiresComplexThinking(currentMessage)
    setIsComplexThinking(needsComplexThinking)

    // Store the message and research topic before clearing it
    const messageToProcess = currentMessage
    if (needsComplexThinking) {
      setCurrentResearchTopic(extractTopic(currentMessage))
    }

    // Simulate AI thinking and response
    const thinkingDuration = needsComplexThinking ? 60000 : 7000 // 60 seconds for complex, 7 seconds for normal
    
    setTimeout(async () => {
      let aiResponse: Message
      
      try {
        const aiContent = await handleAIResponse(messageToProcess)
        
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: aiContent,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, aiResponse])
      } catch (error) {
        console.error('Error generating AI response:', error)
        // Fallback response
        aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: `I understand you're asking about "${messageToProcess}". Let me provide you with some insights and recommendations.`,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
      }
      
      setIsThinking(false)
      setIsComplexThinking(false)
      setCurrentResearchTopic("")

      // Update conversation history
      if (messages.length === 0) {
        const conversationId = Date.now().toString()
        const newConversation = {
          id: conversationId,
          title: currentMessage.length > 30 ? currentMessage.substring(0, 30) + "..." : currentMessage,
          lastMessage: aiResponse.content.substring(0, 50) + "...",
          timestamp: new Date(),
          messages: [userMessage, aiResponse]
        }
        setConversationHistory(prev => [newConversation, ...prev])
        setSelectedConversationId(conversationId)
      } else {
        // Update existing conversation
        setConversationHistory(prev => prev.map(conv => 
          conv.id === selectedConversationId 
            ? {
                ...conv,
                lastMessage: aiResponse.content.substring(0, 50) + "...",
                timestamp: new Date(),
                messages: [...conv.messages, userMessage, aiResponse]
              }
            : conv
        ))
      }
    }, thinkingDuration)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newAttachments: Attachment[] = []
      
      for (const file of Array.from(files)) {
        // Process the file to extract content
        const formData = new FormData()
        formData.append('file', file)
        
        try {
          const response = await fetch('/api/process-file', {
            method: 'POST',
            body: formData
          })
          
          if (response.ok) {
            const result = await response.json()
            newAttachments.push({
              id: Date.now().toString() + Math.random(),
              name: file.name,
              type: 'file' as const,
              file: file,
              content: result.file.content,
              processed: true
            })
          } else {
            // Fallback if processing fails
            newAttachments.push({
              id: Date.now().toString() + Math.random(),
              name: file.name,
              type: 'file' as const,
              file: file,
              processed: false
            })
          }
        } catch (error) {
          console.error('Error processing file:', error)
          // Fallback if processing fails
          newAttachments.push({
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: 'file' as const,
            file: file,
            processed: false
          })
        }
      }
      
      setAttachments(prev => [...prev, ...newAttachments])
    }
  }

  const handleLinkAdd = () => {
    if (linkUrl.trim()) {
      const attachment: Attachment = {
        id: Date.now().toString() + Math.random(),
        name: linkUrl,
        type: 'link',
        url: linkUrl
      }
      setAttachments(prev => [...prev, attachment])
      setLinkUrl("")
      setShowLinkInput(false)
    }
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const handleShareMessage = (messageContent: string) => {
    const currentConversation = conversationHistory.find(conv => conv.id === selectedConversationId)
    setShareModal({
      isOpen: true,
      messageContent,
      conversationTitle: currentConversation?.title
    })
  }

  const closeShareModal = () => {
    setShareModal(prev => ({ ...prev, isOpen: false }))
  }

  const requiresComplexThinking = (message: string): boolean => {
    const complexKeywords = [
      'research', 'analyze', 'study', 'investigate', 'explore', 'examine',
      'world war', 'history', 'timeline', 'causes', 'effects', 'impact',
      'comprehensive', 'detailed', 'thorough', 'in-depth', 'complex',
      'battle', 'war', 'conflict', 'politics', 'economics', 'society',
      'deep research', 'thorough research', 'extensive research'
    ]
    
    const lowerMessage = message.toLowerCase()
    return complexKeywords.some(keyword => lowerMessage.includes(keyword))
  }

  const extractTopic = (message: string): string => {
    // Extract the main topic from the message for the research component
    const lowerMessage = message.toLowerCase()
    
    // Remove common research keywords to get the actual topic
    const researchKeywords = ['research', 'study', 'investigate', 'explore', 'analyze', 'about', 'on', 'of']
    let words = message.split(' ').filter(word => 
      !researchKeywords.includes(word.toLowerCase())
    )
    
    // Join the remaining words as the topic
    const topic = words.join(' ')
    
    
    // If no words left after filtering, take the original message
    if (!topic.trim()) {
      return message
    }
    
    // Limit length if too long
    return topic.length > 30 ? topic.substring(0, 30) + '...' : topic
  }

  const handleConversationClick = (conversationId: string) => {
    const conversation = conversationHistory.find(conv => conv.id === conversationId)
    if (conversation) {
      setMessages(conversation.messages)
      setSelectedConversationId(conversationId)
    }
  }

  const handleDeleteConversation = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering the conversation click
    e.preventDefault() // Prevent any default behavior
    
    // Smooth deletion with animation
    const updatedHistory = conversationHistory.filter(conv => conv.id !== conversationId)
    
    // If the deleted conversation was selected, clear the messages
    if (selectedConversationId === conversationId) {
      setMessages([])
      setSelectedConversationId(null)
    }
    
    // Update state with smooth transition
    setConversationHistory(updatedHistory)
    
    // CRITICAL: Update localStorage FIRST (immediate persistence)
    try {
      if (typeof window !== 'undefined') {
        if (updatedHistory.length > 0) {
          localStorage.setItem('bizora:conversations', JSON.stringify(updatedHistory))
          console.log('✅ Deleted conversation - saved to localStorage:', updatedHistory.length, 'remaining')
        } else {
          localStorage.removeItem('bizora:conversations')
          console.log('✅ Deleted conversation - cleared localStorage (no conversations left)')
        }
      }
    } catch (error) {
      console.error('❌ Failed to update localStorage after delete', error)
    }
    
    // Update session data IMMEDIATELY (don't wait for useEffect)
    if (sessionContext) {
      sessionContext.updateChatData({ conversations: updatedHistory })
      console.log('✅ Deleted conversation - updated session context')
    }
  }

  const formatTime = (date: Date | string) => {
    try {
      // Convert string to Date if needed
      const dateObj = typeof date === 'string' ? new Date(date) : date
      
      // Check if it's a valid date
      if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
        return 'Invalid date'
      }
      
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (error) {
      console.error('Error formatting time:', error)
      return 'N/A'
    }
  }

  return (
    <div className={`flex flex-col min-h-screen bg-white dark:bg-gray-900 ${inter.variable}`} style={{ fontFamily: 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {/* Navigation - Ensure it's always on top and clickable */}
      <HorizontalNav />

      <div className="flex flex-1 overflow-hidden pt-16 relative z-0">
        {/* Left Panel - Recent Activity - FIXED */}
        <div className={`${isSidebarCollapsed ? 'w-16' : 'w-80'} bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed left-0 top-16 h-[calc(100vh-64px)] z-10 overflow-hidden transition-all duration-300 ease-in-out`} style={{ maxHeight: 'calc(100vh - 64px)' }}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h2 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 transition-all duration-300 ${isSidebarCollapsed ? 'hidden' : ''}`}>Recent Activity</h2>
                <button
                  onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group flex-shrink-0"
                  title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                  <Menu className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-[#39d2c0] transition-colors" />
                </button>
              </div>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMessages([])
                      setCurrentMessage("")
                      setSelectedConversationId(null)
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                    title="Start new chat"
                  >
                    <Plus className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-[#39d2c0] transition-colors" />
                  </button>
                  <button
                    onClick={() => {
                      console.log('Current conversations:', conversationHistory.length)
                      console.log('localStorage data:', localStorage.getItem('bizora:conversations'))
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
                    title="Debug localStorage"
                  >
                    <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-[#39d2c0] transition-colors" />
                  </button>
                </div>
              )}
            </div>
          </div>
                
          {/* Recent Activity List */}
          <div className={`flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 ${isSidebarCollapsed ? 'hidden' : ''}`} style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(107, 114, 128, 0.5) transparent', maxHeight: 'calc(100vh - 180px)', contain: 'layout style paint', position: 'relative', zIndex: 1 }}>
            {conversationHistory.length === 0 ? (
              <div className="text-center py-8 px-4">
                <div className="mb-4">
                  <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-1">No recent activity</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Start a conversation to see it here</p>
                </div>
              </div>
            ) : (
            conversationHistory.map((conversation) => (
              <div 
                key={conversation.id} 
                onClick={() => handleConversationClick(conversation.id)}
                className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer group relative animate-in fade-in ${
                  selectedConversationId === conversation.id
                    ? 'bg-[#39d2c0]/10 dark:bg-[#39d2c0]/20 border-[#39d2c0] shadow-md'
                    : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-[#39d2c0] hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-medium text-sm transition-colors flex-1 pr-2 ${
                    selectedConversationId === conversation.id
                      ? 'text-[#39d2c0]'
                      : 'text-gray-900 dark:text-gray-100 group-hover:text-[#39d2c0]'
                  }`}>
                    {conversation.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      {formatTime(conversation.timestamp)}
                    </span>
                    <button
                      onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      onMouseDown={(e) => {
                        e.stopPropagation()
                        e.preventDefault()
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all duration-200 text-red-500 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      title="Delete conversation"
                      type="button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {conversation.lastMessage}
                </p>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Main Panel - Chat Interface */}
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
          {/* Scrollable Chat Area */}
          <div className="flex-1 overflow-y-auto px-5 py-4 pb-28 min-h-0" style={{ maxHeight: 'calc(100vh - 64px)' }}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-2xl">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#39d2c0]/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 shimmer"></div>
                    <Brain className="h-8 w-8 text-[#39d2c0] relative z-10" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Start a New Conversation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
                    Begin chatting with Bizora AI to get creative insights, design help, and innovative solutions for your projects.
                  </p>
                  
                  <Button
                    onClick={() => setCurrentMessage("Hello!")}
                    className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white mb-8"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Chat
                  </Button>

                  {/* Creative Suggestions */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button
                      onClick={() => handleSuggestionClick("Help me brainstorm unique brand concepts for my creative agency")}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#39d2c0] hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-purple-200 group-hover:to-purple-100 dark:group-hover:from-purple-800/50 dark:group-hover:to-purple-700/50 transition-colors">
                          <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Brainstorm brand concepts</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Unique creative ideas</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSuggestionClick("Generate compelling social media content ideas for my portfolio")}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#39d2c0] hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-blue-100 dark:group-hover:from-blue-800/50 dark:group-hover:to-blue-700/50 transition-colors">
                          <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Social media content ideas</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Engaging post concepts</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSuggestionClick("Design a color palette and typography system for my project")}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#39d2c0] hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-100 to-pink-50 dark:from-pink-900/30 dark:to-pink-800/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-pink-200 group-hover:to-pink-100 dark:group-hover:from-pink-800/50 dark:group-hover:to-pink-700/50 transition-colors">
                          <ImageIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Design system guidance</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Colors & typography</p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => handleSuggestionClick("Create an innovative campaign strategy for my product launch")}
                      className="p-4 text-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#39d2c0] hover:shadow-md transition-all duration-200 group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/30 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:from-orange-200 group-hover:to-orange-100 dark:group-hover:from-orange-800/50 dark:group-hover:to-orange-700/50 transition-colors">
                          <RefreshCw className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm mb-1">Campaign strategy ideas</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Launch planning</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                      
                      {message.role === 'user' ? (
                        <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <p className="text-gray-900 dark:text-gray-100">
                            {message.content}
                          </p>
                        </div>
                      ) : (
                        <div className="animate-fade-in">
                          <AIResponse 
                            content={message.content}
                            onCopy={() => navigator.clipboard.writeText(message.content)}
                            onLike={() => console.log('Liked')}
                            onDislike={() => console.log('Disliked')}
                            onShare={() => handleShareMessage(message.content)}
                          />
                        </div>
                      )}
                        
                        {/* Display Attachments */}
                        {message.attachments && message.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {message.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className={`flex items-center gap-2 p-2 rounded-lg ${
                                  message.role === 'user'
                                    ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {attachment.type === 'file' ? (
                                  <FileText className="h-4 w-4" />
                                ) : (
                                  <Link className="h-4 w-4" />
                                )}
                                <span className="text-sm truncate">
                                  {attachment.name}
                                </span>
                                {attachment.type === 'file' && attachment.processed && (
                                  <span className="text-xs text-green-600 dark:text-green-400">
                                    ✓ Readable
                                  </span>
                                )}
                                {attachment.type === 'file' && attachment.processed === false && (
                                  <span className="text-xs text-orange-600 dark:text-orange-400">
                                    ⚠ Not readable
                                  </span>
                                )}
                                {attachment.type === 'link' && attachment.url && (
                                  <a
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs underline hover:no-underline"
                                  >
                                    Open
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                ))}
                
                {/* Thinking Indicator */}
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="max-w-4xl w-full">
                      {isComplexThinking ? (
                        <ResearchThinking topic={currentResearchTopic} />
                      ) : (
                        <ThinkingAnimation />
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area - Always visible */}
          <div className={`fixed bottom-0 left-0 right-0 p-3 bg-white dark:bg-gray-900 flex-shrink-0 z-20 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-16' : 'ml-80'}`}>
            {/* Attachments Display */}
            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm"
                  >
                    {attachment.type === 'file' ? (
                      <FileText className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Link className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                      {attachment.name}
                    </span>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Link Input */}
            {showLinkInput && (
              <div className="mb-2 flex gap-2">
                <input
                  type="url"
                  placeholder="Paste a link..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLinkAdd()
                    }
                    if (e.key === 'Escape') {
                      setShowLinkInput(false)
                      setLinkUrl("")
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg focus:border-[#39d2c0] focus:ring-2 focus:ring-[#39d2c0]/20 focus:outline-none"
                  autoFocus
                />
                <Button
                  onClick={handleLinkAdd}
                  size="sm"
                  className="bg-[#39d2c0] hover:bg-[#2bb3a3] text-white"
                >
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setShowLinkInput(false)
                    setLinkUrl("")
                  }}
                  size="sm"
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            )}


            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  placeholder="Ask, Search, Create and Plan"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className={`w-full min-h-[48px] max-h-28 resize-none rounded-lg pr-24 border dark:bg-gray-800 dark:text-gray-100 focus:border-[#39d2c0] focus:ring-2 focus:ring-[#39d2c0]/20 focus:shadow-sm focus:shadow-[#39d2c0]/10 p-2.5 text-sm transition-all duration-200 ${
                    showGlowEffect 
                      ? 'border-blue-500 ring-4 ring-blue-500/30 shadow-lg shadow-blue-500/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                  rows={1}
                  disabled={isThinking}
                />
                
                {/* Attachment Buttons */}
                <div className="absolute right-1.5 bottom-1.5 flex gap-0.5">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <label
                    htmlFor="file-upload"
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Upload files"
                  >
                    <Paperclip className="h-3.5 w-3.5" />
                  </label>
                  <button
                    onClick={() => setShowLinkInput(true)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Add link"
                  >
                    <Link className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={handleDeepResearchClick}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-all duration-200 ${
                      isDeepResearch 
                        ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 shadow-md shadow-blue-500/20' 
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={isDeepResearch ? "Turn off Deep Research Mode" : "Turn on Deep Research Mode"}
                  >
                    <Globe className={`h-3.5 w-3.5 transition-all duration-200 ${isDeepResearch ? 'text-blue-600' : ''}`} />
                    <span className="text-xs font-medium">Deep research</span>
                  </button>
                </div>
              </div>
              {isThinking ? (
                <Button
                  onClick={handleStopRequest}
                  className="bg-gray-700 hover:bg-gray-600 text-white h-10 w-10 rounded-full transition-colors duration-200 flex items-center justify-center"
                >
                  <Square className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSendMessage}
                  disabled={(!currentMessage.trim() && attachments.length === 0)}
                  className="bg-gray-700 hover:bg-gray-600 text-white h-10 w-10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              Press Enter to send • Shift + Enter for new line • Attach files or links
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModal.isOpen}
        onClose={closeShareModal}
        messageContent={shareModal.messageContent}
        conversationTitle={shareModal.conversationTitle}
      />
    </div>
  )
}