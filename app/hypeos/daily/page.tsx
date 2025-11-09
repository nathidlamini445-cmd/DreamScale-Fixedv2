'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HorizontalNav } from '@/components/horizontal-nav';
import DailyFocusCard from '@/components/hypeos/daily-focus-card';
import MiniWins from '@/components/hypeos/mini-wins';
import { 
  Target, 
  Zap, 
  Calendar,
  Clock,
  TrendingUp,
  ArrowLeft
} from 'lucide-react';

// Mock data
const mockTasks = [
  { 
    id: 1, 
    title: "Post 3 TikToks", 
    completed: false, 
    points: 150, 
    impact: "medium" as const,
    category: "content",
    estimatedTime: "30 min"
  },
  { 
    id: 2, 
    title: "Email 5 potential clients", 
    completed: false, 
    points: 300, 
    impact: "high" as const,
    category: "sales",
    estimatedTime: "45 min"
  },
  { 
    id: 3, 
    title: "Update pricing page", 
    completed: false, 
    points: 200, 
    impact: "medium" as const,
    category: "admin",
    estimatedTime: "20 min"
  },
  { 
    id: 4, 
    title: "Research competitor pricing", 
    completed: true, 
    points: 100, 
    impact: "low" as const,
    category: "research",
    estimatedTime: "15 min"
  }
];

const mockMiniWins = [
  { 
    id: 1, 
    title: "Check analytics", 
    completed: false, 
    points: 25, 
    time: "2 min",
    category: "admin",
    difficulty: "easy" as const
  },
  { 
    id: 2, 
    title: "Reply to comments", 
    completed: false, 
    points: 30, 
    time: "3 min",
    category: "social",
    difficulty: "easy" as const
  },
  { 
    id: 3, 
    title: "Update bio", 
    completed: true, 
    points: 20, 
    time: "1 min",
    category: "admin",
    difficulty: "easy" as const
  }
];

export default function DailyFocusPage() {
  const router = useRouter();
  
  // Start with mock data to prevent hydration mismatch
  // Load from localStorage in useEffect (client-side only)
  const [tasks, setTasks] = useState(mockTasks);
  const [miniWins, setMiniWins] = useState(mockMiniWins);
  const [userPoints, setUserPoints] = useState(2450);
  const [currentStreak, setCurrentStreak] = useState(12);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load from localStorage on client-side only (prevents hydration mismatch)
  useEffect(() => {
    try {
      const today = new Date().toDateString();
      let loadedAnyData = false;
      
      // Load tasks
      const savedTasks = localStorage.getItem('hypeos:daily:tasks');
      const savedTasksDate = localStorage.getItem('hypeos:daily:tasksLastDate');
      if (savedTasks && savedTasksDate === today) {
        try {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const isValid = parsed.every((task: any) => 
              task && typeof task.id === 'number' && typeof task.title === 'string'
            );
            if (isValid) {
              setTasks(parsed);
              loadedAnyData = true;
              console.log('✅ Loaded daily tasks from localStorage:', parsed.length, 'tasks');
            } else {
              console.warn('⚠️ Invalid task structure in localStorage');
              localStorage.removeItem('hypeos:daily:tasks');
              localStorage.removeItem('hypeos:daily:tasksLastDate');
            }
          }
        } catch (parseError) {
          console.error('❌ Failed to parse tasks from localStorage:', parseError);
          localStorage.removeItem('hypeos:daily:tasks');
          localStorage.removeItem('hypeos:daily:tasksLastDate');
        }
      }
      
      // Load miniWins
      const savedMiniWins = localStorage.getItem('hypeos:daily:miniWins');
      const savedMiniWinsDate = localStorage.getItem('hypeos:daily:miniWinsLastDate');
      if (savedMiniWins && savedMiniWinsDate === today) {
        try {
          const parsed = JSON.parse(savedMiniWins);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMiniWins(parsed);
            loadedAnyData = true;
            console.log('✅ Loaded daily miniWins from localStorage:', parsed.length);
          }
        } catch (e) {
          console.warn('Failed to load daily miniWins from localStorage', e);
        }
      }
      
      // Load userPoints
      const savedPoints = localStorage.getItem('hypeos:daily:userPoints');
      if (savedPoints) {
        const points = parseInt(savedPoints, 10);
        if (!isNaN(points)) {
          setUserPoints(points);
          loadedAnyData = true;
          console.log('✅ Loaded user points from localStorage:', points);
        }
      }
      
      // Load streak
      const savedStreak = localStorage.getItem('hypeos:daily:currentStreak');
      if (savedStreak) {
        const streak = parseInt(savedStreak, 10);
        if (!isNaN(streak)) {
          setCurrentStreak(streak);
          loadedAnyData = true;
          console.log('✅ Loaded streak from localStorage:', streak);
        }
      }
      
      // Mark as loaded (even if no data was found, to prevent overwriting)
      setHasLoadedFromStorage(true);
    } catch (e) {
      console.error('❌ Failed to load from localStorage:', e);
      setHasLoadedFromStorage(true); // Still mark as loaded to prevent infinite loop
    }
  }, []); // Only run once on mount

  // Save tasks to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage (prevents overwriting saved data with mock data)
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined' && tasks.length > 0) {
        const today = new Date().toDateString();
        const tasksJson = JSON.stringify(tasks);
        localStorage.setItem('hypeos:daily:tasks', tasksJson);
        localStorage.setItem('hypeos:daily:tasksLastDate', today);
        console.log('💾 Saved daily tasks to localStorage:', tasks.length, 'tasks', {
          completed: tasks.filter(t => t.completed).length
        });
      }
    } catch (e: any) {
      // Handle quota exceeded error
      if (e.name === 'QuotaExceededError' || e.code === 22) {
        console.error('❌ localStorage quota exceeded! Clearing old data...');
        // Try to clear old data and retry
        try {
          // Clear tasks from previous days
          const today = new Date().toDateString();
          const savedDate = localStorage.getItem('hypeos:daily:tasksLastDate');
          if (savedDate && savedDate !== today) {
            localStorage.removeItem('hypeos:daily:tasks');
            localStorage.removeItem('hypeos:daily:tasksLastDate');
            // Retry saving
            localStorage.setItem('hypeos:daily:tasks', JSON.stringify(tasks));
            localStorage.setItem('hypeos:daily:tasksLastDate', today);
            console.log('✅ Retried save after clearing old data');
          }
        } catch (retryError) {
          console.error('❌ Still failed after clearing old data:', retryError);
        }
      } else {
        console.warn('Failed to save daily tasks to localStorage', e);
      }
    }
  }, [tasks, hasLoadedFromStorage]);

  // Save miniWins to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined' && miniWins.length > 0) {
        const today = new Date().toDateString();
        localStorage.setItem('hypeos:daily:miniWins', JSON.stringify(miniWins));
        localStorage.setItem('hypeos:daily:miniWinsLastDate', today);
        console.log('💾 Saved daily miniWins to localStorage:', miniWins.length);
      }
    } catch (e) {
      console.warn('Failed to save daily miniWins to localStorage', e);
    }
  }, [miniWins, hasLoadedFromStorage]);

  // Save userPoints to localStorage whenever they change (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hypeos:daily:userPoints', userPoints.toString());
        console.log('💾 Saved user points to localStorage:', userPoints);
      }
    } catch (e) {
      console.warn('Failed to save user points to localStorage', e);
    }
  }, [userPoints, hasLoadedFromStorage]);

  // Save streak to localStorage whenever it changes (but only after initial load)
  useEffect(() => {
    // Don't save until we've loaded from localStorage
    if (!hasLoadedFromStorage) return;
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hypeos:daily:currentStreak', currentStreak.toString());
        console.log('💾 Saved streak to localStorage:', currentStreak);
      }
    } catch (e) {
      console.warn('Failed to save streak to localStorage', e);
    }
  }, [currentStreak, hasLoadedFromStorage]);

  const completeTask = (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) {
        console.warn('Task not found:', taskId);
        return;
      }

      const updatedTasks = tasks.map(t => 
        t.id === taskId 
          ? { ...t, completed: true }
          : t
      );
      setTasks(updatedTasks);
      
      // Immediately save to localStorage (like Bizora)
      try {
        if (typeof window !== 'undefined') {
          const today = new Date().toDateString();
          const tasksJson = JSON.stringify(updatedTasks);
          localStorage.setItem('hypeos:daily:tasks', tasksJson);
          localStorage.setItem('hypeos:daily:tasksLastDate', today);
          console.log('💾 Immediately saved completed task to localStorage');
        }
      } catch (e: any) {
        // Handle quota exceeded error
        if (e.name === 'QuotaExceededError' || e.code === 22) {
          console.error('❌ localStorage quota exceeded when saving task!');
          // The useEffect will handle retry with clearing old data
        } else {
          console.error('❌ Failed to immediately save task to localStorage:', e);
        }
      }
      
      // Update points
      const newPoints = userPoints + task.points;
      setUserPoints(newPoints);
      
      // Immediately save points
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:daily:userPoints', newPoints.toString());
        }
      } catch (e: any) {
        console.error('❌ Failed to save points to localStorage:', e);
      }
    } catch (error) {
      console.error('❌ Error completing task:', error);
      // Don't throw - just log the error
    }
  };

  const completeMiniWin = (miniWinId: number) => {
    const updatedMiniWins = miniWins.map(win => 
      win.id === miniWinId 
        ? { ...win, completed: true }
        : win
    );
    setMiniWins(updatedMiniWins);
    
    // Immediately save to localStorage (like Bizora)
    try {
      if (typeof window !== 'undefined') {
        const today = new Date().toDateString();
        localStorage.setItem('hypeos:daily:miniWins', JSON.stringify(updatedMiniWins));
        localStorage.setItem('hypeos:daily:miniWinsLastDate', today);
        console.log('💾 Immediately saved completed miniWin to localStorage');
      }
    } catch (e) {
      console.warn('Failed to immediately save miniWin to localStorage', e);
    }
    
    const miniWin = miniWins.find(w => w.id === miniWinId);
    if (miniWin) {
      const newPoints = userPoints + miniWin.points;
      setUserPoints(newPoints);
      
      // Immediately save points
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:daily:userPoints', newPoints.toString());
        }
      } catch (e) {
        console.warn('Failed to save points to localStorage', e);
      }
    }
  };

  const skipTask = (taskId: number) => {
    // Handle task skip logic
    console.log('Task skipped:', taskId);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const completedMiniWins = miniWins.filter(win => win.completed).length;
  const totalMiniWins = miniWins.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => router.push('/hypeos')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Daily Focus 🎯
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Your tasks for today - let's make progress!
            </p>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-600 dark:text-gray-400">Today's Progress</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(completionRate)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {completedTasks}/{totalTasks} tasks
            </div>
          </div>
        </div>

        {/* Daily Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-[#39d2c0]" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Tasks Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTasks}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Mini Wins</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedMiniWins}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Points Earned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {tasks.reduce((sum, task) => sum + (task.completed ? task.points : 0), 0) +
                     miniWins.reduce((sum, win) => sum + (win.completed ? win.points : 0), 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-900">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time Saved</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      tasks
                        .filter(task => task.completed)
                        .reduce((sum, task) => {
                          const time = parseInt(task.estimatedTime?.replace(/\D/g, '') || '0');
                          return sum + time;
                        }, 0) / 60
                    )}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Daily Focus Tasks */}
          <div>
            <DailyFocusCard
              tasks={tasks}
              onTaskComplete={completeTask}
              onTaskSkip={skipTask}
              streak={currentStreak}
              momentumMultiplier={currentStreak >= 3 ? 1.5 : 1.0}
            />
          </div>

          {/* Mini Wins */}
          <div>
            <MiniWins
              miniWins={miniWins}
              onComplete={completeMiniWin}
              streak={currentStreak}
            />
          </div>
        </div>

        {/* Motivational Section */}
        <Card className="mt-8 bg-white dark:bg-slate-900">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {completionRate === 100 
                  ? "Perfect Day! 🎉" 
                  : completionRate >= 75 
                  ? "Almost There! 💪" 
                  : completionRate >= 50 
                  ? "Great Progress! ⭐" 
                  : "Keep Going! 🚀"
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {completionRate === 100 
                  ? "You've completed all your tasks today! Want to keep the momentum going?"
                  : completionRate >= 75 
                  ? "You're doing amazing! Just a few more tasks to go."
                  : completionRate >= 50 
                  ? "You're making solid progress. Keep the momentum going!"
                  : "Every task you complete brings you closer to your goals. You've got this!"
                }
              </p>
              
              <div className="flex justify-center space-x-4">
                {completionRate < 100 ? (
                  <>
                    <Button 
                      className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                      onClick={() => {
                        // Focus on next incomplete task
                        const nextTask = tasks.find(task => !task.completed);
                        if (nextTask) {
                          document.getElementById(`task-${nextTask.id}`)?.scrollIntoView({ 
                            behavior: 'smooth' 
                          });
                        }
                      }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Focus on Next Task
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/hypeos/rewards')}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      View Rewards
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                      onClick={() => {
                        // Generate more tasks
                        const moreTasks = [
                          { 
                            id: tasks.length + 1, 
                            title: "Review and optimize your workflow", 
                            completed: false, 
                            points: 200, 
                            impact: "medium" as const,
                            category: "optimization",
                            estimatedTime: "30 min"
                          },
                          { 
                            id: tasks.length + 2, 
                            title: "Plan tomorrow's priorities", 
                            completed: false, 
                            points: 150, 
                            impact: "high" as const,
                            category: "planning",
                            estimatedTime: "20 min"
                          },
                          { 
                            id: tasks.length + 3, 
                            title: "Reflect on today's wins", 
                            completed: false, 
                            points: 100, 
                            impact: "medium" as const,
                            category: "reflection",
                            estimatedTime: "15 min"
                          },
                          { 
                            id: tasks.length + 4, 
                            title: "Connect with 3 new people in your network", 
                            completed: false, 
                            points: 250, 
                            impact: "high" as const,
                            category: "networking",
                            estimatedTime: "45 min"
                          },
                          { 
                            id: tasks.length + 5, 
                            title: "Learn something new related to your goal", 
                            completed: false, 
                            points: 180, 
                            impact: "medium" as const,
                            category: "learning",
                            estimatedTime: "40 min"
                          }
                        ];
                        const allTasks = [...tasks, ...moreTasks];
                        setTasks(allTasks);
                        
                        // Immediately save new tasks to localStorage
                        try {
                          if (typeof window !== 'undefined') {
                            const today = new Date().toDateString();
                            localStorage.setItem('hypeos:daily:tasks', JSON.stringify(allTasks));
                            localStorage.setItem('hypeos:daily:tasksLastDate', today);
                            console.log('💾 Saved new tasks to localStorage:', allTasks.length);
                          }
                        } catch (e) {
                          console.warn('Failed to save new tasks to localStorage', e);
                        }
                        
                        // Scroll to new tasks
                        setTimeout(() => {
                          document.getElementById(`task-${tasks.length + 1}`)?.scrollIntoView({ 
                            behavior: 'smooth' 
                          });
                        }, 100);
                      }}
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Get More Tasks
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => router.push('/hypeos')}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Back to Dashboard
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
