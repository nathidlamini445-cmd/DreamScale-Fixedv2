import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { Copy, ThumbsUp, ThumbsDown, Share, Sparkles, Lightbulb, Target, Zap } from 'lucide-react'
import 'highlight.js/styles/github-dark.css'

interface AIResponseProps {
  content: string
  onCopy?: () => void
  onLike?: () => void
  onDislike?: () => void
  onShare?: () => void
}

export function AIResponse({ content, onCopy, onLike, onDislike, onShare }: AIResponseProps) {
  // Custom components for markdown rendering
  const components = {
    h1: ({ children }: any) => (
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <Sparkles className="h-6 w-6 text-blue-500" />
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3 mt-6 flex items-center gap-2">
        <Target className="h-5 w-5 text-green-500" />
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 mt-4 flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-yellow-500" />
        {children}
      </h3>
    ),
    p: ({ children }: any) => (
      <p className="text-base text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="space-y-2 mb-4 pl-4">
        {children}
      </ul>
    ),
    ol: ({ children }: any) => (
      <ol className="space-y-3 mb-4 pl-6">
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => {
      // Check if this is an ordered list item
      const isOrderedList = props.node?.parent?.tagName === 'ol'
      
      if (isOrderedList) {
        return (
          <li className="flex items-start gap-3 text-base text-gray-700 dark:text-gray-300">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              {props.node?.index + 1}
            </span>
            <span className="flex-1">{children}</span>
          </li>
        )
      }
      
      // For unordered lists, keep the original styling
      return (
        <li className="flex items-start gap-2 text-base text-gray-700 dark:text-gray-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
          <span className="flex-1">{children}</span>
        </li>
      )
    },
    strong: ({ children }: any) => (
      <strong className="font-semibold text-gray-900 dark:text-white bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {children}
      </strong>
    ),
    em: ({ children }: any) => (
      <em className="italic text-gray-600 dark:text-gray-400">
        {children}
      </em>
    ),
    code: ({ children, className }: any) => {
      const isInline = !className
      return isInline ? (
        <code className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-2 py-1 rounded text-sm font-mono">
          {children}
        </code>
      ) : (
        <code className={className}>
          {children}
        </code>
      )
    },
    pre: ({ children }: any) => (
      <div className="bg-gray-900 rounded-lg p-4 mb-4 overflow-x-auto">
        <pre className="text-gray-100 text-sm">
          {children}
        </pre>
      </div>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-r-lg">
        <div className="text-base text-gray-700 dark:text-gray-300 italic">
          {children}
        </div>
      </blockquote>
    ),
    a: ({ children, href }: any) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 hover:decoration-blue-500 transition-colors"
      >
        {children}
      </a>
    ),
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg">
          {children}
        </table>
      </div>
    ),
    th: ({ children }: any) => (
      <th className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-left text-base font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-4 py-2 text-base text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
        {children}
      </td>
    ),
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
      {/* Content */}
      <div className="p-6">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <ReactMarkdown
            components={components}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={onCopy}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            title="Copy response"
          >
            <Copy className="h-4 w-4 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </button>
          <button 
            onClick={onLike}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            title="Like this response"
          >
            <ThumbsUp className="h-4 w-4 text-gray-500 group-hover:text-green-600" />
          </button>
          <button 
            onClick={onDislike}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
            title="Dislike this response"
          >
            <ThumbsDown className="h-4 w-4 text-gray-500 group-hover:text-red-600" />
          </button>
        </div>
        <button 
          onClick={onShare}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors group"
          title="Share response"
        >
          <Share className="h-4 w-4 text-gray-500 group-hover:text-blue-600" />
        </button>
      </div>
    </div>
  )
}
