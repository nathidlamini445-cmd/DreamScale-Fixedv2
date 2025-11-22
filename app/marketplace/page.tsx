"use client"

import { useState, useMemo, useEffect } from "react"
import { HorizontalNav } from "@/components/horizontal-nav"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { HolographicPlanet } from "@/components/ui/holographic-planet"
import { OpportunityCard } from "@/components/marketplace/opportunity-card"
import { FilterBar, FilterState } from "@/components/marketplace/filter-bar"
import { ProgressTracker } from "@/components/marketplace/progress-tracker"
import { mockOpportunities } from "@/lib/marketplace-data"
import { useUpworkJobs } from "@/lib/hooks/use-upwork-jobs"
import { convertUpworkJobToOpportunity } from "@/lib/upwork-service"
import { motion } from "framer-motion"
import { useSessionSafe } from '@/lib/session-context'
import { useSaveSessionData, useLoadSessionData } from '@/lib/session-hooks'

export default function MarketplacePage() {
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    deadline: "All",
    remote: "All",
    paid: "All",
    mood: "All",
    search: ""
  })
  const [savedOpportunities, setSavedOpportunities] = useState<string[]>([])
  const [useRealTimeJobs, setUseRealTimeJobs] = useState(true)
  const [applications, setApplications] = useState<string[]>([])

  // Fetch Upwork jobs (only on client side)
  const { 
    jobs: upworkJobs, 
    loading: upworkLoading, 
    error: upworkError,
    searchJobs: searchUpworkJobs,
    fetchByCategory: fetchUpworkByCategory
  } = useUpworkJobs({
    category: filters.category === "All" ? "all" : filters.category.toLowerCase().replace(/\s+/g, '-'),
    keyword: filters.search || undefined,
    limit: 30,
    autoFetch: useRealTimeJobs && typeof window !== 'undefined'
  })

  // Convert Upwork jobs to opportunity format
  const upworkOpportunities = useMemo(() => {
    return upworkJobs.map(convertUpworkJobToOpportunity)
  }, [upworkJobs])

  // Combine mock and real opportunities
  const allOpportunities = useMemo(() => {
    if (useRealTimeJobs && upworkOpportunities.length > 0) {
      // When live jobs are enabled and available, prioritize them
      return [...upworkOpportunities, ...mockOpportunities]
    } else {
      // When live jobs are disabled or not available, show mock data
      return [...mockOpportunities, ...upworkOpportunities]
    }
  }, [upworkOpportunities, useRealTimeJobs])

  const filteredOpportunities = useMemo(() => {
    return allOpportunities.filter(opportunity => {
      // Search filter
      if (filters.search && !opportunity.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !opportunity.description.toLowerCase().includes(filters.search.toLowerCase()) &&
          !opportunity.company.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Category filter
      if (filters.category !== "All" && opportunity.category !== filters.category) {
        return false
      }

      // Remote filter
      if (filters.remote === "Remote" && !opportunity.isRemote) {
        return false
      }
      if (filters.remote === "Local" && opportunity.isRemote) {
        return false
      }

      // Paid filter
      if (filters.paid === "Paid" && !opportunity.isPaid) {
        return false
      }
      if (filters.paid === "Unpaid" && opportunity.isPaid) {
        return false
      }
      if (filters.paid === "Prize" && !opportunity.payout.includes("Prize")) {
        return false
      }

      // Mood filter
      if (filters.mood !== "All" && !opportunity.mood.includes(filters.mood.toLowerCase())) {
        return false
      }

      // Deadline filter (simplified)
      if (filters.deadline === "Today") {
        const today = new Date()
        const deadline = new Date(opportunity.deadline)
        if (deadline.toDateString() !== today.toDateString()) {
          return false
        }
      }

      return true
    })
  }, [filters, allOpportunities])

  const handleApply = (id: string) => {
    console.log(`Applied to opportunity ${id}`)
    setApplications(prev => 
      prev.includes(id) 
        ? prev 
        : [...prev, id]
    )
    // Here you would typically handle the application logic
  }

  const handleSave = (id: string) => {
    setSavedOpportunities(prev => 
      prev.includes(id) 
        ? prev.filter(savedId => savedId !== id)
        : [...prev, id]
    )
  }

  // Handle search with Upwork integration
  const handleSearch = (searchTerm: string) => {
    if (useRealTimeJobs && searchTerm) {
      searchUpworkJobs(searchTerm)
    }
  }

  // Handle category change with Upwork integration
  const handleCategoryChange = (category: string) => {
    if (useRealTimeJobs && category !== "All") {
      fetchUpworkByCategory(category.toLowerCase().replace(/\s+/g, '-'))
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-foreground relative overflow-hidden">
      <div className="background-beams-container">
        <BackgroundBeams className="background-beams" />
      </div>
      <HolographicPlanet />
      
      <div className="relative z-10 main-container">
        <HorizontalNav />
        
        <main className="pt-24">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Pitch Point
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Connect to offers, projects, and clients that help your business grow.
              </p>
              
              {/* Real-time Jobs Toggle */}
              <div className="flex items-center justify-center gap-4 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useRealTimeJobs}
                    onChange={(e) => setUseRealTimeJobs(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Live Upwork Jobs
                  </span>
                </label>
                {upworkLoading && (
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading live jobs...
                  </div>
                )}
                {upworkError && (
                  <div className="text-sm text-purple-600">
                    Live Upwork jobs unavailable - showing creative marketplace opportunities instead
                  </div>
                )}
              </div>
            </motion.div>

            {/* Filter Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <FilterBar onFiltersChange={setFilters} />
            </motion.div>

            {/* Results Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {filteredOpportunities.length} Opportunities Found
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {savedOpportunities.length} saved • {applications.length} applied • Sorted by match percentage
                </p>
                {useRealTimeJobs && upworkOpportunities.length > 0 && (
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                    🔴 {upworkOpportunities.length} Upwork jobs included
                  </p>
                )}
              </div>
            </motion.div>

            {/* Opportunities Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {filteredOpportunities.map((opportunity, index) => (
                <motion.div
                  key={opportunity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <OpportunityCard
                    opportunity={opportunity}
                    onApply={handleApply}
                    onSave={handleSave}
                    isSaved={savedOpportunities.includes(opportunity.id)}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* No Results */}
            {filteredOpportunities.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No opportunities found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters to see more opportunities
                </p>
              </motion.div>
            )}

            {/* Saved Opportunities Section */}
            {savedOpportunities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your Saved Opportunities
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {savedOpportunities.length} opportunity{savedOpportunities.length !== 1 ? 'ies' : ''} saved
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities
                    .filter(opportunity => savedOpportunities.includes(opportunity.id))
                    .map((opportunity, index) => (
                      <motion.div
                        key={opportunity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                      >
                        <OpportunityCard
                          opportunity={opportunity}
                          onApply={handleApply}
                          onSave={handleSave}
                          isSaved={true}
                        />
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Progress Tracker */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              <ProgressTracker
                appliedCount={applications.length}
                savedCount={savedOpportunities.length}
                completedCount={0}
                monthlyGoal={10}
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}
