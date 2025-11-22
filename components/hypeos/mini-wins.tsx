'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Clock, 
  Star,
  Flame,
  Target,
  CheckCircle
} from 'lucide-react';

interface MiniWin {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  time: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface MiniWinsProps {
  miniWins: MiniWin[];
  onComplete: (miniWinId: number) => void;
  streak: number;
}

export default function MiniWins({ miniWins, onComplete, streak }: MiniWinsProps) {
  const [completedWins, setCompletedWins] = useState<number[]>([]);
  const [animatingId, setAnimatingId] = useState<number | null>(null);

  const handleComplete = (miniWinId: number) => {
    setAnimatingId(miniWinId);
    setCompletedWins(prev => [...prev, miniWinId]);
    onComplete(miniWinId);
    
    // Reset animation after delay
    setTimeout(() => setAnimatingId(null), 1000);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getCategoryIcon = (category?: string) => {
    // Return empty string - no emojis
    return '';
  };

  const completedCount = miniWins.filter(win => win.completed || completedWins.includes(win.id)).length;
  const totalPoints = miniWins.reduce((sum, win) => 
    sum + (win.completed || completedWins.includes(win.id) ? win.points : 0), 0
  );

  const getMotivationalMessage = (completed: number, total: number) => {
    const rate = total > 0 ? (completed / total) * 100 : 0;
    if (rate === 100) return "All mini wins completed! You're on fire!";
    if (rate >= 75) return "Almost there! Great momentum!";
    if (rate >= 50) return "Halfway through! Keep it up!";
    if (rate >= 25) return "Good start! Every win counts!";
    return "Quick wins build big momentum!";
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border-gray-200 dark:border-gray-700 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-yellow-500" />
            <span>Mini Wins</span>
          </CardTitle>
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Quick 5-min actions
          </Badge>
        </div>
        
        {/* Progress Summary */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Quick Wins Progress</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {completedCount}/{miniWins.length} Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${miniWins.length > 0 ? (completedCount / miniWins.length) * 100 : 0}%` }}
            />
          </div>
          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            {getMotivationalMessage(completedCount, miniWins.length)}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {miniWins.map((win) => {
            const isCompleted = win.completed || completedWins.includes(win.id);
            const isAnimating = animatingId === win.id;
            
            return (
              <div 
                key={win.id} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 hover:border-yellow-300 dark:hover:border-yellow-700 hover:shadow-sm'
                } ${
                  isAnimating ? 'animate-pulse scale-105' : ''
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  {/* Completion Indicator */}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isCompleted 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-yellow-300 dark:border-yellow-600'
                  }`}>
                    {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>

                  {/* Win Content */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className={`font-medium ${
                        isCompleted 
                          ? 'text-green-800 dark:text-green-200 line-through' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {win.title}
                      </p>
                      {win.category && (
                        <span className="text-sm">{getCategoryIcon(win.category)}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {win.time}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        +{win.points} points
                      </span>
                      {win.difficulty && (
                        <Badge className={getDifficultyColor(win.difficulty)}>
                          {win.difficulty}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                {!isCompleted && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleComplete(win.id)}
                    className="border-yellow-300 dark:border-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/20"
                  >
                    <Zap className="w-4 h-4 mr-1" />
                    Quick Win
                  </Button>
                )}

                {isCompleted && (
                  <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Done!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Streak Bonus for Mini Wins */}
        {streak >= 3 && (
          <div className="mt-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                Streak Bonus: Mini Wins Give Extra Points!
              </span>
            </div>
            <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
              {streak} day streak = 1.5x points for mini wins
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
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {totalPoints}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Points Earned</div>
          </div>
          <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {miniWins.length > 0 ? Math.round((completedCount / miniWins.length) * 100) : 0}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Progress</div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-2">
            <Star className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Quick Win Tip
            </span>
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
            "Small consistent actions create massive results. Every mini win builds momentum toward your big goal!"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
