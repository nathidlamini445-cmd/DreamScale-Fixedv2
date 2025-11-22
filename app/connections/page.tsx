"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { HorizontalNav } from "@/components/horizontal-nav"
import { SettingsModal } from "@/components/settings-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Upload, 
  Calendar as CalendarIcon, 
  Clock, 
  Send, 
  Image, 
  Video, 
  FileText, 
  BarChart3, 
  MessageSquare,
  X,
  Twitter,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Music,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const contentTypes = [
  { id: "article", label: "Article", icon: FileText, color: "bg-blue-500" },
  { id: "video", label: "Video", icon: Video, color: "bg-red-500" },
  { id: "image", label: "Image", icon: Image, color: "bg-green-500" },
  { id: "poll", label: "Poll", icon: BarChart3, color: "bg-purple-500" },
  { id: "discussion", label: "Discussion", icon: MessageSquare, color: "bg-orange-500" },
]

const platforms = [
  { id: "twitter", label: "Twitter", icon: Twitter, color: "bg-blue-400" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "bg-blue-600" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "bg-pink-500" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "bg-blue-700" },
  { id: "youtube", label: "YouTube", icon: Youtube, color: "bg-red-600" },
  { id: "tiktok", label: "TikTok", icon: Music, color: "bg-black" },
]

export default function PublishingPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [selectedContentType, setSelectedContentType] = useState("")
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [scheduleDate, setScheduleDate] = useState<Date>()
  const [scheduleTime, setScheduleTime] = useState("")
  const [isScheduled, setIsScheduled] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const calendarRef = useRef<HTMLDivElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files])
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    )
  }

  const handlePublish = () => {
    const postData = {
      title,
      content,
      contentType: selectedContentType,
      platforms: selectedPlatforms,
      files: uploadedFiles,
      scheduled: isScheduled,
      scheduleDate: scheduleDate,
      scheduleTime: scheduleTime
    }
    
    console.log("Publishing post:", postData)
    // Here you would typically send this data to your backend
    alert("Post published successfully!")
  }

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings)
    // Here you would typically save to localStorage, database, etc.
  }

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false)
      }
    }

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isCalendarOpen])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="relative z-10 main-container">
        <HorizontalNav onSettingsClick={() => setIsSettingsModalOpen(true)} />
        <main className="pt-24">
          {/* Publishing Header */}
          <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 backdrop-blur-sm">
            <div className="flex items-center justify-between px-8 py-6 mt-4">
              <div>
                <h1 className="text-3xl font-bold text-balance text-black dark:text-white">
                  {"Content "}
                  <span className="text-blue-900 dark:text-blue-400 font-bold">{"Publishing"}</span>
                </h1>
                <p className="text-black dark:text-gray-300 mt-2">{"Create and schedule your content across platforms"}</p>
              </div>

              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  {"Help"}
                </Button>
                <Button variant="ghost" size="sm" className="text-black dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  {"Contact Support"}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8 rounded-full bg-[#eab308]/30 text-[#eab308] hover:bg-[#eab308]/40 hover:text-white"
                >
                  {"?"}
                </Button>
              </div>
            </div>
          </header>

          <div className="p-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content Area */}
              <div className="lg:col-span-2 space-y-6">
                {/* Title Input */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Title</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="Enter your content title..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg"
                    />
                  </CardContent>
                </Card>

                {/* Content Type Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {contentTypes.map((type) => {
                        const Icon = type.icon
                        return (
                          <Badge
                            key={type.id}
                            variant={selectedContentType === type.id ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105",
                              selectedContentType === type.id && type.color + " text-white"
                            )}
                            onClick={() => setSelectedContentType(type.id)}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {type.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Content Input */}
                <Card>
                  <CardHeader>
                    <CardTitle>Content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write your content here..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[200px] resize-none"
                    />
                  </CardContent>
                </Card>

                {/* Media Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Media Upload</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                        isDragOver ? "border-primary bg-primary/5" : "border-gray-300"
                      )}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium mb-2">Drag and drop your files here</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports images, videos, documents, and more
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="*/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Choose Files
                        </label>
                      </Button>
                    </div>

                    {/* Uploaded Files */}
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="font-medium">Uploaded Files:</h4>
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center">
                                {file.type.startsWith('image/') ? <Image className="w-4 h-4" /> : 
                                 file.type.startsWith('video/') ? <Video className="w-4 h-4" /> : 
                                 <FileText className="w-4 h-4" />}
                </div>
                              <div>
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(file.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Platform Selection */}
                <Card>
                  <CardHeader>
                    <CardTitle>Select Platforms</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {platforms.map((platform) => {
                      const Icon = platform.icon
                      return (
                        <div key={platform.id} className="flex items-center space-x-3">
                          <Checkbox
                            id={platform.id}
                            checked={selectedPlatforms.includes(platform.id)}
                            onCheckedChange={() => togglePlatform(platform.id)}
                          />
                          <Label
                            htmlFor={platform.id}
                            className="flex items-center gap-3 cursor-pointer flex-1"
                          >
                            <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white", platform.color)}>
                              <Icon className="w-4 h-4" />
                            </div>
                            {platform.label}
                          </Label>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {/* Scheduling */}
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule Post</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="schedule"
                        checked={isScheduled}
                        onCheckedChange={setIsScheduled}
                      />
                      <Label htmlFor="schedule">Schedule for later</Label>
                    </div>

                    {isScheduled && (
                      <div className="space-y-4">
                        <div className="relative" ref={calendarRef}>
                          <Label>Date</Label>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !scheduleDate && "text-muted-foreground"
                            )}
                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                          </Button>
                          {isCalendarOpen && (
                            <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-md shadow-lg p-3 min-w-[280px]">
                              <Calendar
                                mode="single"
                                selected={scheduleDate}
                                onSelect={(date) => {
                                  setScheduleDate(date)
                                  setIsCalendarOpen(false)
                                }}
                                initialFocus
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <Label>Time</Label>
                          <Input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                </div>
                </div>
                    )}
                  </CardContent>
                </Card>

                {/* Publish Button */}
                <Card>
                  <CardContent className="pt-6">
                    <Button 
                      onClick={handlePublish}
                      className="w-full"
                      size="lg"
                      disabled={!title || !content || selectedPlatforms.length === 0}
                    >
                      {isScheduled ? (
                        <>
                          <Clock className="w-4 h-4 mr-2" />
                          Schedule Post
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Publish Now
                        </>
                      )}
                    </Button>
                  </CardContent>
              </Card>
              </div>
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
    </div>
  )
}

