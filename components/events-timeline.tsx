"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Users, Calendar, Share2, Copy, ExternalLink, X, Globe, MapPinIcon } from "lucide-react"

interface Event {
  id: string
  title: string
  type: "CONFERENCE" | "WORKSHOP" | "MEETUP" | "VIRTUAL" | "EXHIBITION"
  status: "Free" | "Paid"
  price?: string
  date: string
  time: string
  location: string
  address?: string
  city: string
  distance?: number
  attendees: string
  description: string
  fullDescription: string
  host: {
    name: string
    organization: string
    avatar?: string
  }
  tags: string[]
  coordinates: {
    lat: number
    lng: number
  }
  isVirtual: boolean
  registrationUrl?: string
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Figma Design System Masterclass",
    type: "CONFERENCE",
    status: "Free",
    date: "Dec 15, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Design Hub",
    address: "123 Creative Street, Downtown",
    city: "New York",
    distance: 2.3,
    attendees: "1.2k",
    description: "Learn to build scalable design systems with Figma. Perfect for UI/UX designers.",
    fullDescription: "Join us for an intensive masterclass on building comprehensive design systems using Figma. This hands-on workshop will cover everything from atomic design principles to component libraries, design tokens, and collaboration workflows. Perfect for UI/UX designers looking to level up their design system skills.",
    host: {
      name: "Sarah Chen",
      organization: "Design Systems Co.",
      avatar: "SC"
    },
    tags: ["Design", "Figma", "UI/UX", "Systems"],
    coordinates: { lat: 40.7128, lng: -74.0060 },
    isVirtual: false,
    registrationUrl: "https://www.eventbrite.com/e/figma-design-system-masterclass-tickets-123456789"
  },
  {
    id: "2",
    title: "Creative Coding with p5.js",
    type: "WORKSHOP",
    status: "Paid",
    price: "$89",
    date: "Dec 18, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Tech Studio",
    address: "456 Innovation Ave",
    city: "San Francisco",
    distance: 5.7,
    attendees: "450",
    description: "Dive into generative art and interactive experiences using JavaScript.",
    fullDescription: "Explore the intersection of art and code in this immersive workshop. Learn p5.js fundamentals, create generative art pieces, and build interactive installations. No prior coding experience required - we'll start from the basics and work up to advanced techniques.",
    host: {
      name: "Alex Rivera",
      organization: "Creative Code Collective",
      avatar: "AR"
    },
    tags: ["Coding", "Art", "JavaScript", "Creative"],
    coordinates: { lat: 37.7749, lng: -122.4194 },
    isVirtual: false,
    registrationUrl: "https://www.meetup.com/creative-code-collective/events/123456789"
  },
  {
    id: "3",
    title: "AI Art & Design Summit",
    type: "VIRTUAL",
    status: "Free",
    date: "Dec 20, 2024",
    time: "11:00 AM - 3:00 PM",
    location: "Virtual Event",
    city: "Online",
    attendees: "2.1k",
    description: "Explore the future of AI in creative industries with industry leaders.",
    fullDescription: "Join leading AI researchers, artists, and designers as they discuss the latest developments in AI-powered creative tools. From Midjourney to DALL-E, learn how AI is transforming the creative process and what it means for the future of design.",
    host: {
      name: "Dr. Maya Patel",
      organization: "AI Creative Institute",
      avatar: "MP"
    },
    tags: ["AI", "Art", "Design", "Technology"],
    coordinates: { lat: 0, lng: 0 },
    isVirtual: true,
    registrationUrl: "https://www.zoom.us/webinar/register/123456789"
  },
  {
    id: "4",
    title: "Typography & Brand Identity Workshop",
    type: "WORKSHOP",
    status: "Paid",
    price: "$125",
    date: "Dec 22, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Type Foundry",
    address: "789 Font Street",
    city: "Chicago",
    distance: 8.2,
    attendees: "180",
    description: "Master the art of typography and create compelling brand identities.",
    fullDescription: "Deep dive into typography principles, font pairing, and brand identity design. Work on real client projects and learn from industry professionals. Includes hands-on exercises and portfolio review sessions.",
    host: {
      name: "James Wilson",
      organization: "Type & Brand Studio",
      avatar: "JW"
    },
    tags: ["Typography", "Branding", "Design", "Identity"],
    coordinates: { lat: 41.8781, lng: -87.6298 },
    isVirtual: false,
    registrationUrl: "https://www.eventbrite.com/e/typography-brand-identity-workshop-tickets-987654321"
  },
  {
    id: "5",
    title: "Digital Art Exhibition Opening",
    type: "EXHIBITION",
    status: "Free",
    date: "Dec 25, 2024",
    time: "6:00 PM - 10:00 PM",
    location: "Modern Art Gallery",
    address: "321 Gallery Row",
    city: "Los Angeles",
    distance: 12.5,
    attendees: "320",
    description: "Celebrate the opening of our latest digital art exhibition featuring emerging artists.",
    fullDescription: "Experience cutting-edge digital art from 15 emerging artists working at the intersection of technology and creativity. The exhibition features interactive installations, VR experiences, and AI-generated artworks. Meet the artists and enjoy refreshments.",
    host: {
      name: "Elena Rodriguez",
      organization: "Modern Art Gallery",
      avatar: "ER"
    },
    tags: ["Art", "Exhibition", "Digital", "Technology"],
    coordinates: { lat: 34.0522, lng: -118.2437 },
    isVirtual: false,
    registrationUrl: "https://www.eventbrite.com/e/digital-art-exhibition-opening-tickets-456789123"
  },
  {
    id: "6",
    title: "Web3 & NFT Art Workshop",
    type: "MEETUP",
    status: "Paid",
    price: "$75",
    date: "Dec 28, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Crypto Hub",
    address: "654 Blockchain Blvd",
    city: "Miami",
    distance: 15.8,
    attendees: "95",
    description: "Learn about creating and selling NFT art in the Web3 ecosystem.",
    fullDescription: "Discover how to create, mint, and sell NFT art. Learn about blockchain technology, smart contracts, and the future of digital ownership. Includes hands-on minting workshop and marketplace strategies.",
    host: {
      name: "Crypto Mike",
      organization: "Web3 Creators",
      avatar: "CM"
    },
    tags: ["NFT", "Web3", "Blockchain", "Art"],
    coordinates: { lat: 25.7617, lng: -80.1918 },
    isVirtual: false,
    registrationUrl: "https://www.meetup.com/web3-creators/events/789123456"
  },
  {
    id: "7",
    title: "Local Design Meetup",
    type: "MEETUP",
    status: "Free",
    date: "Dec 30, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Community Center",
    address: "100 Main Street",
    city: "Local City",
    distance: 1.2,
    attendees: "45",
    description: "Connect with local designers and share your latest projects.",
    fullDescription: "Join our monthly design meetup where local creatives come together to share projects, get feedback, and network. Bring your portfolio, latest work, or just come to be inspired by the local design community.",
    host: {
      name: "Local Design Group",
      organization: "Design Community",
      avatar: "LD"
    },
    tags: ["Networking", "Portfolio", "Community", "Design"],
    coordinates: { lat: 40.7589, lng: -73.9851 },
    isVirtual: false,
    registrationUrl: "https://www.meetup.com/local-design-group/events/111222333"
  },
  {
    id: "8",
    title: "Photography Workshop",
    type: "WORKSHOP",
    status: "Paid",
    price: "$65",
    date: "Jan 2, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Art Studio",
    address: "200 Creative Lane",
    city: "Nearby Town",
    distance: 3.5,
    attendees: "25",
    description: "Learn professional photography techniques and composition.",
    fullDescription: "Master the fundamentals of photography in this hands-on workshop. Learn about lighting, composition, camera settings, and post-processing. Bring your camera and we'll practice shooting in different scenarios.",
    host: {
      name: "Photography Pro",
      organization: "Creative Arts Center",
      avatar: "PP"
    },
    tags: ["Photography", "Workshop", "Creative", "Skills"],
    coordinates: { lat: 40.7505, lng: -73.9934 },
    isVirtual: false,
    registrationUrl: "https://www.eventbrite.com/e/photography-workshop-tickets-444555666"
  }
]

export function EventsTimeline() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userCity, setUserCity] = useState<string>('')
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompting' | 'unknown'>('unknown')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [showNotifyModal, setShowNotifyModal] = useState(false)
  const [notifyEmail, setNotifyEmail] = useState('')
  const [notifyEvent, setNotifyEvent] = useState<Event | null>(null)

  // Reverse geocoding to get city name from coordinates
  const getCityFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`)
      const data = await response.json()
      return data.city || data.locality || data.principalSubdivision || 'Unknown Location'
    } catch (error) {
      console.error('Error getting city name:', error)
      return 'Unknown Location'
    }
  }

  // Request location permission and get user's location
  useEffect(() => {
    const getLocation = async () => {
      if (!navigator.geolocation) {
        setLocationPermission('denied')
        setEvents(mockEvents)
        return
      }

      setLocationPermission('prompting')
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLocationPermission('granted')
          
          // Get city name from coordinates
          const cityName = await getCityFromCoordinates(latitude, longitude)
          setUserCity(cityName)
          
          // Calculate distances and sort events
          const eventsWithDistance = mockEvents.map(event => ({
            ...event,
            distance: event.isVirtual ? 0 : calculateDistance(
              latitude, longitude, 
              event.coordinates.lat, event.coordinates.lng
            )
          })).sort((a, b) => a.distance - b.distance)
          
          setEvents(eventsWithDistance)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationPermission('denied')
          setEvents(mockEvents)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      )
    }

    getLocation()
  }, [])

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return Math.round(R * c * 10) / 10
  }

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event)
  }

  const handleCloseModal = () => {
    setSelectedEvent(null)
  }

  const handleShareInstagram = () => {
    if (selectedEvent) {
      const text = `Check out this amazing event: ${selectedEvent.title} on ${selectedEvent.date} at ${selectedEvent.location}!`
      const url = `https://www.instagram.com/stories/yourusername/`
      window.open(`https://www.instagram.com/`, '_blank')
    }
  }

  const handleCopyLink = async () => {
    if (selectedEvent) {
      const eventUrl = `${window.location.origin}/events/${selectedEvent.id}`
      try {
        await navigator.clipboard.writeText(eventUrl)
        // You could add a toast notification here
        alert('Event link copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy: ', err)
      }
    }
  }

  const handleAddToCalendar = () => {
    if (selectedEvent) {
      const startDate = new Date(`${selectedEvent.date} ${selectedEvent.time.split(' - ')[0]}`)
      const endDate = new Date(`${selectedEvent.date} ${selectedEvent.time.split(' - ')[1]}`)
      
      const formatDate = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
      }
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(selectedEvent.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(selectedEvent.fullDescription)}&location=${encodeURIComponent(selectedEvent.location)}`
      
      window.open(calendarUrl, '_blank')
    }
  }

  const handleNotifyMe = (event: Event) => {
    setNotifyEvent(event)
    setShowNotifyModal(true)
  }

  const handleSubmitNotification = async () => {
    if (notifyEmail && notifyEvent) {
      // Here you would typically send the email to your backend
      // For now, we'll just show a success message
      alert(`We'll notify you at ${notifyEmail} when similar events to "${notifyEvent.title}" are available in your area!`)
      setShowNotifyModal(false)
      setNotifyEmail('')
      setNotifyEvent(null)
    }
  }

  const isInternationalEvent = (event: Event) => {
    if (!userCity || event.isVirtual) return false
    // Only consider events over 500 miles as international to show more local events
    return event.distance && event.distance > 500
  }

  const getLocationStatus = () => {
    switch (locationPermission) {
      case 'granted':
        return userCity ? `📍 Located in ${userCity}` : '📍 Location detected'
      case 'denied':
        return '📍 Location access denied - showing all events'
      case 'prompting':
        return '📍 Detecting your location...'
      default:
        return '📍 Detecting your location...'
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Creative Events Near You</h2>
        <div className="flex items-center gap-2 text-foreground">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{getLocationStatus()}</span>
        </div>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-hide">
        {events.map((event) => (
          <Card
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="p-6 border border-2 border-[#39d2c0] shadow-sm hover:shadow-lg hover:shadow-[#39d2c0]/70 ring-1 ring-[#39d2c0]/20 transition-all duration-300 cursor-pointer bg-gray-100 dark:bg-gray-800"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <h3 className="text-xl font-bold text-card-foreground">{event.title}</h3>
                  <Badge variant="secondary" className="bg-[#005DFF]/30 text-card-foreground border-[#005DFF]/50">
                    {event.type}
                  </Badge>
                  <Badge
                    variant={event.status === "Free" ? "default" : "secondary"}
                    className={
                      event.status === "Free"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    }
                  >
                    {event.status} {event.price && `- ${event.price}`}
                  </Badge>
                  {event.isVirtual && (
                    <Badge variant="outline" className="bg-[#39d2c0]/10 text-[#39d2c0] border-[#39d2c0]/30">
                      <Globe className="w-3 h-3 mr-1" />
                      Virtual
                    </Badge>
                  )}
                </div>
                <p className="text-card-foreground mb-4 text-pretty">{event.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-card-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{event.location}, {event.city}</span>
                {event.distance && event.distance > 0 && (
                  <span className="text-xs bg-muted px-2 py-1 rounded">{(event.distance)} mi away</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>{event.attendees} attending</span>
              </div>
            </div>

            {/* International Event Notification */}
            {isInternationalEvent(event) && (
              <div className="mt-4 p-3 bg-[#39d2c0]/10 border border-[#39d2c0]/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-900" />
                    <span className="text-sm text-blue-900">
                      If you do not mind traveling to {event.city}, this event might interest you!
                    </span>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleNotifyMe(event)
                    }}
                    size="sm"
                    className="bg-[#39d2c0]/20 hover:bg-[#39d2c0]/30 text-[#39d2c0] border border-[#39d2c0]/30"
                  >
                    Notify Me
                  </Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-card-foreground mb-2">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {selectedEvent.type}
                    </Badge>
                    <Badge
                      variant={selectedEvent.status === "Free" ? "default" : "secondary"}
                      className={
                        selectedEvent.status === "Free"
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                      }
                    >
                      {selectedEvent.status} {selectedEvent.price && `- ${selectedEvent.price}`}
                    </Badge>
                    {selectedEvent.isVirtual && (
                      <Badge variant="outline" className="bg-[#39d2c0]/10 text-[#39d2c0] border-[#39d2c0]/30">
                        <Globe className="w-3 h-3 mr-1" />
                        Virtual
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseModal}
                  className="text-card-foreground hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">About This Event</h3>
                  <p className="text-card-foreground leading-relaxed">{selectedEvent.fullDescription}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">{selectedEvent.date}</p>
                        <p className="text-sm text-card-foreground">{selectedEvent.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPinIcon className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">{selectedEvent.location}</p>
                        <p className="text-sm text-card-foreground">{selectedEvent.address}, {selectedEvent.city}</p>
                        {selectedEvent.distance && selectedEvent.distance > 0 && (
                          <p className="text-xs text-card-foreground">{(selectedEvent.distance)} miles away</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">{selectedEvent.attendees} attending</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Hosted by</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">{selectedEvent.host.avatar}</span>
                        </div>
                        <div>
                          <p className="font-medium text-card-foreground">{selectedEvent.host.name}</p>
                          <p className="text-sm text-card-foreground">{selectedEvent.host.organization}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-card-foreground mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedEvent.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                  <Button onClick={handleShareInstagram} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share on Instagram
                  </Button>
                  <Button onClick={handleCopyLink} className="bg-card text-card-foreground border border-border hover:bg-muted">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </Button>
                  <Button onClick={handleAddToCalendar} className="bg-card text-card-foreground border border-border hover:bg-muted">
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  {selectedEvent.registrationUrl && (
                    <Button asChild className="bg-card text-card-foreground border border-border hover:bg-muted">
                      <a href={selectedEvent.registrationUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Register Now
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Modal */}
      {showNotifyModal && notifyEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-card-foreground mb-2">Get Notified</h3>
                  <p className="text-card-foreground">
                    We'll notify you when similar events to <strong>"{notifyEvent.title}"</strong> are available in your area.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowNotifyModal(false)}
                  className="text-card-foreground hover:text-gray-800"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-md text-card-foreground placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-card-foreground">
                  <div className="w-2 h-2 bg-blue-900 rounded-full"></div>
                  <span>We'll only send you relevant event notifications</span>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleSubmitNotification}
                    disabled={!notifyEmail}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Notify Me
                  </Button>
                  <Button
                    onClick={() => setShowNotifyModal(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
