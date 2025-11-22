"use client"

import { useState } from "react"
import { X, Copy, Link2, Twitter, Linkedin, MessageCircle, Check, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  messageContent: string
  conversationTitle?: string
}

export function ShareModal({ isOpen, onClose, messageContent, conversationTitle }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(messageContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  const handleDownloadPDF = async () => {
    const { downloadPDF, PDFData } = require('@/lib/pdf-generator')
    
    const pdfData: PDFData = {
      title: 'Bizora AI Response',
      subtitle: 'AI-Powered Business Intelligence',
      analysisDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      competitorUrl: 'N/A',
      content: messageContent,
      metadata: {
        author: 'Bizora AI',
        version: '1.0',
        category: 'AI Response'
      }
    }
    
    await downloadPDF(pdfData, `bizora-response-${Date.now()}.pdf`)
  }

  const shareOptions = [
    {
      id: 'copy-link',
      icon: Link2,
      label: 'Copy link',
      action: handleCopyLink,
      color: 'text-blue-500'
    },
    {
      id: 'copy-text',
      icon: Copy,
      label: 'Copy text',
      action: handleCopyText,
      color: 'text-gray-500'
    },
    {
      id: 'twitter',
      icon: Twitter,
      label: 'X (Twitter)',
      action: () => {
        const text = encodeURIComponent(`Check out this AI response:\n\n${messageContent}`)
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
      },
      color: 'text-blue-400'
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      action: () => {
        const text = encodeURIComponent(`AI Response: ${messageContent}`)
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${text}`, '_blank')
      },
      color: 'text-blue-600'
    },
    {
      id: 'reddit',
      icon: MessageCircle,
      label: 'Reddit',
      action: () => {
        const text = encodeURIComponent(`AI Response: ${messageContent}`)
        window.open(`https://reddit.com/submit?title=AI Response&text=${text}`, '_blank')
      },
      color: 'text-orange-500'
    },
    {
      id: 'download-pdf',
      icon: Download,
      label: 'Download as PDF',
      action: handleDownloadPDF,
      color: 'text-red-500'
    }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-4xl w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {conversationTitle || 'Share Response'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex">
          {/* Left Column - AI Response */}
          <div className="flex-1 p-6 border-r border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Bizora's Response</h4>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <p className="text-gray-900 dark:text-gray-100 text-sm leading-relaxed">
                {messageContent}
              </p>
              <div className="flex justify-end mt-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                  Bizora AI
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Share Options */}
          <div className="flex-1 p-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Share to</h4>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={option.action}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                  >
                    <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors`}>
                      <Icon className={`h-5 w-5 ${option.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Success Message */}
            {copied && (
              <div className="mt-4 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <Check className="h-4 w-4" />
                <span>Copied to clipboard!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Share this response with others
          </p>
        </div>
      </div>
    </div>
  )
}
