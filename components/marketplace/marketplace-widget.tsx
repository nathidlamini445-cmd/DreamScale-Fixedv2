"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Clock, DollarSign, MapPin } from "lucide-react"
import { mockOpportunities } from "@/lib/marketplace-data"
import Link from "next/link"

export function MarketplaceWidget() {
  const todayOpportunities = mockOpportunities.slice(0, 3)

  const getCategoryColor = (category: string) => {
    const colors = {
      Design: "bg-purple-100 dark:bg-purple-900 !text-gray-900 dark:!text-gray-100",
      Writing: "bg-blue-100 dark:bg-blue-900 !text-gray-900 dark:!text-gray-100",
      Photography: "bg-green-100 dark:bg-green-900 !text-gray-900 dark:!text-gray-100",
      Marketing: "bg-orange-100 dark:bg-orange-900 !text-gray-900 dark:!text-gray-100",
      Audio: "bg-pink-100 dark:bg-pink-900 !text-gray-900 dark:!text-gray-100",
      Education: "bg-indigo-100 dark:bg-indigo-900 !text-gray-900 dark:!text-gray-100"
    }
    return colors[category as keyof typeof colors] || "bg-gray-100 dark:bg-gray-700 !text-gray-900 dark:!text-gray-100"
  }

  return (
    <Card className="p-6 border-blue-200/50 bg-gray-100 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Today's Opportunities</h3>
          <p className="text-sm text-muted-foreground">Curated matches for your creative flow</p>
        </div>
        <Link href="/marketplace">
          <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        {todayOpportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="p-4 rounded-lg border border-gray-200 bg-gray-50 dark:bg-gray-800 hover:border-blue-200 hover:shadow-md transition-all duration-200 group"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="text-lg">{opportunity.logo}</div>
                <div>
                  <h4 className="font-medium text-card-foreground group-hover:text-blue-600 transition-colors">
                    {opportunity.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{opportunity.company}</p>
                </div>
              </div>
              <Badge variant="secondary" className={`text-xs font-medium ${getCategoryColor(opportunity.category)}`}>
                {opportunity.category}
              </Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">{opportunity.payout}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{opportunity.timeLeft}</span>
              </div>
              {!opportunity.isRemote && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{opportunity.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Match:</span>
                <span className="font-semibold text-blue-600">{opportunity.matchPercentage}%</span>
              </div>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                  style={{ width: `${opportunity.matchPercentage}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          ✨ You're building your creative legacy
        </p>
      </div>
    </Card>
  )
}
