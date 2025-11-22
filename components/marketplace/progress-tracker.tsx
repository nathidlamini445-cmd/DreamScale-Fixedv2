"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Award, Sparkles } from "lucide-react"

interface ProgressTrackerProps {
  appliedCount: number
  savedCount: number
  completedCount: number
  monthlyGoal: number
}

export function ProgressTracker({ 
  appliedCount = 0, 
  savedCount = 0, 
  completedCount = 0, 
  monthlyGoal = 0 
}: ProgressTrackerProps) {
  const progressPercentage = monthlyGoal > 0 ? Math.min((appliedCount / monthlyGoal) * 100, 100) : 0
  const isGoalReached = monthlyGoal > 0 && appliedCount >= monthlyGoal

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <div className="flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-blue-400" />
        <h3 className="font-semibold text-white">Progress Tracker</h3>
        {isGoalReached && (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <Award className="h-3 w-3 mr-1" />
            Goal Reached!
          </Badge>
        )}
      </div>

      <div className="space-y-4">
        {/* Monthly Goal Progress */}
        {monthlyGoal > 0 ? (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-300">Monthly Goal</span>
              <span className="text-sm text-gray-400">{appliedCount}/{monthlyGoal} applied</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  isGoalReached 
                    ? "bg-gradient-to-r from-green-500 to-green-600" 
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">No monthly goal set yet</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{appliedCount}</div>
            <div className="text-xs text-gray-400">Applied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{savedCount}</div>
            <div className="text-xs text-gray-400">Saved</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedCount}</div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            {monthlyGoal > 0 
              ? (isGoalReached 
                  ? "Amazing! You've exceeded your monthly goal! 🎉" 
                  : `Keep going! ${monthlyGoal - appliedCount} more to reach your goal`)
              : "Set a monthly goal to track your progress!"
            }
          </p>
        </div>
      </div>
    </Card>
  )
}
