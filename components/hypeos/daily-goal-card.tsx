'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Target, 
  Zap, 
  CheckCircle2, 
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';
import { ProgressAnimation, NumberCounter } from './celebration';
import {
  type DailyGoal,
  type GoalProgress,
  getDifficultyInfo,
  calculateGoalProgress,
  setPreferredDifficulty,
  type GoalDifficulty
} from '@/lib/hypeos/daily-goals';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DailyGoalCardProps {
  goal: DailyGoal;
  currentXP: number;
  currentTasks: number;
  userId: string;
  onDifficultyChange?: (difficulty: GoalDifficulty) => void;
}

export default function DailyGoalCard({
  goal,
  currentXP,
  currentTasks,
  userId,
  onDifficultyChange
}: DailyGoalCardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const progress = calculateGoalProgress(currentXP, currentTasks, goal);
  const difficultyInfo = getDifficultyInfo(goal.difficulty);
  
  const handleDifficultyChange = (newDifficulty: GoalDifficulty) => {
    setPreferredDifficulty(userId, newDifficulty);
    if (onDifficultyChange) {
      onDifficultyChange(newDifficulty);
    }
    setShowSettings(false);
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-[#39d2c0]" />
            <span>Daily Goal</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className={`${difficultyInfo.bgColor} ${difficultyInfo.color} border-0`}>
              <span className="mr-1">{difficultyInfo.icon}</span>
              {difficultyInfo.name}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showSettings && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <label className="text-sm font-medium mb-2 block">Goal Difficulty</label>
            <Select
              value={goal.difficulty}
              onValueChange={(value) => handleDifficultyChange(value as GoalDifficulty)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">
                  Casual - {getDifficultyInfo('casual').description}
                </SelectItem>
                <SelectItem value="regular">
                  Regular - {getDifficultyInfo('regular').description}
                </SelectItem>
                <SelectItem value="serious">
                  Serious - {getDifficultyInfo('serious').description}
                </SelectItem>
                <SelectItem value="insane">
                  Insane - {getDifficultyInfo('insane').description}
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {difficultyInfo.description}
            </p>
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Personalized Reason */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 {goal.personalizedReason}
          </p>
        </div>

        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Overall Progress</span>
            <ProgressAnimation
              from={0}
              to={progress.completionPercentage}
              duration={800}
            >
              {(value) => (
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(value)}%
                </span>
              )}
            </ProgressAnimation>
          </div>
          <Progress 
            value={progress.completionPercentage || 0} 
            className="h-3 transition-all duration-500 bg-gray-200 dark:bg-gray-700"
            style={{
              '--progress-color': '#39d2c0'
            } as React.CSSProperties}
          />
        </div>

        {/* XP Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">XP</span>
            </div>
            <div className="text-right">
              <NumberCounter
                value={currentXP}
                duration={600}
                className="text-sm font-bold text-gray-900 dark:text-white"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {' '}/ {goal.targetXP}
              </span>
            </div>
          </div>
          <Progress 
            value={Math.min((currentXP / goal.targetXP) * 100, 100) || 0} 
            className="h-2 bg-gray-200 dark:bg-gray-700 transition-all duration-500"
            style={{
              '--progress-color': '#39d2c0'
            } as React.CSSProperties}
          />
          {progress.xpRemaining > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {progress.xpRemaining} XP remaining
            </p>
          )}
        </div>

        {/* Tasks Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tasks</span>
            </div>
            <div className="text-right">
              <NumberCounter
                value={currentTasks}
                duration={600}
                className="text-sm font-bold text-gray-900 dark:text-white"
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {' '}/ {goal.targetTasks}
              </span>
            </div>
          </div>
          <Progress 
            value={Math.min((currentTasks / goal.targetTasks) * 100, 100) || 0} 
            className="h-2 bg-gray-200 dark:bg-gray-700 transition-all duration-500"
            style={{
              '--progress-color': '#39d2c0'
            } as React.CSSProperties}
          />
          {progress.tasksRemaining > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {progress.tasksRemaining} tasks remaining
            </p>
          )}
        </div>

        {/* Completion Status */}
        {progress.isComplete ? (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 animate-bounce" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-200">
                  Daily Goal Complete
                </p>
                <p className="text-xs text-green-700 dark:text-green-300">
                  Amazing work! You've hit your daily target.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-400">Estimated time</span>
              </div>
              <span className="font-medium text-gray-900 dark:text-white">
                ~{Math.round(progress.timeRemaining / 60 * 10) / 10} min
              </span>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {goal.targetXP}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Target XP</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {goal.targetTasks}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Target Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(goal.estimatedTime / 60 * 10) / 10}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Minutes</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

