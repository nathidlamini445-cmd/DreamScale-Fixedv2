'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Calendar, 
  Target,
  TrendingUp,
  Star,
  Zap,
  Trophy,
  Crown
} from 'lucide-react';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  streakGoal: number;
  onStreakMilestone?: (milestone: string) => void;
}

export default function StreakTracker({ 
  currentStreak, 
  longestStreak, 
  totalDaysActive, 
  streakGoal,
  onStreakMilestone 
}: StreakTrackerProps) {
  const [animatedStreak, setAnimatedStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStreak(currentStreak);
      
      // Check for milestone celebrations
      if (currentStreak > 0 && currentStreak % 7 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        onStreakMilestone?.(`${currentStreak} day streak!`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentStreak, onStreakMilestone]);

  const getStreakLevel = (streak: number) => {
    if (streak >= 100) return { level: 'Legendary', color: 'text-purple-600 dark:text-purple-400', icon: Crown };
    if (streak >= 50) return { level: 'Epic', color: 'text-red-600 dark:text-red-400', icon: Trophy };
    if (streak >= 30) return { level: 'Master', color: 'text-orange-600 dark:text-orange-400', icon: Star };
    if (streak >= 21) return { level: 'Expert', color: 'text-yellow-600 dark:text-yellow-400', icon: Zap };
    if (streak >= 14) return { level: 'Advanced', color: 'text-green-600 dark:text-green-400', icon: TrendingUp };
    if (streak >= 7) return { level: 'Intermediate', color: 'text-blue-600 dark:text-blue-400', icon: Target };
    if (streak >= 3) return { level: 'Beginner', color: 'text-gray-600 dark:text-gray-400', icon: Calendar };
    return { level: 'Starting', color: 'text-gray-500 dark:text-gray-500', icon: Calendar };
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return "Legendary! You're unstoppable!";
    if (streak >= 50) return "Epic streak! You're a master!";
    if (streak >= 30) return "Master level! Incredible!";
    if (streak >= 21) return "Expert streak! On fire!";
    if (streak >= 14) return "Advanced! You're crushing it!";
    if (streak >= 7) return "Intermediate! Great momentum!";
    if (streak >= 3) return "Beginner! Building habits!";
    return "Start your streak today!";
  };

  const getStreakRewards = (streak: number) => {
    const rewards = [];
    if (streak >= 3) rewards.push('1.5x Points Multiplier');
    if (streak >= 7) rewards.push('Unlock Bronze Rewards');
    if (streak >= 14) rewards.push('2x Points Multiplier');
    if (streak >= 21) rewards.push('Unlock Silver Rewards');
    if (streak >= 30) rewards.push('3x Points Multiplier');
    if (streak >= 50) rewards.push('Unlock Gold Rewards');
    if (streak >= 100) rewards.push('Legendary Status');
    return rewards;
  };

  const streakLevel = getStreakLevel(currentStreak);
  const streakMessage = getStreakMessage(currentStreak);
  const streakRewards = getStreakRewards(currentStreak);
  const streakProgress = Math.min((currentStreak / streakGoal) * 100, 100);

  const nextMilestone = () => {
    const milestones = [3, 7, 14, 21, 30, 50, 100];
    return milestones.find(milestone => milestone > currentStreak) || null;
  };

  const nextMilestoneValue = nextMilestone();

  return (
    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-6 w-6 text-orange-500" />
            <span>Streak Tracker</span>
          </CardTitle>
          <Badge className={`${streakLevel.color} bg-opacity-20`}>
            {streakLevel.level}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {/* Main Streak Display */}
        <div className={`text-center mb-6 ${showCelebration ? 'animate-pulse' : ''}`}>
          <div className="relative inline-block">
            <div className="text-6xl font-bold text-orange-600 dark:text-orange-400 mb-2">
              {animatedStreak}
            </div>
          </div>
          <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">
            Day Streak
          </p>
          <p className={`text-sm font-medium ${streakLevel.color}`}>
            {streakMessage}
          </p>
        </div>

        {/* Streak Progress with Target Icons */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Progress to Goal</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {currentStreak}/{streakGoal} days
            </span>
          </div>
          
          {/* Target Icons Progress */}
          <div className="flex justify-between items-center">
            {Array.from({ length: Math.min(streakGoal, 7) }, (_, index) => (
              <div key={index} className="flex flex-col items-center">
                <Target 
                  className={`h-5 w-5 ${
                    index < currentStreak 
                      ? 'text-orange-500 dark:text-orange-400' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`} 
                  style={{ 
                    filter: index < currentStreak 
                      ? 'drop-shadow(0 0 6px #f97316)' 
                      : 'none' 
                  }} 
                />
                <span className={`text-xs mt-1 ${
                  index < currentStreak 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
          
          {nextMilestoneValue && (
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              Next milestone: {nextMilestoneValue} days ({nextMilestoneValue - currentStreak} more to go!)
            </p>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {longestStreak}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Longest Streak</div>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {totalDaysActive}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Total Active Days</div>
          </div>
        </div>

        {/* Active Rewards */}
        {streakRewards.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              Active Rewards
            </h4>
            <div className="space-y-1">
              {streakRewards.map((reward, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-400">{reward}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Streak Tips */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Streak Tip
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            {currentStreak === 0 
              ? "Complete your first task today to start your streak!"
              : currentStreak < 3
              ? "Keep going! 3 days unlocks your first bonus!"
              : currentStreak < 7
              ? "Amazing! 7 days unlocks Bronze rewards!"
              : currentStreak < 14
              ? "Incredible! 14 days unlocks 2x points!"
              : "You're a streak master! Keep the momentum going!"
            }
          </p>
        </div>

        {/* Streak Calendar Preview */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Recent Activity
          </h4>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 7 }, (_, i) => {
              const dayOffset = 6 - i;
              const isActive = currentStreak > dayOffset;
              return (
                <div
                  key={i}
                  className={`w-8 h-8 rounded text-xs flex items-center justify-center ${
                    isActive 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {dayOffset === 0 ? 'T' : dayOffset === 1 ? 'Y' : dayOffset}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            T = Today, Y = Yesterday
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
