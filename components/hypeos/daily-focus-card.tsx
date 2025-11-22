'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  Star,
  Zap,
  Target,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { SkillStrengthBadge } from './skill-strength-indicator';
import { type SkillStrength } from '@/lib/hypeos/spaced-repetition';
import { NumberCounter } from './celebration';

interface Task {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  impact: 'high' | 'medium' | 'low';
  estimatedTime?: string;
  category?: string;
  skillStrength?: SkillStrength | null; // Phase 2: Skill decay data
  howToComplete?: string[]; // Step-by-step instructions
}

interface DailyFocusCardProps {
  tasks: Task[];
  onTaskComplete: (taskId: number) => void;
  onTaskSkip: (taskId: number) => void;
  streak: number;
  momentumMultiplier: number;
}

export default function DailyFocusCard({ 
  tasks, 
  onTaskComplete, 
  onTaskSkip, 
  streak, 
  momentumMultiplier 
}: DailyFocusCardProps) {
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);
  const [skippedTasks, setSkippedTasks] = useState<number[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  const handleComplete = (taskId: number) => {
    setCompletedTasks(prev => [...prev, taskId]);
    onTaskComplete(taskId);
  };

  const handleSkip = (taskId: number) => {
    setSkippedTasks(prev => [...prev, taskId]);
    onTaskSkip(taskId);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getImpactIcon = (impact: string) => {
    // Return empty string - no emojis
    return '';
  };

  const getCategoryIcon = (category?: string) => {
    // Return empty string - no emojis
    return '';
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const getMotivationalMessage = (rate: number) => {
    if (rate === 100) return "Perfect day! Ready for more?";
    if (rate >= 80) return "Amazing progress! Keep it up!";
    if (rate >= 60) return "Great momentum! You're on fire!";
    if (rate >= 40) return "Good progress! Keep pushing!";
    if (rate >= 20) return "Getting there! Every task counts!";
    return "Let's tackle these tasks together!";
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-[#39d2c0]" />
            <span>Today's Focus</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge className="bg-[#39d2c0] text-white">
              {completedCount}/{totalCount} Complete
            </Badge>
            {momentumMultiplier > 1 && (
              <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                {momentumMultiplier}x Multiplier
              </Badge>
            )}
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Daily Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {Math.round(completionRate)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#39d2c0] to-blue-500 h-2 rounded-full transition-all duration-700 ease-out relative"
              style={{ width: `${completionRate}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {getMotivationalMessage(completionRate)}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => {
            const isCompleted = task.completed || completedTasks.includes(task.id);
            const isSkipped = skippedTasks.includes(task.id);
            
            return (
              <div 
                key={task.id} 
                className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 animate-in fade-in-0 slide-in-from-left-2' 
                    : isSkipped
                    ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#39d2c0]/50 hover:shadow-md hover:scale-[1.02]'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Completion Checkbox */}
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500 scale-110' 
                      : 'border-gray-300 dark:border-gray-600 hover:border-[#39d2c0] hover:scale-110'
                  }`}
                  onClick={() => !isCompleted && !isSkipped && handleComplete(task.id)}
                  >
                    {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>

                  {/* Task Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`font-medium ${
                        isCompleted 
                          ? 'text-green-800 dark:text-green-200 line-through' 
                          : isSkipped
                          ? 'text-gray-500 dark:text-gray-500 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </p>
                      {task.category && (
                        <span className="text-sm">{getCategoryIcon(task.category)}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-wrap">
                      <Badge className={getImpactColor(task.impact)}>
                        {getImpactIcon(task.impact)} {task.impact} impact
                      </Badge>
                      {/* Phase 2: Skill Strength Indicator */}
                      {task.skillStrength && task.skillStrength.strength > 0 && (
                        <SkillStrengthBadge
                          strength={task.skillStrength.strength}
                          level={task.skillStrength.level}
                          daysUntilDecay={task.skillStrength.daysUntilDecay}
                          isOverdue={task.skillStrength.isOverdue}
                        />
                      )}
                      <NumberCounter
                        value={Math.round(task.points * momentumMultiplier)}
                        duration={400}
                        prefix="+"
                        suffix=" points"
                        className="text-sm text-gray-500 dark:text-gray-400"
                      />
                      {task.estimatedTime && (
                        <>
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {task.estimatedTime}
                          </span>
                        </>
                      )}
                    </div>
                    
                    {/* How to Complete Section */}
                    {task.howToComplete && task.howToComplete.length > 0 && !isCompleted && (
                      <div className="mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newExpanded = new Set(expandedTasks);
                            if (newExpanded.has(task.id)) {
                              newExpanded.delete(task.id);
                            } else {
                              newExpanded.add(task.id);
                            }
                            setExpandedTasks(newExpanded);
                          }}
                          className="flex items-center gap-1.5 text-xs text-[#39d2c0] hover:text-[#2bb3a3] transition-colors font-medium"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedTasks.has(task.id) ? 'rotate-180' : ''}`} />
                          <span>How to complete this task</span>
                        </button>
                        
                        {expandedTasks.has(task.id) && (
                          <div className="mt-2 pl-4 border-l-2 border-[#39d2c0]/30">
                            <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300">
                              {task.howToComplete.map((step, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-[#39d2c0] mt-0.5 flex-shrink-0">•</span>
                                  <span className="flex-1 leading-relaxed">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {!isCompleted && !isSkipped && (
                  <div className="flex items-center space-x-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleComplete(task.id)}
                      className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Complete
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleSkip(task.id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Skip
                    </Button>
                  </div>
                )}

                {isCompleted && (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Done!</span>
                  </div>
                )}

                {isSkipped && (
                  <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Skipped</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Streak Bonus */}
        {streak >= 3 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Streak Bonus Active!
              </span>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              {streak} day streak = {momentumMultiplier}x points multiplier
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {completedCount}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Completed</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <NumberCounter
              value={tasks.reduce((sum, task) => sum + (task.completed ? task.points * momentumMultiplier : 0), 0)}
              duration={600}
              className="text-lg font-bold text-gray-900 dark:text-white"
            />
            <div className="text-xs text-gray-500 dark:text-gray-400">Points Earned</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {Math.round(completionRate)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
