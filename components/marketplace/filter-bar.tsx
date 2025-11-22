"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, Filter, X } from "lucide-react"
import { categories, moods } from "@/lib/marketplace-data"

interface FilterBarProps {
  onFiltersChange: (filters: FilterState) => void
}

export interface FilterState {
  category: string
  deadline: string
  remote: string
  paid: string
  mood: string
  search: string
}

export function FilterBar({ onFiltersChange }: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    deadline: "All",
    remote: "All",
    paid: "All",
    mood: "All",
    search: ""
  })

  const [showFilters, setShowFilters] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: "All",
      deadline: "All",
      remote: "All",
      paid: "All",
      mood: "All",
      search: ""
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(filters).filter(value => value !== "All" && value !== "").length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search opportunities..."
          value={filters.search}
          onChange={(e) => updateFilter("search", e.target.value)}
          className="pl-10 pr-4"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
            <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Deadline Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Deadline</label>
            <Select value={filters.deadline} onValueChange={(value) => updateFilter("deadline", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="No Rush">No Rush</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Remote Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Location</label>
            <Select value={filters.remote} onValueChange={(value) => updateFilter("remote", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Remote">Remote Only</SelectItem>
                <SelectItem value="Local">Local Only</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Paid Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Compensation</label>
            <Select value={filters.paid} onValueChange={(value) => updateFilter("paid", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                <SelectItem value="Paid">Paid Only</SelectItem>
                <SelectItem value="Unpaid">Unpaid Only</SelectItem>
                <SelectItem value="Prize">Prize/Contest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mood Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Mood</label>
            <Select value={filters.mood} onValueChange={(value) => updateFilter("mood", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All</SelectItem>
                {moods.map((mood) => (
                  <SelectItem key={mood} value={mood}>
                    {mood.charAt(0).toUpperCase() + mood.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.category !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Category: {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("category", "All")}
              />
            </Badge>
          )}
          {filters.deadline !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Deadline: {filters.deadline}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("deadline", "All")}
              />
            </Badge>
          )}
          {filters.remote !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Location: {filters.remote}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("remote", "All")}
              />
            </Badge>
          )}
          {filters.paid !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Compensation: {filters.paid}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("paid", "All")}
              />
            </Badge>
          )}
          {filters.mood !== "All" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Mood: {filters.mood}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => updateFilter("mood", "All")}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
