export interface Opportunity {
  id: string
  title: string
  category: string
  payout: string
  deadline: string
  timeLeft: string
  matchPercentage: number
  logo: string
  description: string
  isRemote: boolean
  isPaid: boolean
  mood: string[]
  company: string
  location: string
  requirements: string[]
  benefits: string[]
  source?: string
  originalLink?: string
  contact?: string
  phone?: string
}

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Brand Identity Design for Tech Startup",
    category: "Design",
    payout: "$2,500",
    deadline: "2024-02-15",
    timeLeft: "5 days left",
    matchPercentage: 92,
    logo: "🎨",
    description: "Create a complete brand identity including logo, color palette, and brand guidelines for an innovative AI startup.",
    isRemote: true,
    isPaid: true,
    mood: ["creative", "focused", "energetic"],
    company: "TechFlow Inc.",
    location: "Remote",
    requirements: ["3+ years design experience", "Portfolio required", "Figma proficiency"],
    benefits: ["Flexible hours", "Potential long-term partnership", "Creative freedom"],
    source: "Upwork",
    originalLink: "https://www.upwork.com/nx/find-work/freelance-jobs/?q=brand%20identity%20design",
    contact: "hiring@techflow.com",
    phone: "+1 (555) 100-2000"
  },
  {
    id: "2",
    title: "Content Writing for Lifestyle Blog",
    category: "Writing",
    payout: "$800",
    deadline: "2024-02-20",
    timeLeft: "10 days left",
    matchPercentage: 87,
    logo: "✍️",
    description: "Write 8 engaging lifestyle articles covering wellness, productivity, and personal growth topics.",
    isRemote: true,
    isPaid: true,
    mood: ["calm", "reflective", "thoughtful"],
    company: "Wellness Weekly",
    location: "Remote",
    requirements: ["2+ years writing experience", "SEO knowledge", "Lifestyle expertise"],
    benefits: ["Byline credit", "Social media promotion", "Regular contributor opportunity"],
    source: "Upwork",
    originalLink: "https://www.upwork.com/nx/find-work/freelance-jobs/?q=content%20writing",
    contact: "editor@wellnessweekly.com",
    phone: "+1 (555) 200-3000"
  },
  {
    id: "3",
    title: "Photography Contest - Urban Landscapes",
    category: "Photography",
    payout: "Prize: $1,200",
    deadline: "2024-02-28",
    timeLeft: "18 days left",
    matchPercentage: 78,
    logo: "📸",
    description: "Submit your best urban landscape photographs for a chance to win cash prizes and exhibition opportunities.",
    isRemote: false,
    isPaid: true,
    mood: ["adventurous", "artistic", "observant"],
    company: "City Arts Collective",
    location: "New York, NY",
    requirements: ["Original work only", "High resolution", "Urban theme"],
    benefits: ["Exhibition opportunity", "Portfolio exposure", "Networking events"],
    source: "Upwork",
    originalLink: "https://www.upwork.com/nx/find-work/freelance-jobs/?q=photography",
    contact: "submissions@cityarts.com",
    phone: "+1 (555) 300-4000"
  },
  {
    id: "4",
    title: "Social Media Strategy Consultation",
    category: "Marketing",
    payout: "$1,500",
    deadline: "2024-02-12",
    timeLeft: "2 days left",
    matchPercentage: 95,
    logo: "📱",
    description: "Provide strategic consultation for a local restaurant's social media presence and content calendar.",
    isRemote: true,
    isPaid: true,
    mood: ["strategic", "analytical", "creative"],
    company: "Bella Vista Restaurant",
    location: "Remote",
    requirements: ["5+ years social media experience", "Restaurant industry knowledge", "Analytics expertise"],
    benefits: ["Performance bonuses", "Client referrals", "Portfolio case study"],
    source: "Upwork",
    originalLink: "https://www.upwork.com/nx/find-work/freelance-jobs/?q=digital%20marketing",
    contact: "marketing@bellavista.com",
    phone: "+1 (555) 400-5000"
  },
  {
    id: "5",
    title: "Podcast Production Assistant",
    category: "Audio",
    payout: "$600",
    deadline: "2024-02-25",
    timeLeft: "15 days left",
    matchPercentage: 83,
    logo: "🎙️",
    description: "Assist with podcast editing, show notes, and social media promotion for a growing tech podcast.",
    isRemote: true,
    isPaid: true,
    mood: ["detail-oriented", "collaborative", "tech-savvy"],
    company: "TechTalk Podcast",
    location: "Remote",
    requirements: ["Audio editing skills", "Podcast experience", "Social media savvy"],
    benefits: ["Skill development", "Industry connections", "Portfolio building"],
    source: "Upwork",
    originalLink: "https://www.upwork.com/nx/find-work/freelance-jobs/?q=audio%20editing",
    contact: "producer@techtalkpodcast.com",
    phone: "+1 (555) 500-6000"
  },
  {
    id: "6",
    title: "Volunteer: Community Art Workshop",
    category: "Education",
    payout: "Volunteer",
    deadline: "2024-02-18",
    timeLeft: "8 days left",
    matchPercentage: 89,
    logo: "🎭",
    description: "Lead a creative art workshop for children at the local community center. Great for building teaching experience.",
    isRemote: false,
    isPaid: false,
    mood: ["nurturing", "patient", "inspiring"],
    company: "Community Arts Center",
    location: "Los Angeles, CA",
    requirements: ["Art background", "Teaching experience preferred", "Background check"],
    benefits: ["Teaching experience", "Community impact", "Networking", "Portfolio photos"],
    source: "Upwork",
    originalLink: "https://www.upwork.com/nx/find-work/freelance-jobs/?q=education%20teaching",
    contact: "volunteer@communityartscenter.com",
    phone: "+1 (555) 600-7000"
  }
]

export const categories = [
  "All",
  "Design",
  "Writing",
  "Photography",
  "Marketing",
  "Audio",
  "Education",
  "Video",
  "Development",
  "Consulting"
]

export const moods = [
  "creative",
  "focused",
  "energetic",
  "calm",
  "reflective",
  "thoughtful",
  "adventurous",
  "artistic",
  "observant",
  "strategic",
  "analytical",
  "detail-oriented",
  "collaborative",
  "tech-savvy",
  "nurturing",
  "patient",
  "inspiring"
]
