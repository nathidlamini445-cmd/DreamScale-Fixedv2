"use client"

import { useEffect, useRef } from "react"

const motivationalQuotes = [
  { text: "Creativity is intelligence having fun.", author: "Albert Einstein" },
  { text: "The creative adult is the child who survived.", author: "Ursula K. Le Guin" },
  { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
  { text: "Every artist was first an amateur.", author: "Ralph Waldo Emerson" },
  { text: "Creativity takes courage.", author: "Henri Matisse" },
  { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { text: "Art is not what you see, but what you make others see.", author: "Edgar Degas" },
  { text: "Design is not just what it looks like - design is how it works.", author: "Steve Jobs" },
]

const creativeTips = [
  { text: "Good design is as little design as possible.", author: "Dieter Rams" },
  { text: "Color is a power which directly influences the soul.", author: "Wassily Kandinsky" },
  { text: "Typography is the craft of endowing human language with a durable visual form.", author: "Robert Bringhurst" },
  { text: "The details are not the details. They make the design.", author: "Charles Eames" },
  { text: "White space is to be regarded as an active element, not a passive background.", author: "Jan Tschichold" },
  { text: "Content precedes design. Design in the absence of content is not design, it's decoration.", author: "Jeffrey Zeldman" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Design is thinking made visual.", author: "Saul Bass" },
  { text: "A picture is worth a thousand words. An interface is worth a thousand pictures.", author: "Ben Shneiderman" },
  { text: "The best designs are those that are invisible to the user.", author: "Don Norman" },
]

const techFacts = [
  { text: "The first computer bug was an actual bug - a moth found trapped in a Harvard Mark II computer in 1947.", author: "Tech History" },
  { text: "The term 'WiFi' doesn't actually stand for anything - it's just a trademarked term.", author: "Tech Facts" },
  { text: "The first domain name ever registered was symbolics.com on March 15, 1985.", author: "Internet History" },
  { text: "A group of 12 engineers at IBM created the first hard drive in 1956. It weighed over a ton.", author: "Tech History" },
  { text: "The first email was sent by Ray Tomlinson to himself in 1971. He doesn't remember what it said.", author: "Internet History" },
  { text: "The first computer mouse was made of wood and had two wheels.", author: "Tech History" },
  { text: "The first website ever created is still online at info.cern.ch", author: "Internet History" },
  { text: "The first computer virus was created in 1983 and was called 'Elk Cloner'.", author: "Tech History" },
  { text: "The first webcam was created to monitor a coffee pot at Cambridge University in 1991.", author: "Tech History" },
  { text: "The first computer game was created in 1952 and was called 'OXO' - a tic-tac-toe game.", author: "Gaming History" },
  { text: "The first smartphone was created by IBM in 1994 and was called 'Simon Personal Communicator'.", author: "Tech History" },
  { text: "The first emoji was created in 1999 by Shigetaka Kurita for a Japanese mobile phone company.", author: "Tech History" },
]

interface InfiniteSliderProps {
  type?: "quotes" | "coding" | "tech"
}

export function InfiniteSlider({ type = "quotes" }: InfiniteSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)

  // Get the appropriate content based on type
  const getContent = () => {
    switch (type) {
      case "coding":
        return creativeTips
      case "tech":
        return techFacts
      default:
        return motivationalQuotes
    }
  }

  const content = getContent()

  useEffect(() => {
    const slider = sliderRef.current
    if (!slider) return

    const scrollWidth = slider.scrollWidth
    const clientWidth = slider.clientWidth
    let scrollLeft = 0

    const scroll = () => {
      scrollLeft += 0.2 // Much slower speed for better readability
      if (scrollLeft >= scrollWidth - clientWidth) {
        scrollLeft = 0
      }
      slider.scrollLeft = scrollLeft
    }

    const interval = setInterval(scroll, 20) // Slower refresh rate
    return () => clearInterval(interval)
  }, [])

  // Different colors for different types
  const getColors = () => {
    switch (type) {
      case "coding":
        return {
          bg: "from-green-900/30 via-black/50 to-green-900/30",
          border: "border-green-500/40",
          text: "text-green-100",
          author: "text-green-300/80"
        }
      case "tech":
        return {
          bg: "from-purple-900/30 via-black/50 to-purple-900/30",
          border: "border-purple-500/40",
          text: "text-purple-100",
          author: "text-purple-300/80"
        }
      default:
        return {
          bg: "from-blue-900/30 via-black/50 to-blue-900/30",
          border: "border-[#39d2c0]/40",
          text: "text-blue-900",
          author: "text-blue-900/80"
        }
    }
  }

  const colors = getColors()

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${colors.bg} border ${colors.border} rounded-lg backdrop-blur-sm h-32 w-full max-w-md`}>
      <div
        ref={sliderRef}
        className="flex gap-16 py-6 px-8 overflow-hidden whitespace-nowrap h-full items-center"
        style={{ scrollBehavior: "auto" }}
      >
        {/* Duplicate content for seamless loop */}
        {[...content, ...content].map((item, index) => (
          <div key={index} className="flex-shrink-0 min-w-[400px] text-center">
            <p className={`${colors.text} text-lg font-semibold mb-2 leading-relaxed`}>"{item.text}"</p>
            <p className={`${colors.author} text-sm font-medium`}>— {item.author}</p>
          </div>
        ))}
      </div>
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-black/70 to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-black/70 to-transparent pointer-events-none" />
    </div>
  )
}
