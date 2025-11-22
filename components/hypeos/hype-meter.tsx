'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Zap,
  Flame,
  Star
} from 'lucide-react';

interface HypeMeterProps {
  progress: number;
  streak: number;
  level: number;
  points: number;
  goalTitle: string;
  goalCurrent: string;
  goalTarget: string;
}

export default function HypeMeter({ 
  progress, 
  streak, 
  level, 
  points, 
  goalTitle, 
  goalCurrent, 
  goalTarget 
}: HypeMeterProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 500);
    return () => clearTimeout(timer);
  }, [progress]);

  const getMotivationalMessage = (progress: number) => {
    if (progress >= 90) return { message: "You're absolutely crushing it!", color: "text-red-600 dark:text-red-400" };
    if (progress >= 80) return { message: "Incredible momentum! Keep going!", color: "text-orange-600 dark:text-orange-400" };
    if (progress >= 70) return { message: "You're on fire!", color: "text-yellow-600 dark:text-yellow-400" };
    if (progress >= 60) return { message: "Great progress! You've got this!", color: "text-green-600 dark:text-green-400" };
    if (progress >= 50) return { message: "Halfway there! Keep pushing!", color: "text-blue-600 dark:text-blue-400" };
    if (progress >= 40) return { message: "Making solid progress!", color: "text-indigo-600 dark:text-indigo-400" };
    if (progress >= 30) return { message: "Building momentum!", color: "text-purple-600 dark:text-purple-400" };
    if (progress >= 20) return { message: "Every step counts!", color: "text-pink-600 dark:text-pink-400" };
    if (progress >= 10) return { message: "Getting started!", color: "text-teal-600 dark:text-teal-400" };
    return { message: "Let's begin this journey!", color: "text-[#39d2c0]" };
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 30) return "Legendary streak!";
    if (streak >= 21) return "On fire!";
    if (streak >= 14) return "Blazing!";
    if (streak >= 7) return "Hot streak!";
    if (streak >= 3) return "Getting hot!";
    return "Start your streak!";
  };

  const getLevelInfo = (level: number) => {
    const levelData = {
      1: { name: "Rookie", color: "text-gray-600", nextLevel: 100, description: "Just getting started" },
      2: { name: "Explorer", color: "text-green-600", nextLevel: 250, description: "Building momentum" },
      3: { name: "Achiever", color: "text-blue-600", nextLevel: 500, description: "Making progress" },
      4: { name: "Expert", color: "text-purple-600", nextLevel: 1000, description: "Getting skilled" },
      5: { name: "Master", color: "text-orange-600", nextLevel: 2000, description: "Highly proficient" },
      6: { name: "Champion", color: "text-red-600", nextLevel: 5000, description: "Elite performer" },
      7: { name: "Legend", color: "text-yellow-600", nextLevel: 10000, description: "Legendary status" },
      8: { name: "Mythic", color: "text-pink-600", nextLevel: 25000, description: "Mythical achievement" },
      9: { name: "Transcendent", color: "text-indigo-600", nextLevel: 50000, description: "Beyond limits" },
      10: { name: "Supreme", color: "text-cyan-600", nextLevel: 100000, description: "Ultimate mastery" }
    };
    
    return levelData[level as keyof typeof levelData] || levelData[1];
  };

  const getNextLevelProgress = (points: number, level: number) => {
    const levelInfo = getLevelInfo(level);
    const currentLevelStart = level === 1 ? 0 : getLevelInfo(level - 1).nextLevel;
    const progress = ((points - currentLevelStart) / (levelInfo.nextLevel - currentLevelStart)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  const levelInfo = getLevelInfo(level);
  const nextLevelProgress = getNextLevelProgress(points, level);

  const motivational = getMotivationalMessage(progress);
  const streakMessage = getStreakMessage(streak);

  return (
    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-[#39d2c0]" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hype Meter</h3>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className={`text-sm font-semibold ${levelInfo.color}`}>
                {levelInfo.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Level {level} • {levelInfo.description}
              </div>
            </div>
            <Star className="h-5 w-5 text-yellow-500" />
          </div>
        </div>

        {/* Circular Progress */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
            {/* Background circle */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress circle */}
            <path
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={`${animatedProgress}, 100`}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#39d2c0" />
                <stop offset="100%" stopColor="#FF6B35" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(animatedProgress)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Progress
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center mb-4">
          <p className={`text-lg font-medium ${motivational.color}`}>
            {motivational.message}
          </p>
        </div>

        {/* Goal Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Goal Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {goalCurrent} / {goalTarget}
            </span>
          </div>
          <Progress value={animatedProgress} className="h-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {goalTitle}
          </p>
        </div>

        {/* Level Progress */}
        <div className="space-y-3 mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Level Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(nextLevelProgress)}%
            </span>
          </div>
          <Progress value={nextLevelProgress} className="h-2" />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            {points.toLocaleString()} / {levelInfo.nextLevel.toLocaleString()} points to Level {level + 1}
          </p>
        </div>

        {/* Streak Display */}
        <div className="mt-6 p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <Flame className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
              {streakMessage}
            </span>
          </div>
          <div className="text-center">
            <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {streak}
            </span>
            <span className="text-sm text-orange-600 dark:text-orange-400 ml-1">
              day streak
            </span>
          </div>
        </div>

        {/* Points Display */}
        <div className="mt-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center space-x-2">
            <Zap className="h-4 w-4 text-[#39d2c0]" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hype Points
            </span>
          </div>
          <div className="text-center mt-1">
            <span className="text-xl font-bold text-[#39d2c0]">
              {points.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Growth Velocity Indicator */}
        <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <TrendingUp className="h-4 w-4" />
          <span>Growth Velocity: +12% this week</span>
        </div>
      </CardContent>
    </Card>
  );
}
