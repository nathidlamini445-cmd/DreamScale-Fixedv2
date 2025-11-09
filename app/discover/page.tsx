"use client"

import { HorizontalNav } from "@/components/horizontal-nav"
import { SettingsModal } from "@/components/settings-modal"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { HolographicPlanet } from "@/components/ui/holographic-planet"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, ExternalLink, Calendar, User, Palette, Eye, Save, Maximize2, HelpCircle, MessageSquare } from "lucide-react"
import { UpgradeDropdown } from "@/components/upgrade-dropdown"
import { useState, useEffect } from "react"

// YouTube video data
const featuredVideos = [
  {
    id: "1",
    title: "The Psychology of Color in Design",
    channel: "Design Mastery",
    duration: "12:34",
    views: "2.1M",
    thumbnail: "https://img.youtube.com/vi/yYtWqBfllu4/maxresdefault.jpg",
    url: "https://youtu.be/yYtWqBfllu4?si=qnseTSbg3K2FUN_6",
    videoId: "yYtWqBfllu4",
    description: "Explore how colors affect human psychology and how to use this knowledge in your creative work."
  },
  {
    id: "2", 
    title: "Creative Coding with p5.js",
    channel: "Creative Code",
    duration: "18:45",
    views: "856K",
    thumbnail: "https://img.youtube.com/vi/1hQLp2Cl49Q/maxresdefault.jpg",
    url: "https://youtu.be/1hQLp2Cl49Q?si=xMQXGqQQEBNszdDj",
    videoId: "1hQLp2Cl49Q",
    description: "Learn to create interactive art and animations using JavaScript and p5.js."
  }
]

const recommendedVideos = [
  {
    id: "r1",
    title: "Typography Fundamentals",
    channel: "Type Design",
    duration: "15:22",
    views: "1.2M",
    thumbnail: "https://img.youtube.com/vi/ycOBZZeVeAc/maxresdefault.jpg",
    url: "https://youtu.be/ycOBZZeVeAc?si=eKAwnXY8SqZ6MTW6",
    videoId: "ycOBZZeVeAc"
  },
  {
    id: "r2",
    title: "Digital Art Techniques",
    channel: "Art Academy",
    duration: "22:18",
    views: "3.4M",
    thumbnail: "https://img.youtube.com/vi/Hi72cCOPUQU/maxresdefault.jpg",
    url: "https://youtu.be/Hi72cCOPUQU?si=ocjPg619B4AGhFUn",
    videoId: "Hi72cCOPUQU"
  },
  {
    id: "r3",
    title: "UI/UX Design Principles",
    channel: "Design School",
    duration: "19:33",
    views: "1.8M",
    thumbnail: "https://img.youtube.com/vi/93A1ryc-WW0/maxresdefault.jpg",
    url: "https://youtu.be/93A1ryc-WW0?si=GnVCIXBnYpTEJn7c",
    videoId: "93A1ryc-WW0"
  },
  {
    id: "r4",
    title: "Photography Composition",
    channel: "Photo Pro",
    duration: "16:47",
    views: "2.7M",
    thumbnail: "https://img.youtube.com/vi/ycOBZZeVeAc/maxresdefault.jpg",
    url: "https://youtu.be/ycOBZZeVeAc?si=eKAwnXY8SqZ6MTW6",
    videoId: "ycOBZZeVeAc"
  }
]

// Artwork data with real paintings
const artworks = [
  {
    id: "1",
    title: "The Starry Night",
    artist: "Vincent van Gogh",
    year: "1889",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    description: "One of van Gogh's most famous works, painted during his stay at the Saint-Paul-de-Mausole asylum. The painting features his distinctive swirling brushstrokes and vibrant colors, depicting a night sky over a village.",
    technique: "Van Gogh used thick, impasto brushstrokes and a limited color palette dominated by blues and yellows. The swirling patterns in the sky were created with short, curved brushstrokes that give the painting its dynamic, emotional quality.",
    location: "Museum of Modern Art, New York"
  },
  {
    id: "2",
    title: "The Great Wave off Kanagawa",
    artist: "Katsushika Hokusai",
    year: "1831",
    medium: "Woodblock print",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/1280px-The_Great_Wave_off_Kanagawa.jpg",
    description: "Part of Hokusai's 'Thirty-Six Views of Mount Fuji' series, this iconic Japanese woodblock print depicts a massive wave threatening boats with Mount Fuji in the background.",
    technique: "Created using traditional Japanese woodblock printing techniques. Hokusai used Prussian blue pigment and multiple woodblocks to create the layered effect. The composition follows the rule of thirds with the wave dominating the foreground.",
    location: "Various collections worldwide"
  },
  {
    id: "3",
    title: "The Persistence of Memory",
    artist: "Salvador Dalí",
    year: "1931",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/en/d/dd/The_Persistence_of_Memory.jpg",
    description: "One of Dalí's most recognizable surrealist works, featuring melting clocks in a dreamlike landscape. The painting explores themes of time, memory, and the unconscious mind.",
    technique: "Dalí used meticulous detail and precise brushwork to create photorealistic elements within a surreal composition. The melting clocks were painted with careful attention to light and shadow to create a convincing three-dimensional effect.",
    location: "Museum of Modern Art, New York"
  },
  {
    id: "4",
    title: "Girl with a Pearl Earring",
    artist: "Johannes Vermeer",
    year: "1665",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1280px-1665_Girl_with_a_Pearl_Earring.jpg",
    description: "Often called the 'Mona Lisa of the North', this portrait by Vermeer is renowned for its intimate composition and the mysterious beauty of the subject.",
    technique: "Vermeer used his characteristic technique of applying thin layers of paint to create depth and luminosity. The pearl earring is painted with just a few brushstrokes, using highlights and shadows to suggest its three-dimensional form.",
    location: "Mauritshuis, The Hague"
  },
  {
    id: "5",
    title: "The Scream",
    artist: "Edvard Munch",
    year: "1893",
    medium: "Oil, tempera, and pastel on cardboard",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg/1280px-Edvard_Munch%2C_1893%2C_The_Scream%2C_oil%2C_tempera_and_pastel_on_cardboard%2C_91_x_73_cm%2C_National_Gallery_of_Norway.jpg",
    description: "One of the most iconic images in art history, expressing the anxiety and existential dread of modern life. The figure's scream seems to echo through the swirling sky.",
    technique: "Munch used bold, expressive brushstrokes and a limited color palette to create emotional intensity. The swirling sky was painted with flowing, organic lines that mirror the figure's psychological state.",
    location: "National Gallery, Oslo"
  },
  {
    id: "6",
    title: "Guernica",
    artist: "Pablo Picasso",
    year: "1937",
    medium: "Oil on canvas",
    image: "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/PicassoGuernica.jpg/1280px-PicassoGuernica.jpg",
    description: "A powerful anti-war painting created in response to the bombing of Guernica during the Spanish Civil War. The monochromatic palette and distorted figures convey the horror and chaos of war.",
    technique: "Picasso used a monochromatic palette of black, white, and grey to emphasize the stark reality of war. The composition is filled with distorted, anguished figures and symbolic elements like the bull and horse.",
    location: "Museo Reina Sofía, Madrid"
  },
]

const additionalVideos = [
  {
    id: "a1",
    title: "Abstract Art Techniques",
    channel: "Modern Art Studio",
    duration: "14:56",
    views: "1.5M",
    thumbnail: "https://img.youtube.com/vi/2kThENSNqdg/maxresdefault.jpg",
    url: "https://youtu.be/2kThENSNqdg?si=4bUSl065BkAGnPRb",
    videoId: "2kThENSNqdg"
  },
  {
    id: "a2",
    title: "Watercolor Painting Basics",
    channel: "Art Tutorials",
    duration: "21:12",
    views: "2.3M",
    thumbnail: "https://img.youtube.com/vi/mG8MOQ6052I/maxresdefault.jpg",
    url: "https://youtu.be/mG8MOQ6052I?si=jRZjA1U3pjqvvyVF",
    videoId: "mG8MOQ6052I"
  },
  {
    id: "a3",
    title: "3D Modeling for Artists",
    channel: "Digital Art Hub",
    duration: "17:44",
    views: "1.9M",
    thumbnail: "https://img.youtube.com/vi/VMy90xfyrnc/maxresdefault.jpg",
    url: "https://youtu.be/VMy90xfyrnc?si=NynN-T5GB2YnGRFg",
    videoId: "VMy90xfyrnc"
  },
  {
    id: "a4",
    title: "Color Theory Masterclass",
    channel: "Design Institute",
    duration: "25:33",
    views: "3.1M",
    thumbnail: "https://img.youtube.com/vi/yYtWqBfllu4/maxresdefault.jpg",
    url: "https://youtu.be/yYtWqBfllu4?si=qnseTSbg3K2FUN_6",
    videoId: "yYtWqBfllu4"
  }
]

export default function DiscoverPage() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const [savedVideos, setSavedVideos] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      const isTablet = /tablet|ipad/i.test(userAgent)
      const isSmallScreen = window.innerWidth < 1024
      
      setIsMobile(isMobileDevice || isTablet || isSmallScreen)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(videoId)
  }

  const handleCloseVideo = () => {
    setSelectedVideo(null)
  }

  const handleSaveVideo = (videoId: string) => {
    setSavedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const handleFullscreen = () => {
    const iframe = document.querySelector('iframe')
    if (iframe && iframe.requestFullscreen) {
      iframe.requestFullscreen()
    }
  }

  const handleSettingsSave = (settings: any) => {
    console.log('Settings saved:', settings)
    // Here you would typically save to localStorage, database, etc.
  }

  // Show mobile restriction message
  if (isMobile) {
    return (
      <div className="min-h-screen bg-white text-foreground flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-900 to-purple-600 rounded-full flex items-center justify-center">
            <Palette className="w-12 h-12 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Desktop Only</h1>
          <p className="text-muted-foreground text-lg mb-6">
            DreamScale is designed for desktop and laptop computers. Please access this application from a computer for the best experience.
          </p>
          <div className="bg-muted/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Supported devices:</strong> Desktop computers, laptops, and tablets with screen width 1024px or larger.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="relative z-10 main-container">
        <HorizontalNav />
        <main className="pt-20">
          <div className="p-8 space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Discover Creativity</h1>
                <p className="text-muted-foreground text-lg">Explore videos, artworks, and inspiration from the creative world</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
              {/* Main Content - Left Side */}
              <div className="xl:col-span-3 space-y-8">
                {/* Featured Video */}
                <Card className="p-6 bg-white dark:bg-slate-900 border border-2 border-blue-900 shadow-sm hover:shadow-lg hover:shadow-blue-900/70 ring-1 ring-blue-900/20 transition-all duration-300">
                  <div 
                    className="aspect-video bg-muted rounded-lg mb-4 relative overflow-hidden group cursor-pointer"
                    onClick={() => handleVideoClick(featuredVideos[0].videoId)}
                  >
                    <img 
                      src={featuredVideos[0].thumbnail} 
                      alt={featuredVideos[0].title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button size="lg" className="bg-gradient-to-r from-blue-900 to-purple-600 hover:from-blue-900 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                        <Play className="w-6 h-6 mr-2" />
                        Play Now
                      </Button>
                    </div>
                    <div className="absolute bottom-4 right-4 bg-white dark:bg-slate-900 text-black dark:text-white px-2 py-1 rounded text-sm shadow-md">
                      {featuredVideos[0].duration}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-foreground">{featuredVideos[0].title}</h2>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {featuredVideos[0].channel}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {featuredVideos[0].views} views
                      </span>
                    </div>
                    <p className="text-muted-foreground">{featuredVideos[0].description}</p>
                  </div>
                </Card>

                {/* Artworks Section */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                    <Palette className="w-8 h-8 text-primary" />
                    Masterpieces & Techniques
                  </h2>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-16">
                    {artworks.map((artwork) => (
                      <Card key={artwork.id} className="p-10 bg-white dark:bg-slate-900 border border-2 border-blue-900 shadow-sm hover:shadow-lg hover:shadow-blue-900/70 ring-1 ring-blue-900/20 transition-all duration-300">
                        <div className="aspect-[5/3] bg-muted rounded-lg mb-8 overflow-hidden">
                          <img 
                            src={artwork.image} 
                            alt={artwork.title}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <h3 className="text-2xl font-bold text-foreground">{artwork.title}</h3>
                            <Badge variant="outline" className="text-sm px-3 py-1">
                              {artwork.year}
                            </Badge>
                          </div>
                          <div className="space-y-3">
                            <p className="text-muted-foreground text-lg">
                              <strong>Artist:</strong> {artwork.artist}
                            </p>
                            <p className="text-muted-foreground text-lg">
                              <strong>Medium:</strong> {artwork.medium}
                            </p>
                            <p className="text-muted-foreground text-lg">
                              <strong>Location:</strong> {artwork.location}
                            </p>
                          </div>
                          <p className="text-base text-muted-foreground leading-relaxed">
                            {artwork.description}
                          </p>
                          <div className="pt-4 border-t border-border">
                            <p className="text-base font-medium text-foreground mb-2">Technique:</p>
                            <p className="text-base text-muted-foreground leading-relaxed">
                              {artwork.technique}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Additional Videos */}
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-6">More Creative Content</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {additionalVideos.map((video) => (
                      <Card 
                        key={video.id} 
                        className="p-4 bg-white dark:bg-slate-900 border border-2 border-blue-900 shadow-sm hover:shadow-lg hover:shadow-blue-900/70 ring-1 ring-blue-900/20 transition-all duration-300 cursor-pointer"
                        onClick={() => handleVideoClick(video.videoId)}
                      >
                        <div className="flex gap-4">
                          <div className="w-32 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative group">
                            <img 
                              src={video.thumbnail} 
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute bottom-1 right-1 bg-white dark:bg-slate-900 text-black dark:text-white px-1 py-0.5 rounded text-xs shadow-md">
                              {video.duration}
                            </div>
                          </div>
                          <div className="flex-1 space-y-2">
                            <h3 className="font-semibold text-foreground line-clamp-2">{video.title}</h3>
                            <p className="text-sm text-muted-foreground">{video.channel}</p>
                            <p className="text-xs text-muted-foreground">{video.views} views</p>
                            <Button asChild size="sm" className="w-full">
                              <a href={video.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3 h-3 mr-1" />
                                Watch
                              </a>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar - Right Side */}
              <div className="xl:col-span-1 space-y-6">
                {/* Recommended Videos */}
                <Card className="p-6 bg-white dark:bg-slate-900 border border-2 border-blue-900 shadow-sm hover:shadow-lg hover:shadow-blue-900/70 ring-1 ring-blue-900/20 transition-all duration-300">
                  <h3 className="text-xl font-bold text-foreground mb-4">Recommended for You</h3>
                  <div className="space-y-4">
                    {recommendedVideos.map((video) => (
                      <div 
                        key={video.id} 
                        className="flex gap-3 cursor-pointer group"
                        onClick={() => handleVideoClick(video.videoId)}
                      >
                        <div className="w-24 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Play className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-white text-black px-1 py-0.5 rounded text-xs shadow-md">
                            {video.duration}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                            {video.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                          <p className="text-xs text-muted-foreground">{video.views} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Stats */}
                <Card className="p-6 bg-white dark:bg-slate-900 border border-2 border-blue-900 shadow-sm hover:shadow-lg hover:shadow-blue-900/70 ring-1 ring-blue-900/20 transition-all duration-300">
                  <h3 className="text-xl font-bold text-foreground mb-4">Your Progress</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Videos Available</span>
                      <span className="font-semibold text-foreground">{featuredVideos.length + recommendedVideos.length + additionalVideos.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Saved Videos</span>
                      <span className="font-semibold text-foreground">{savedVideos.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Artworks Explored</span>
                      <span className="font-semibold text-foreground">{artworks.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Completion Rate</span>
                      <span className="font-semibold text-foreground">
                        {Math.round((savedVideos.length / (featuredVideos.length + recommendedVideos.length + additionalVideos.length)) * 100)}%
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* YouTube Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">Watch Video</h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSaveVideo(selectedVideo)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {savedVideos.includes(selectedVideo) ? 'Saved' : 'Save'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleFullscreen}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Fullscreen
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseVideo}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ExternalLink className="w-5 h-5" />
                </Button>
              </div>
            </div>
            <div className="aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1&rel=0`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="rounded-b-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onSave={handleSettingsSave}
      />
    </div>
  )
}
