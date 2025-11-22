'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HorizontalNav } from '@/components/horizontal-nav';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Calendar,
  Zap,
  Flame,
  Star,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';

// Mock data for analytics
const mockAnalytics = {
  totalPoints: 2450,
  weeklyPoints: [120, 180, 150, 200, 220, 190, 160],
  monthlyProgress: 82,
  streakData: {
    current: 12,
    longest: 28,
    average: 8.5
  },
  taskCompletion: {
    high: 85,
    medium: 78,
    low: 92
  },
  categoryBreakdown: [
    { category: 'Sales', points: 800, percentage: 33 },
    { category: 'Marketing', points: 600, percentage: 24 },
    { category: 'Content', points: 500, percentage: 20 },
    { category: 'Admin', points: 400, percentage: 16 },
    { category: 'Learning', points: 150, percentage: 6 }
  ],
  weeklyInsights: [
    "You complete 80% more tasks on Mondays",
    "Your best work happens between 9-11am",
    "Marketing tasks take you 2x longer than operations",
    "You're 2x faster than last month!"
  ]
};

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [analytics, setAnalytics] = useState(mockAnalytics);

  const getMotivationalMessage = (progress: number) => {
    if (progress >= 90) return "You're absolutely crushing it!";
    if (progress >= 80) return "Incredible momentum! Keep going!";
    if (progress >= 70) return "You're on fire!";
    if (progress >= 60) return "Great progress! You've got this!";
    if (progress >= 50) return "Halfway there! Keep pushing!";
    return "Building momentum! Every step counts!";
  };

  const getStreakLevel = (streak: number) => {
    if (streak >= 30) return { level: "Legendary", color: "text-purple-600", icon: "" };
    if (streak >= 21) return { level: "Expert", color: "text-orange-600", icon: "" };
    if (streak >= 14) return { level: "Advanced", color: "text-green-600", icon: "" };
    if (streak >= 7) return { level: "Intermediate", color: "text-blue-600", icon: "" };
    if (streak >= 3) return { level: "Beginner", color: "text-gray-600", icon: "" };
    return { level: "Starting", color: "text-gray-500", icon: "" };
  };

  const streakLevel = getStreakLevel(analytics.streakData.current);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-2 tracking-tight">
              Progress Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your growth and celebrate your wins
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex space-x-2 mb-8">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className={selectedPeriod === period ? "bg-[#39d2c0] hover:bg-[#39d2c0]/90" : ""}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="h-5 w-5 text-[#39d2c0]" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Total Points</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.totalPoints.toLocaleString()}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Flame className="h-5 w-5 text-orange-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Current Streak</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.streakData.current}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {streakLevel.level} {streakLevel.icon}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-5 w-5 text-green-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Goal Progress</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {analytics.monthlyProgress}%
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                On track to complete
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Growth Velocity</span>
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                +2.3x
              </div>
              <div className="text-sm text-blue-600 dark:text-blue-400">
                Faster than last month
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Points Chart */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-6 w-6 text-[#39d2c0]" />
                <span>Weekly Points</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.weeklyPoints.map((points, index) => {
                  const maxPoints = Math.max(...analytics.weeklyPoints);
                  const percentage = (points / maxPoints) * 100;
                  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{dayNames[index]}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{points} pts</span>
                      </div>
                      <Progress value={percentage} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Task Completion by Impact */}
          <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-6 w-6 text-[#39d2c0]" />
                <span>Task Completion Rate</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.taskCompletion).map(([impact, rate]) => (
                  <div key={impact} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 capitalize">{impact} Impact</span>
                      <span className="font-medium text-gray-900 dark:text-white">{rate}%</span>
                    </div>
                    <Progress value={rate} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card className="mb-8 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-[#39d2c0]" />
              <span>Points by Category</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {analytics.categoryBreakdown.map((category, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {category.points}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {category.category}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    {category.percentage}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card className="mb-8 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-[#39d2c0]" />
              <span>AI Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.weeklyInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p className="text-sm text-blue-800 dark:text-blue-200">{insight}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Motivational Message */}
        <Card className="bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {getMotivationalMessage(analytics.monthlyProgress)}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You're making incredible progress toward your goals. Keep up the amazing work!
              </p>
              <div className="flex justify-center space-x-4">
                <Button 
                  className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                  onClick={() => window.location.href = '/hypeos/daily'}
                >
                  <Target className="w-4 h-4 mr-2" />
                  Continue Today's Tasks
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/hypeos/rewards'}
                >
                  <Star className="w-4 h-4 mr-2" />
                  View Rewards
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
