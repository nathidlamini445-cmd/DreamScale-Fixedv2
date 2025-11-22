'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Zap, 
  Trophy, 
  Flame,
  Gift,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { 
  Quest, 
  updateQuestProgress, 
  checkQuestCompletions, 
  saveQuestProgress,
  calculateQuestProgress,
  getQuestCompletionRate,
  getTotalQuestRewards
} from '@/lib/hypeos/quest-system';

interface DailyQuestsProps {
  tasks: any[];
  userPoints: number;
  streak: number;
  quests: Quest[];
  onQuestComplete?: (rewards: number) => void;
}

export default function DailyQuests({ 
  tasks, 
  userPoints, 
  streak, 
  quests,
  onQuestComplete 
}: DailyQuestsProps) {
  const [completedRewards, setCompletedRewards] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  // Track completed rewards for celebration
  useEffect(() => {
    const completedQuests = quests.filter(q => q.completed);
    const totalRewards = completedQuests.reduce((sum, quest) => sum + quest.reward, 0);
    setCompletedRewards(totalRewards);
  }, [quests]);

  const getQuestIcon = (icon: string, isCompleted: boolean = false) => {
    const baseClasses = "h-5 w-5";
    const completedClasses = isCompleted ? "text-green-500" : "";
    
    switch (icon) {
      case '⚡': 
        return <Zap className={`${baseClasses} text-yellow-500 ${completedClasses}`} />;
      case '🎯': 
        return <Target className={`${baseClasses} text-[#39d2c0] ${completedClasses}`} />;
      case '🔥': 
        return <Flame className={`${baseClasses} text-orange-500 ${completedClasses}`} />;
      case '🏆': 
        return <Trophy className={`${baseClasses} text-purple-500 ${completedClasses}`} />;
      default: 
        return <Target className={`${baseClasses} text-gray-500 ${completedClasses}`} />;
    }
  };

  const completionRate = getQuestCompletionRate(quests);
  const totalRewards = getTotalQuestRewards(quests);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Gift className="h-6 w-6 text-[#39d2c0]" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Daily Quests
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete quests to earn bonus rewards
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {completionRate}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {quests.filter(q => q.completed).length}/{quests.length} completed
          </div>
        </div>
      </div>

      {/* Celebration Effect */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="animate-ping">
            <Sparkles className="h-16 w-16 text-yellow-400" />
          </div>
        </div>
      )}

      {/* Quest Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quests.map((quest) => {
          const progressPercentage = (quest.current / quest.target) * 100;
          const isCompleted = quest.completed;
          
          return (
            <Card 
              key={quest.id}
              className={`transition-all duration-300 ${
                isCompleted 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 shadow-lg' 
                  : 'bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 hover:shadow-md'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {getQuestIcon(quest.icon, isCompleted)}
                    <div className="flex-1">
                      <h3 className={`font-semibold ${
                        isCompleted 
                          ? 'text-green-800 dark:text-green-200' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {quest.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {quest.description}
                      </p>
                    </div>
                  </div>
                  
                  {isCompleted && (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {quest.current} / {quest.target}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-700 ${
                        isCompleted 
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                          : 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">
                      {isCompleted ? 'Completed!' : `${quest.target - quest.current} remaining`}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Gift className="h-4 w-4 text-yellow-500" />
                      <span className="text-yellow-600 dark:text-yellow-400 font-medium text-sm">
                        +{quest.reward} XP
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {completionRate}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Completion Rate
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalRewards}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Rewards
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedRewards}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Earned Today
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      {completionRate === 100 ? (
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                All Quests Completed
              </h3>
            </div>
            <p className="text-green-700 dark:text-green-300">
              Amazing work! You've completed all your daily quests. Keep up the momentum!
            </p>
          </CardContent>
        </Card>
      ) : completionRate >= 50 ? (
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-[#39d2c0]" />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                Great Progress
              </h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300">
              You're doing great! Keep completing tasks to finish your quests.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200">
                Let's Get Started
              </h3>
            </div>
            <p className="text-orange-700 dark:text-orange-300">
              Complete your daily tasks to start earning quest rewards!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
