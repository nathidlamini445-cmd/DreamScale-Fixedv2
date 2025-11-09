'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import HypeMeter from '@/components/hypeos/hype-meter';
import DailyFocusCard from '@/components/hypeos/daily-focus-card';
import MiniWins from '@/components/hypeos/mini-wins';
import StreakTracker from '@/components/hypeos/streak-tracker';
import DailyQuests from '@/components/hypeos/daily-quests';
import StreakCelebration from '@/components/hypeos/streak-celebration';
import DailyGoalCard from '@/components/hypeos/daily-goal-card';
import ReviewQueueCard from '@/components/hypeos/review-queue-card';
import { Celebration } from '@/components/hypeos/celebration';
import { HorizontalNav } from '@/components/horizontal-nav';
import { useSessionSafe } from '@/lib/session-context';
import { 
  Quest, 
  updateQuestProgress, 
  checkQuestCompletions, 
  saveQuestProgress,
  calculateQuestProgress,
  initializeQuests
} from '@/lib/hypeos/quest-system';
import { 
  updateStreak, 
  getStreakMultiplier,
  getStreakLevel,
  type StreakData 
} from '@/lib/hypeos/streak-calculator';
import {
  completeTask as completeTaskWithDifficulty,
  getUserPerformanceProfile,
  getTaskDifficulty,
  getTasksWithDifficulties,
  type Task as UnifiedTask
} from '@/lib/hypeos/unified-difficulty';
import {
  getOrCreateTodayGoal,
  updateUserHistory,
  loadUserHistory,
  calculatePersonalizedDailyGoal,
  calculateGoalProgress,
  saveTodayGoal,
  type DailyGoal,
  type GoalDifficulty
} from '@/lib/hypeos/daily-goals';
import {
  generateDailyReviewQueue,
  type DailyReviewQueue
} from '@/lib/hypeos/review-queue';
import { 
  Flame, 
  Star, 
  Target, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Zap,
  Trophy,
  Users,
  Calendar,
  Gift,
  BarChart3,
  ArrowRight,
  Sparkles,
  DollarSign,
  User,
  Rocket,
  TrendingUp as TrendingUpIcon,
  BookOpen,
  Building,
  Dumbbell,
  Palette,
  GraduationCap,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface User {
  name: string;
  level: number;
  hypePoints: number;
  currentStreak: number;
  longestStreak: number;
  goalProgress: number;
  goalTitle: string;
  goalTarget: string;
  goalCurrent: string;
  category: string;
  hasCompletedOnboarding: boolean;
  lastActiveDate?: string; // ISO date string for streak calculation
  streakStartDate?: string; // ISO date string for streak calculation
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  impact: 'high' | 'medium' | 'low';
  category?: string;
  estimatedTime?: string;
}

interface MiniWin {
  id: number;
  title: string;
  completed: boolean;
  points: number;
  time: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

// Onboarding Wizard Component (moved before main component)
function OnboardingWizard({ onComplete }: { onComplete: (userData: User) => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    goalTitle: '',
    goalDescription: '',
    category: '',
    timeline: '',
    targetValue: '',
    currentValue: ''
  });

  const categories = [
    { value: 'revenue', label: 'Revenue Growth', icon: DollarSign, description: 'Increase monthly income and business revenue' },
    { value: 'audience', label: 'Audience Building', icon: User, description: 'Grow your social media following and email list' },
    { value: 'product', label: 'Product Launch', icon: Rocket, description: 'Create and launch a new product or service' },
    { value: 'marketing', label: 'Marketing Campaign', icon: TrendingUpIcon, description: 'Run successful marketing campaigns' },
    { value: 'skills', label: 'Skill Development', icon: Target, description: 'Learn new skills and improve existing ones' },
    { value: 'content', label: 'Content Creation', icon: BookOpen, description: 'Build a content strategy and create engaging content' },
    { value: 'business', label: 'Business Growth', icon: Building, description: 'Scale your business operations and team' },
    { value: 'fitness', label: 'Health & Fitness', icon: Dumbbell, description: 'Improve physical and mental health' },
    { value: 'creative', label: 'Creative Projects', icon: Palette, description: 'Complete creative projects and artistic goals' },
    { value: 'learning', label: 'Learning & Education', icon: GraduationCap, description: 'Master new subjects and gain certifications' }
  ];

  const timelines = [
    { value: '1-month', label: '1 Month' },
    { value: '3-months', label: '3 Months' },
    { value: '6-months', label: '6 Months' },
    { value: '1-year', label: '1 Year' }
  ];

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
      
      setTimeout(() => {
        const userData: User = {
          name: 'User',
          level: 1,
          hypePoints: 0,
          currentStreak: 0,
          longestStreak: 0,
          goalProgress: 0,
          goalTitle: formData.goalTitle,
          goalTarget: formData.targetValue,
          goalCurrent: formData.currentValue,
          category: formData.category,
          hasCompletedOnboarding: false
        };
        onComplete(userData);
      }, 7000);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <Target className="h-24 w-24 text-[#39d2c0] animate-pulse" style={{ filter: 'drop-shadow(0 0 20px #39d2c0)' }} />
              <div className="absolute inset-0 animate-spin">
                <div className="w-24 h-24 border-4 border-[#39d2c0]/20 border-t-[#39d2c0] rounded-full"></div>
              </div>
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Setting Up Your Journey
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            We're preparing your personalized HypeOS experience...
          </p>
          
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((dot) => (
              <div
                key={dot}
                className="w-3 h-3 bg-[#39d2c0] rounded-full animate-pulse"
                style={{ animationDelay: `${dot * 0.3}s` }}
              />
            ))}
          </div>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
            This will only take a moment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center space-x-3">
            <span>Welcome to HypeOS!</span>
            <Target className="h-8 w-8 text-[#39d2c0]" />
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's set up your goals and start your journey to success
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-[#39d2c0] text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                }`}>
                  {step}
                </div>
                {step < 2 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep 
                      ? 'bg-[#39d2c0]' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-[#39d2c0]" />
                  <span>What do you want to achieve?</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Be specific about what you want to create or accomplish in the next few months
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="goalTitle">Your Main Goal</Label>
                  <Input
                    id="goalTitle"
                    placeholder="e.g., Launch my online course and earn R15k/month"
                    value={formData.goalTitle}
                    onChange={(e) => setFormData({...formData, goalTitle: e.target.value})}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    What specific outcome do you want to achieve?
                  </p>
                </div>

                <div>
                  <Label htmlFor="goalDescription">Why is this important to you?</Label>
                  <Textarea
                    id="goalDescription"
                    placeholder="Describe your motivation and what success looks like for you..."
                    value={formData.goalDescription}
                    onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="category">What's your main focus area?</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger className="mt-1 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Choose your primary focus area" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900">
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem 
                            key={category.value} 
                            value={category.value}
                            className="text-gray-900 dark:text-white focus:bg-[#39d2c0]/10 dark:focus:bg-[#39d2c0]/20"
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <Icon className="h-5 w-5 text-[#39d2c0] flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 dark:text-white">{category.label}</div>
                                <div className="text-xs text-gray-700 dark:text-gray-300 mt-0.5">{category.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-6 w-6 text-[#39d2c0]" />
                  <span>Set Your Timeline & Success Metrics</span>
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Define when you want to achieve this and how you'll measure success
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="timeline">How long do you want to achieve this?</Label>
                  <Select value={formData.timeline} onValueChange={(value) => setFormData({...formData, timeline: value})}>
                    <SelectTrigger className="mt-1 text-gray-900 dark:text-white">
                      <SelectValue placeholder="Choose your timeline" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900">
                      {timelines.map((timeline) => (
                        <SelectItem 
                          key={timeline.value} 
                          value={timeline.value}
                          className="text-gray-900 dark:text-white focus:bg-[#39d2c0]/10 dark:focus:bg-[#39d2c0]/20"
                        >
                          <div className="flex items-center space-x-2 w-full">
                            <span className="font-medium text-gray-900 dark:text-white">{timeline.label}</span>
                            <span className="text-xs text-gray-700 dark:text-gray-300">
                              {timeline.value === '1-month' && 'Quick wins & momentum'}
                              {timeline.value === '3-months' && 'Solid foundation & growth'}
                              {timeline.value === '6-months' && 'Significant progress & results'}
                              {timeline.value === '1-year' && 'Major transformation & mastery'}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="currentValue">Where are you now?</Label>
                    <Input
                      id="currentValue"
                      placeholder="e.g., R2,500/month, 100 followers, 0 products"
                      value={formData.currentValue}
                      onChange={(e) => setFormData({...formData, currentValue: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your current baseline
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="targetValue">Where do you want to be?</Label>
                    <Input
                      id="targetValue"
                      placeholder="e.g., R15,000/month, 10k followers, 3 products"
                      value={formData.targetValue}
                      onChange={(e) => setFormData({...formData, targetValue: e.target.value})}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your target achievement
                    </p>
                  </div>
                </div>

                {/* Goal Preview */}
                <div className="p-6 bg-gradient-to-r from-[#39d2c0]/10 to-blue-500/10 dark:from-[#39d2c0]/20 dark:to-blue-500/20 rounded-lg border border-[#39d2c0]/20">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-[#39d2c0]" />
                    <span>Your Goal Summary</span>
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      {(() => {
                        const category = categories.find(c => c.value === formData.category);
                        const Icon = category?.icon || Target;
                        return <Icon className="h-4 w-4 text-[#39d2c0]" />;
                      })()}
                      <span className="font-medium">{formData.goalTitle}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      <span>Timeline: {timelines.find(t => t.value === formData.timeline)?.label}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <TrendingUp className="h-4 w-4" />
                      <span>Progress: {formData.currentValue} → {formData.targetValue}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
            >
              Back
            </Button>
            
            <Button 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!formData.goalTitle || !formData.category)) ||
                (currentStep === 2 && (!formData.timeline || !formData.targetValue))
              }
              className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
            >
              {currentStep === 2 ? (
                <>
                  Start My Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HypeOSPage() {
  const sessionContext = useSessionSafe();
  const sessionData = sessionContext?.sessionData || null;
  const updateHypeOSData = sessionContext?.updateHypeOSData || (() => {});
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [miniWins, setMiniWins] = useState<MiniWin[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dailyGoal, setDailyGoal] = useState<DailyGoal | null>(null);
  const [reviewQueue, setReviewQueue] = useState<DailyReviewQueue | null>(null);
  const [celebration, setCelebration] = useState<{
    type: 'goal-complete' | 'skill-mastered' | 'streak-milestone' | 'task-complete' | 'level-up';
    message?: string;
  } | null>(null);
  // Initialize showOnboarding based on session data immediately to prevent flash
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check session immediately on mount
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('dreamscale_session');
        if (stored) {
          const parsed = JSON.parse(stored);
          const hasGoals = (parsed?.hypeos?.allGoals?.length > 0) || 
                          (parsed?.hypeos?.user?.goalTitle);
          return !hasGoals; // Show onboarding only if no goals exist
        }
      } catch (e) {
        // Ignore errors
      }
    }
    return false; // Default to false, will be set by useEffect
  });
  const [viewMode, setViewMode] = useState<'default' | 'quests' | 'goals'>('default');
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([1, 1, 1, 1, 1, 1, 1]);
  const [allGoals, setAllGoals] = useState<User[]>([]);
  const [currentGoalId, setCurrentGoalId] = useState<string | null>(null);
  
  // Track if we've loaded from session to prevent loops
  const hasLoadedFromSession = useRef(false);
  const isSavingRef = useRef(false);
  // Track if goal completion celebration has been shown today
  
  // Load HypeOS data directly from localStorage FIRST (like Bizora does)
  // This must happen BEFORE session loading to prevent overwriting
  useEffect(() => {
    if (hasLoadedFromSession.current) return; // Already loaded
    
    try {
      if (typeof window !== 'undefined') {
        const today = new Date().toDateString();
        const savedDate = localStorage.getItem('hypeos:tasksLastDate');
        
        // Load tasks from localStorage FIRST (PRIORITY - like Bizora)
        const savedTasks = localStorage.getItem('hypeos:tasks');
        if (savedTasks && savedDate === today) {
          // We have saved tasks for today - use them! (This takes priority)
          const parsed = JSON.parse(savedTasks);
          console.log('✅ Loaded tasks from localStorage (PRIORITY):', parsed.length, 'tasks', {
            completed: parsed.filter((t: any) => t.completed).length,
            total: parsed.length
          });
          setTasks(parsed);
          // Mark as loaded to prevent session from overwriting
          hasLoadedFromSession.current = true;
        } else if (savedTasks) {
          // Saved tasks exist but from different day - still load them for reference
          const parsed = JSON.parse(savedTasks);
          console.log('📅 Found tasks from different day in localStorage:', parsed.length, 'tasks');
        }
        
        // Load miniWins
        const savedMiniWins = localStorage.getItem('hypeos:miniWins');
        if (savedMiniWins) {
          const parsed = JSON.parse(savedMiniWins);
          console.log('✅ Loaded miniWins from localStorage:', parsed.length, 'miniWins');
          setMiniWins(parsed);
        }
        
        // Load user data
        const savedUser = localStorage.getItem('hypeos:user');
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          console.log('✅ Loaded user from localStorage:', parsed.goalTitle, 'Points:', parsed.hypePoints);
          setUser(parsed);
        }
        
        // Load allGoals
        const savedGoals = localStorage.getItem('hypeos:allGoals');
        if (savedGoals) {
          const parsed = JSON.parse(savedGoals);
          console.log('✅ Loaded goals from localStorage:', parsed.length, 'goals');
          setAllGoals(parsed);
        }
        
        // Load quests
        const savedQuests = localStorage.getItem('hypeos:quests');
        if (savedQuests) {
          const parsed = JSON.parse(savedQuests);
          console.log('✅ Loaded quests from localStorage:', parsed.length, 'quests');
          setQuests(parsed);
        }
        
        // Load tasksLastDate
        if (savedDate) {
          lastTaskDateRef.current = savedDate;
          // Also save to session context for compatibility
          if (sessionContext) {
            updateHypeOSData({ tasksLastDate: savedDate });
          }
        }
        
        // CRITICAL: Set loading to false after localStorage load completes
        // This prevents infinite loading if session loading is skipped
        setIsLoading(false);
      }
    } catch (e) {
      console.warn('Failed to load HypeOS data from localStorage', e);
      // Still set loading to false even on error
      setIsLoading(false);
    }
  }, []); // Only run once on mount - BEFORE session loading
  
  // Save tasks directly to localStorage whenever they change (like Bizora)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && tasks.length > 0) {
        localStorage.setItem('hypeos:tasks', JSON.stringify(tasks));
        console.log('💾 Saved tasks to localStorage:', tasks.length, 'tasks', {
          completed: tasks.filter(t => t.completed).length
        });
      }
    } catch (e) {
      console.warn('Failed to save tasks to localStorage', e);
    }
  }, [tasks]);
  
  // Save miniWins directly to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && miniWins.length > 0) {
        localStorage.setItem('hypeos:miniWins', JSON.stringify(miniWins));
        console.log('💾 Saved miniWins to localStorage:', miniWins.length, 'miniWins');
      }
    } catch (e) {
      console.warn('Failed to save miniWins to localStorage', e);
    }
  }, [miniWins]);
  
  // Save user data directly to localStorage whenever it changes
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem('hypeos:user', JSON.stringify(user));
        console.log('💾 Saved user to localStorage:', user.goalTitle, 'Points:', user.hypePoints);
      }
    } catch (e) {
      console.warn('Failed to save user to localStorage', e);
    }
  }, [user]);
  
  // Save allGoals directly to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && allGoals.length > 0) {
        localStorage.setItem('hypeos:allGoals', JSON.stringify(allGoals));
        console.log('💾 Saved goals to localStorage:', allGoals.length, 'goals');
      }
    } catch (e) {
      console.warn('Failed to save goals to localStorage', e);
    }
  }, [allGoals]);
  
  // Save quests directly to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && quests.length > 0) {
        localStorage.setItem('hypeos:quests', JSON.stringify(quests));
        console.log('💾 Saved quests to localStorage:', quests.length, 'quests');
      }
    } catch (e) {
      console.warn('Failed to save quests to localStorage', e);
    }
  }, [quests]);
  const goalCelebrationShownRef = useRef<string | null>(null);
  // Track the last date tasks were generated for daily reset
  const lastTaskDateRef = useRef<string | null>(null);
  // Track the last processed session data to prevent reprocessing
  const lastProcessedSessionRef = useRef<string>('');

  // Date-based seed for consistent randomization per day
  const getDateSeed = (date: Date = new Date()) => {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
    return dateString.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  };

  // Shuffle array using date-based seed for consistent daily randomization
  const seededShuffle = <T,>(array: T[], seed: number): T[] => {
    const shuffled = [...array];
    let currentSeed = seed;
    
    // Simple seeded random number generator
    const seededRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
    
    // Fisher-Yates shuffle with seeded random
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  };

  // Generate initial tasks based on user's goal and category
  const generateInitialTasks = (userData: User) => {
    const getNicheSpecificTasks = (category: string, goalTitle: string) => {
      const baseTasks = {
        revenue: [
          { title: `Research revenue streams for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'research', time: '45 min' },
          { title: 'Analyze your current income sources', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' },
          { title: 'Create pricing strategy for your offerings', points: 250, impact: 'high' as const, category: 'strategy', time: '60 min' },
          { title: 'Set up payment and invoicing systems', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' },
          { title: `Identify 3 new revenue opportunities for ${goalTitle.toLowerCase()}`, points: 180, impact: 'high' as const, category: 'research', time: '40 min' },
          { title: 'Calculate profit margins for each product/service', points: 120, impact: 'medium' as const, category: 'analysis', time: '25 min' },
          { title: 'Research competitor pricing strategies', points: 160, impact: 'medium' as const, category: 'research', time: '35 min' },
          { title: 'Create upsell and cross-sell opportunities', points: 220, impact: 'high' as const, category: 'strategy', time: '50 min' },
          { title: 'Set up automated billing and subscriptions', points: 140, impact: 'medium' as const, category: 'setup', time: '30 min' },
          { title: 'Analyze customer lifetime value (LTV)', points: 190, impact: 'high' as const, category: 'analysis', time: '45 min' },
          { title: 'Create revenue forecast for next quarter', points: 240, impact: 'high' as const, category: 'planning', time: '55 min' },
          { title: 'Optimize pricing for maximum conversion', points: 200, impact: 'high' as const, category: 'strategy', time: '45 min' }
        ],
        audience: [
          { title: `Define your target audience for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'research', time: '45 min' },
          { title: 'Audit your current social media presence', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' },
          { title: 'Create content calendar for next 30 days', points: 250, impact: 'high' as const, category: 'planning', time: '60 min' },
          { title: 'Set up analytics tracking for growth metrics', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' },
          { title: `Build an email list strategy for ${goalTitle.toLowerCase()}`, points: 220, impact: 'high' as const, category: 'strategy', time: '50 min' },
          { title: 'Create audience personas and buyer profiles', points: 180, impact: 'high' as const, category: 'research', time: '40 min' },
          { title: 'Engage with 20 posts from your target audience', points: 120, impact: 'medium' as const, category: 'engagement', time: '25 min' },
          { title: 'Set up social media listening tools', points: 140, impact: 'medium' as const, category: 'setup', time: '30 min' },
          { title: 'Analyze competitor audience growth strategies', points: 160, impact: 'medium' as const, category: 'research', time: '35 min' },
          { title: 'Create lead magnet to grow your audience', points: 240, impact: 'high' as const, category: 'creation', time: '55 min' },
          { title: 'Run a poll or survey to understand your audience', points: 130, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Optimize your social media bio and profile', points: 110, impact: 'low' as const, category: 'optimization', time: '20 min' }
        ],
        product: [
          { title: `Conduct market research for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'research', time: '45 min' },
          { title: 'Create product roadmap and timeline', points: 250, impact: 'high' as const, category: 'planning', time: '60 min' },
          { title: 'Develop MVP (Minimum Viable Product) features', points: 300, impact: 'high' as const, category: 'development', time: '90 min' },
          { title: 'Set up product testing and feedback system', points: 150, impact: 'medium' as const, category: 'setup', time: '30 min' },
          { title: `Design user experience flow for ${goalTitle.toLowerCase()}`, points: 220, impact: 'high' as const, category: 'design', time: '50 min' },
          { title: 'Create product feature prioritization matrix', points: 180, impact: 'high' as const, category: 'planning', time: '40 min' },
          { title: 'Interview 3 potential users about their needs', points: 160, impact: 'high' as const, category: 'research', time: '35 min' },
          { title: 'Build product landing page or demo', points: 240, impact: 'high' as const, category: 'development', time: '55 min' },
          { title: 'Set up user onboarding process', points: 140, impact: 'medium' as const, category: 'setup', time: '30 min' },
          { title: 'Create product documentation and guides', points: 130, impact: 'medium' as const, category: 'documentation', time: '30 min' },
          { title: 'Analyze competitor products and features', points: 170, impact: 'medium' as const, category: 'research', time: '40 min' },
          { title: 'Plan product launch strategy and timeline', points: 210, impact: 'high' as const, category: 'strategy', time: '50 min' }
        ],
        marketing: [
          { title: `Create marketing strategy for ${goalTitle.toLowerCase()}`, points: 250, impact: 'high' as const, category: 'strategy', time: '60 min' },
          { title: 'Design marketing materials and assets', points: 200, impact: 'medium' as const, category: 'creative', time: '45 min' },
          { title: 'Set up social media advertising campaigns', points: 200, impact: 'medium' as const, category: 'execution', time: '45 min' },
          { title: 'Track and analyze campaign performance', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' },
          { title: `Develop brand messaging for ${goalTitle.toLowerCase()}`, points: 220, impact: 'high' as const, category: 'strategy', time: '50 min' },
          { title: 'Create email marketing campaign sequence', points: 180, impact: 'high' as const, category: 'creation', time: '40 min' },
          { title: 'Set up Google Analytics and conversion tracking', points: 140, impact: 'medium' as const, category: 'setup', time: '30 min' },
          { title: 'Research best marketing channels for your niche', points: 160, impact: 'medium' as const, category: 'research', time: '35 min' },
          { title: 'Create A/B test for marketing copy', points: 130, impact: 'medium' as const, category: 'optimization', time: '30 min' },
          { title: 'Build partnerships with complementary brands', points: 190, impact: 'high' as const, category: 'networking', time: '45 min' },
          { title: 'Create referral program to grow organically', points: 170, impact: 'high' as const, category: 'strategy', time: '40 min' },
          { title: 'Analyze ROI of different marketing channels', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' }
        ],
        content: [
          { title: `Develop content strategy for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'strategy', time: '45 min' },
          { title: 'Create content calendar and themes', points: 150, impact: 'medium' as const, category: 'planning', time: '30 min' },
          { title: 'Produce first batch of content pieces', points: 300, impact: 'high' as const, category: 'creation', time: '90 min' },
          { title: 'Set up content distribution channels', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' },
          { title: `Write blog post about ${goalTitle.toLowerCase()}`, points: 220, impact: 'high' as const, category: 'writing', time: '50 min' },
          { title: 'Create video content or tutorial', points: 240, impact: 'high' as const, category: 'creation', time: '55 min' },
          { title: 'Design social media graphics and visuals', points: 160, impact: 'medium' as const, category: 'creative', time: '35 min' },
          { title: 'Research trending topics in your niche', points: 120, impact: 'medium' as const, category: 'research', time: '25 min' },
          { title: 'Create content templates for consistency', points: 140, impact: 'medium' as const, category: 'planning', time: '30 min' },
          { title: 'Engage with comments and build community', points: 110, impact: 'low' as const, category: 'engagement', time: '20 min' },
          { title: 'Repurpose existing content for new formats', points: 180, impact: 'medium' as const, category: 'creation', time: '40 min' },
          { title: 'Analyze content performance and optimize', points: 150, impact: 'medium' as const, category: 'analysis', time: '30 min' }
        ],
        business: [
          { title: `Create business growth plan for ${goalTitle.toLowerCase()}`, points: 250, impact: 'high' as const, category: 'strategy', time: '60 min' },
          { title: 'Analyze current business operations', points: 200, impact: 'medium' as const, category: 'analysis', time: '45 min' },
          { title: 'Identify growth opportunities and partnerships', points: 200, impact: 'medium' as const, category: 'research', time: '45 min' },
          { title: 'Set up systems for scaling operations', points: 150, impact: 'medium' as const, category: 'setup', time: '30 min' },
          { title: `Develop competitive advantage for ${goalTitle.toLowerCase()}`, points: 220, impact: 'high' as const, category: 'strategy', time: '50 min' },
          { title: 'Create standard operating procedures (SOPs)', points: 180, impact: 'high' as const, category: 'documentation', time: '40 min' },
          { title: 'Automate repetitive business processes', points: 190, impact: 'high' as const, category: 'optimization', time: '45 min' },
          { title: 'Research and implement business tools', points: 140, impact: 'medium' as const, category: 'setup', time: '30 min' },
          { title: 'Build strategic partnerships or alliances', points: 170, impact: 'high' as const, category: 'networking', time: '40 min' },
          { title: 'Analyze cash flow and financial health', points: 160, impact: 'medium' as const, category: 'analysis', time: '35 min' },
          { title: 'Create customer retention strategy', points: 200, impact: 'high' as const, category: 'strategy', time: '45 min' },
          { title: 'Set up key performance indicators (KPIs)', points: 150, impact: 'medium' as const, category: 'planning', time: '30 min' }
        ],
        skills: [
          { title: `Identify key skills needed for ${goalTitle.toLowerCase()}`, points: 150, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Create learning roadmap and schedule', points: 200, impact: 'high' as const, category: 'planning', time: '45 min' },
          { title: 'Enroll in relevant courses or training', points: 100, impact: 'low' as const, category: 'action', time: '20 min' },
          { title: 'Practice and apply new skills daily', points: 250, impact: 'high' as const, category: 'practice', time: '60 min' },
          { title: `Find mentors or experts in ${goalTitle.toLowerCase()}`, points: 120, impact: 'medium' as const, category: 'networking', time: '25 min' },
          { title: 'Complete one skill-building exercise', points: 180, impact: 'high' as const, category: 'practice', time: '40 min' },
          { title: 'Join communities related to your skills', points: 110, impact: 'low' as const, category: 'networking', time: '20 min' },
          { title: 'Create a skill assessment to track progress', points: 140, impact: 'medium' as const, category: 'planning', time: '30 min' },
          { title: 'Watch educational videos or tutorials', points: 130, impact: 'medium' as const, category: 'learning', time: '30 min' },
          { title: 'Practice skills through real projects', points: 220, impact: 'high' as const, category: 'practice', time: '50 min' },
          { title: 'Read industry books or articles', points: 120, impact: 'medium' as const, category: 'learning', time: '25 min' },
          { title: 'Teach someone else what you learned', points: 160, impact: 'high' as const, category: 'practice', time: '35 min' }
        ],
        creative: [
          { title: `Brainstorm creative concepts for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'ideation', time: '45 min' },
          { title: 'Create mood boards and inspiration collection', points: 150, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Start working on your creative project', points: 300, impact: 'high' as const, category: 'creation', time: '90 min' },
          { title: 'Share work and gather feedback', points: 100, impact: 'low' as const, category: 'sharing', time: '20 min' },
          { title: `Experiment with new creative techniques for ${goalTitle.toLowerCase()}`, points: 220, impact: 'high' as const, category: 'creation', time: '50 min' },
          { title: 'Create a creative brief or project outline', points: 140, impact: 'medium' as const, category: 'planning', time: '30 min' },
          { title: 'Explore different creative styles and approaches', points: 160, impact: 'medium' as const, category: 'research', time: '35 min' },
          { title: 'Build a creative portfolio or showcase', points: 180, impact: 'high' as const, category: 'creation', time: '40 min' },
          { title: 'Collaborate with other creatives', points: 130, impact: 'medium' as const, category: 'networking', time: '30 min' },
          { title: 'Refine and polish existing creative work', points: 170, impact: 'medium' as const, category: 'creation', time: '40 min' },
          { title: 'Document your creative process', points: 120, impact: 'low' as const, category: 'documentation', time: '25 min' },
          { title: 'Set creative goals and milestones', points: 150, impact: 'medium' as const, category: 'planning', time: '30 min' }
        ],
        learning: [
          { title: `Research best resources for ${goalTitle.toLowerCase()}`, points: 150, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Create study schedule and milestones', points: 200, impact: 'high' as const, category: 'planning', time: '45 min' },
          { title: 'Start first learning module or course', points: 250, impact: 'high' as const, category: 'learning', time: '60 min' },
          { title: 'Take notes and create knowledge base', points: 100, impact: 'low' as const, category: 'documentation', time: '20 min' },
          { title: `Find study groups or learning communities for ${goalTitle.toLowerCase()}`, points: 120, impact: 'medium' as const, category: 'networking', time: '25 min' },
          { title: 'Complete practice exercises or quizzes', points: 180, impact: 'high' as const, category: 'practice', time: '40 min' },
          { title: 'Create flashcards or study aids', points: 110, impact: 'low' as const, category: 'planning', time: '20 min' },
          { title: 'Watch educational lectures or webinars', points: 160, impact: 'medium' as const, category: 'learning', time: '35 min' },
          { title: 'Apply learning to a real-world project', points: 220, impact: 'high' as const, category: 'practice', time: '50 min' },
          { title: 'Review and summarize key concepts learned', points: 140, impact: 'medium' as const, category: 'documentation', time: '30 min' },
          { title: 'Take a practice test or assessment', points: 130, impact: 'medium' as const, category: 'practice', time: '30 min' },
          { title: 'Teach the concept to someone else', points: 170, impact: 'high' as const, category: 'practice', time: '40 min' }
        ],
        fitness: [
          { title: `Create fitness plan for ${goalTitle.toLowerCase()}`, points: 200, impact: 'high' as const, category: 'planning', time: '45 min' },
          { title: 'Set up workout tracking system', points: 100, impact: 'low' as const, category: 'setup', time: '20 min' },
          { title: 'Start first workout session', points: 250, impact: 'high' as const, category: 'action', time: '60 min' },
          { title: 'Plan healthy meals for the week', points: 150, impact: 'medium' as const, category: 'planning', time: '30 min' },
          { title: `Research workout routines for ${goalTitle.toLowerCase()}`, points: 120, impact: 'medium' as const, category: 'research', time: '25 min' },
          { title: 'Track your daily steps and activity', points: 110, impact: 'low' as const, category: 'tracking', time: '20 min' },
          { title: 'Create a meal prep plan', points: 140, impact: 'medium' as const, category: 'planning', time: '30 min' },
          { title: 'Do a 20-minute home workout', points: 180, impact: 'high' as const, category: 'action', time: '20 min' },
          { title: 'Research healthy recipes and nutrition tips', points: 130, impact: 'medium' as const, category: 'research', time: '30 min' },
          { title: 'Set up a workout accountability system', points: 120, impact: 'medium' as const, category: 'setup', time: '25 min' },
          { title: 'Take progress photos and measurements', points: 100, impact: 'low' as const, category: 'tracking', time: '15 min' },
          { title: 'Plan active recovery or stretching routine', points: 150, impact: 'medium' as const, category: 'planning', time: '30 min' }
        ]
      };

      const allTasks = baseTasks[category as keyof typeof baseTasks] || baseTasks.revenue;
      
      // Use date-based seed to shuffle and select 4 tasks consistently per day
      const today = new Date();
      const seed = getDateSeed(today);
      const shuffled = seededShuffle(allTasks, seed);
      
      // Select 4 tasks, ensuring variety in impact levels
      type TaskType = typeof allTasks[number];
      const selected: TaskType[] = [];
      const selectedTitles = new Set<string>();
      const impactCounts = { high: 0, medium: 0, low: 0 };
      const targetCounts = { high: 2, medium: 1, low: 1 }; // Prefer 2 high, 1 medium, 1 low
      
      // First pass: try to get ideal distribution
      for (const task of shuffled) {
        if (selected.length >= 4) break;
        if (impactCounts[task.impact] < targetCounts[task.impact] && !selectedTitles.has(task.title)) {
          selected.push(task);
          selectedTitles.add(task.title);
          impactCounts[task.impact]++;
        }
      }
      
      // Second pass: fill remaining slots if needed
      for (const task of shuffled) {
        if (selected.length >= 4) break;
        if (!selectedTitles.has(task.title)) {
          selected.push(task);
          selectedTitles.add(task.title);
        }
      }
      
      return selected.slice(0, 4);
    };

    const getNicheSpecificMiniWins = (category: string) => {
      const miniWinsByCategory = {
        revenue: [
          { title: 'Research one new revenue stream idea', points: 25, time: '5 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Write down your current income sources', points: 30, time: '3 min', category: 'planning', difficulty: 'easy' as const },
          { title: 'Calculate your hourly rate', points: 20, time: '2 min', category: 'analysis', difficulty: 'easy' as const }
        ],
        audience: [
          { title: 'Engage with 5 posts in your niche', points: 25, time: '5 min', category: 'engagement', difficulty: 'easy' as const },
          { title: 'Write down 3 audience pain points', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Follow 3 new accounts in your industry', points: 15, time: '2 min', category: 'networking', difficulty: 'easy' as const }
        ],
        product: [
          { title: 'Sketch one product feature idea', points: 25, time: '5 min', category: 'ideation', difficulty: 'easy' as const },
          { title: 'Write down 3 user problems to solve', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Research one competitor product', points: 20, time: '2 min', category: 'analysis', difficulty: 'easy' as const }
        ],
        marketing: [
          { title: 'Create one social media post', points: 25, time: '5 min', category: 'content', difficulty: 'easy' as const },
          { title: 'Write down 3 marketing channels to try', points: 30, time: '3 min', category: 'planning', difficulty: 'easy' as const },
          { title: 'Engage with 3 posts from your target audience', points: 15, time: '2 min', category: 'engagement', difficulty: 'easy' as const }
        ],
        content: [
          { title: 'Write one social media caption', points: 25, time: '5 min', category: 'writing', difficulty: 'easy' as const },
          { title: 'Find 3 content ideas for this week', points: 30, time: '3 min', category: 'ideation', difficulty: 'easy' as const },
          { title: 'Engage with 3 posts in your niche', points: 15, time: '2 min', category: 'engagement', difficulty: 'easy' as const }
        ],
        business: [
          { title: 'Write down one business goal for this week', points: 25, time: '5 min', category: 'planning', difficulty: 'easy' as const },
          { title: 'Research one business tool or software', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Connect with one person in your industry', points: 20, time: '2 min', category: 'networking', difficulty: 'easy' as const }
        ],
        skills: [
          { title: 'Watch one 5-minute tutorial', points: 25, time: '5 min', category: 'learning', difficulty: 'easy' as const },
          { title: 'Practice one skill for 3 minutes', points: 30, time: '3 min', category: 'practice', difficulty: 'easy' as const },
          { title: 'Write down one thing you learned today', points: 20, time: '2 min', category: 'reflection', difficulty: 'easy' as const }
        ],
        creative: [
          { title: 'Create one quick sketch or doodle', points: 25, time: '5 min', category: 'creation', difficulty: 'easy' as const },
          { title: 'Find 3 pieces of creative inspiration', points: 30, time: '3 min', category: 'research', difficulty: 'easy' as const },
          { title: 'Write down one creative idea', points: 20, time: '2 min', category: 'ideation', difficulty: 'easy' as const }
        ],
        learning: [
          { title: 'Read one educational article', points: 25, time: '5 min', category: 'reading', difficulty: 'easy' as const },
          { title: 'Take notes on one key concept', points: 30, time: '3 min', category: 'documentation', difficulty: 'easy' as const },
          { title: 'Write down one question to research', points: 20, time: '2 min', category: 'curiosity', difficulty: 'easy' as const }
        ],
        fitness: [
          { title: 'Do 10 push-ups or squats', points: 25, time: '5 min', category: 'exercise', difficulty: 'easy' as const },
          { title: 'Drink a glass of water', points: 15, time: '1 min', category: 'health', difficulty: 'easy' as const },
          { title: 'Write down one healthy meal idea', points: 20, time: '2 min', category: 'planning', difficulty: 'easy' as const }
        ]
      };

      return miniWinsByCategory[category as keyof typeof miniWinsByCategory] || miniWinsByCategory.revenue;
    };

    const nicheTasks = getNicheSpecificTasks(userData.category || 'revenue', userData.goalTitle);
    const initialTasks: Task[] = nicheTasks.map((task, index) => ({
      id: index + 1,
      title: task.title,
      completed: false,
      points: task.points,
      impact: task.impact,
      category: task.category,
      estimatedTime: task.time
    }));

    const nicheMiniWins = getNicheSpecificMiniWins(userData.category || 'revenue');
    const initialMiniWins: MiniWin[] = nicheMiniWins.map((win, index) => ({
      id: index + 1,
      title: win.title,
      completed: false,
      points: win.points,
      time: win.time,
      category: win.category,
      difficulty: win.difficulty
    }));

    setTasks(initialTasks);
    setMiniWins(initialMiniWins);
    
    const initialQuests = initializeQuests();
    setQuests(initialQuests);
  };

  // Check if user has completed onboarding and load from session
  useEffect(() => {
    // Only skip if we're currently saving or already loaded
    if (isSavingRef.current || hasLoadedFromSession.current) return;
    
    // Create a unique key for this session data to prevent reprocessing
    const sessionKey = JSON.stringify({
      user: sessionData?.hypeos?.user?.goalTitle,
      goalsCount: (sessionData?.hypeos as any)?.allGoals?.length || 0,
      tasksLastDate: sessionData?.hypeos?.tasksLastDate
    });
    
    // Skip if we've already processed this exact session state
    if (lastProcessedSessionRef.current === sessionKey) return;
    
    const checkUserStatus = () => {
      try {
        const sessionUser = sessionData?.hypeos?.user;
        const goalsList = (sessionData?.hypeos as any)?.allGoals || [];
        
        // Mark this session state as processed
        lastProcessedSessionRef.current = sessionKey;
        
        // Immediately hide onboarding if goals exist (prevent flash)
        const hasGoalData = (sessionUser && sessionUser.goalTitle) || (goalsList.length > 0 && goalsList[0]?.goalTitle);
        if (hasGoalData) {
          setShowOnboarding(false);
        }
        
        // Load all goals if available
        if (goalsList.length > 0) {
          setAllGoals(goalsList);
          // Set current goal to first one if not set
          if (!currentGoalId && goalsList.length > 0) {
            const firstGoalId = goalsList[0].goalTitle + '-' + goalsList[0].category;
            setCurrentGoalId(firstGoalId);
          }
        }
        
        // If goals exist, user has completed onboarding (even if flag is missing)
        if (hasGoalData) {
          // Set flag early to prevent re-runs
          hasLoadedFromSession.current = true;
          console.log('Loading user from session');
          
          // Use sessionUser if available, otherwise use first goal from goalsList
          const userToLoad = sessionUser || (goalsList.length > 0 ? goalsList[0] : null);
          if (userToLoad) {
            // Ensure hasCompletedOnboarding is set and preserve ALL user data including streak
            // Check if it's a new day and update streak accordingly
            const today = new Date();
            const todayString = today.toDateString();
            const tasksLastDate = sessionData?.hypeos?.tasksLastDate || null;
            const lastActiveDateStr = userToLoad.lastActiveDate || tasksLastDate || todayString;
            const lastActiveDate = new Date(lastActiveDateStr);
            
            // Use updateStreak to properly calculate streak if it's a new day
            // IMPORTANT: Don't update lastActiveDate unless tasks were completed today
            // Preserve the original lastActiveDate to correctly calculate streak
            const savedStreakData: StreakData = {
              currentStreak: userToLoad.currentStreak ?? 0,
              longestStreak: userToLoad.longestStreak ?? 0,
              lastActiveDate: lastActiveDate,
              streakStartDate: userToLoad.streakStartDate ? new Date(userToLoad.streakStartDate) : lastActiveDate,
              totalDaysActive: userToLoad.currentStreak ?? 0
            };
            
            // IMPORTANT: Don't update streak on page load - only preserve what's saved
            // Streak should only be updated when tasks are actually completed
            // This prevents the streak from resetting just because time has passed
            const isNewDay = lastActiveDate.toDateString() !== todayString;
            let finalStreakData = savedStreakData;
            
            // Always preserve the saved streak on page load
            // Don't call updateStreak here - it will be called when tasks are completed
            console.log('📅 Preserving streak on load:', {
              streak: savedStreakData.currentStreak,
              lastActive: lastActiveDate.toDateString(),
              today: todayString,
              isNewDay: isNewDay
            });
            
            // Preserve the original lastActiveDate - don't update it on page load
            // It will only be updated when tasks are completed
            const newLastActiveDate = userToLoad.lastActiveDate || lastActiveDate.toISOString();
            
            const userWithOnboarding = {
              ...userToLoad,
              hasCompletedOnboarding: true,
              // Use calculated streak data
              currentStreak: finalStreakData.currentStreak,
              longestStreak: finalStreakData.longestStreak,
              lastActiveDate: newLastActiveDate,
              streakStartDate: finalStreakData.streakStartDate.toISOString(),
              // Preserve all other data
              hypePoints: userToLoad.hypePoints ?? 0,
              level: userToLoad.level ?? 1,
              goalProgress: userToLoad.goalProgress ?? 0
            };
            
            // Only set user if it's different to prevent unnecessary re-renders
            if (!user || user.goalTitle !== userWithOnboarding.goalTitle || 
                user.currentStreak !== userWithOnboarding.currentStreak) {
              setUser(userWithOnboarding);
            }
            
            // Migrate existing single goal to allGoals if not already there
            if (goalsList.length === 0 && sessionUser) {
              setAllGoals([userWithOnboarding]);
              const goalId = sessionUser.goalTitle + '-' + sessionUser.category;
              setCurrentGoalId(goalId);
            } else if (goalsList.length > 0 && !currentGoalId) {
              const goalId = goalsList[0].goalTitle + '-' + goalsList[0].category;
              setCurrentGoalId(goalId);
            }
            
            // Only update session if data actually changed (to prevent infinite loops)
            // Don't update if only streak calculation changed but values are the same
            const isNewDayForUpdate = lastActiveDate.toDateString() !== todayString;
            const needsUpdate = !sessionUser?.hasCompletedOnboarding || 
                (sessionUser?.currentStreak !== userWithOnboarding.currentStreak) ||
                (isNewDayForUpdate && sessionUser?.lastActiveDate !== userWithOnboarding.lastActiveDate) ||
                (goalsList.length === 0 && sessionUser);
            
            if (needsUpdate) {
              // Use setTimeout to prevent immediate re-trigger of useEffect
              setTimeout(() => {
                if (!hasLoadedFromSession.current) return; // Guard against race conditions
                
                const updatedGoals = goalsList.length > 0 ? goalsList.map((g: any) => 
                  g.goalTitle === userWithOnboarding.goalTitle ? userWithOnboarding : g
                ) : [userWithOnboarding];
                
                updateHypeOSData({
                  user: userWithOnboarding,
                  allGoals: updatedGoals
                });
              }, 200);
            }
            
            // Check if tasks need to be reset for a new day
            const tasksLastDateForLoading = sessionData?.hypeos?.tasksLastDate || null;
            
            // IMPORTANT: Check localStorage FIRST before using session data
            // localStorage has priority (like Bizora) to prevent overwriting saved data
            const savedTasksFromStorage = typeof window !== 'undefined' ? localStorage.getItem('hypeos:tasks') : null;
            const savedDateFromStorage = typeof window !== 'undefined' ? localStorage.getItem('hypeos:tasksLastDate') : null;
            
            // If localStorage already has today's tasks, don't overwrite with session data
            if (savedTasksFromStorage && savedDateFromStorage === todayString) {
              // localStorage has priority - already loaded, don't overwrite
              console.log('✅ localStorage data already loaded (PRIORITY), skipping session data to prevent overwrite');
            } else if (sessionData?.hypeos?.tasks && sessionData.hypeos.tasks.length > 0) {
              // No localStorage data, but session has tasks
              if (tasksLastDateForLoading === todayString) {
                // Session has today's tasks - use them (but also save to localStorage)
                setTasks(sessionData.hypeos.tasks);
                console.log('✅ Loaded', sessionData.hypeos.tasks.length, 'saved tasks from session (localStorage empty)', {
                  completed: sessionData.hypeos.tasks.filter((t: any) => t.completed).length,
                  total: sessionData.hypeos.tasks.length
                });
                // Immediately save to localStorage for future priority
                try {
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('hypeos:tasks', JSON.stringify(sessionData.hypeos.tasks));
                    localStorage.setItem('hypeos:tasksLastDate', todayString);
                  }
                } catch (e) {
                  console.warn('Failed to save session tasks to localStorage', e);
                }
              } else {
                // Different day - generate new tasks
                console.log('🔄 Different day detected', { tasksLastDateForLoading, todayString });
                generateInitialTasks(userWithOnboarding);
                updateHypeOSData({
                  tasksLastDate: todayString
                });
              }
            } else {
              // No session tasks - check localStorage before generating
              if (savedTasksFromStorage && savedDateFromStorage === todayString) {
                // localStorage has today's tasks - use them
                const parsed = JSON.parse(savedTasksFromStorage);
                setTasks(parsed);
                console.log('✅ Loaded tasks from localStorage (session empty)', {
                  completed: parsed.filter((t: any) => t.completed).length,
                  total: parsed.length
                });
              } else {
                // No saved tasks anywhere - generate fresh tasks
                console.log('🔄 No saved tasks found - generating fresh randomized tasks');
                generateInitialTasks(userWithOnboarding);
                // Save the date tasks were generated
                updateHypeOSData({
                  tasksLastDate: todayString
                });
              }
            }
            
            lastTaskDateRef.current = todayString;
            
            // Always load miniWins and quests if they exist
            if (sessionData?.hypeos?.miniWins && sessionData.hypeos.miniWins.length > 0) {
              setMiniWins(sessionData.hypeos.miniWins);
              console.log('✅ Loaded', sessionData.hypeos.miniWins.length, 'saved miniWins from session');
            }
            if (sessionData?.hypeos?.quests && sessionData.hypeos.quests.length > 0) {
              setQuests(sessionData.hypeos.quests);
              console.log('✅ Loaded', sessionData.hypeos.quests.length, 'saved quests from session');
            }
            
            // Phase 3: Initialize daily goal
            const userId = sessionData?.email || userWithOnboarding.name || 'default-user';
            const goal = getOrCreateTodayGoal(userId);
            setDailyGoal(goal);
            
            // Phase 4: Generate review queue
            try {
              const performanceProfile = getUserPerformanceProfile(userId);
              const streakData: StreakData = {
                currentStreak: userWithOnboarding.currentStreak || 0,
                longestStreak: userWithOnboarding.longestStreak || 0,
                lastActiveDate: new Date(),
                streakStartDate: new Date(),
                totalDaysActive: userWithOnboarding.currentStreak || 0
              };
              
              // Use tasks from state or session data
              const currentTasks = tasks.length > 0 ? tasks : (sessionData?.hypeos?.tasks || []);
              
              if (currentTasks.length > 0) {
                const unifiedTasks = currentTasks.map((task: any) => ({
                  id: task.id,
                  title: task.title || 'Untitled Task',
                  category: task.category || 'general',
                  impact: task.impact || 'medium',
                  basePoints: task.points || 10,
                  skill: task.category ? `${task.category}-${task.id}` : undefined
                }));
                
                const queue = generateDailyReviewQueue(
                  unifiedTasks,
                  userId,
                  performanceProfile,
                  streakData,
                  10
                );
                setReviewQueue(queue);
              } else {
                // Empty queue if no tasks
                setReviewQueue({
                  items: [],
                  totalItems: 0,
                  overdueCount: 0,
                  weakenedCount: 0,
                  newCount: 0,
                  estimatedTime: 0,
                  generatedAt: new Date()
                });
              }
            } catch (error) {
              console.error('Error generating review queue:', error);
              // Set empty queue on error
              setReviewQueue({
                items: [],
                totalItems: 0,
                overdueCount: 0,
                weakenedCount: 0,
                newCount: 0,
                estimatedTime: 0,
                generatedAt: new Date()
              });
            }
          }
        } else if (goalsList.length > 0) {
          // Set flag early to prevent re-runs
          hasLoadedFromSession.current = true;
          
          // Check if there are any goals in the list (even if sessionUser doesn't have hasCompletedOnboarding)
          // Load the first goal and ensure onboarding flag is set, preserve and calculate streak
          const todayForGoal = new Date();
          const todayStringForGoal = todayForGoal.toDateString();
          const savedTasksLastDateForGoal = sessionData?.hypeos?.tasksLastDate || null;
          const goalToLoad = goalsList[0];
          const lastActiveDateStr = goalToLoad.lastActiveDate || savedTasksLastDateForGoal || todayStringForGoal;
          const lastActiveDate = new Date(lastActiveDateStr);
          
          // Use updateStreak to properly calculate streak if it's a new day
          // IMPORTANT: Don't update lastActiveDate unless tasks were completed today
          const savedStreakData: StreakData = {
            currentStreak: goalToLoad.currentStreak ?? 0,
            longestStreak: goalToLoad.longestStreak ?? 0,
            lastActiveDate: lastActiveDate,
            streakStartDate: goalToLoad.streakStartDate ? new Date(goalToLoad.streakStartDate) : lastActiveDate,
            totalDaysActive: goalToLoad.currentStreak ?? 0
          };
          
          // Only update streak if it's actually a new day (not same day)
          // Preserve streak if same day to prevent resetting
          // IMPORTANT: Don't update streak on page load - only preserve what's saved
          // Streak should only be updated when tasks are actually completed
          const isNewDayForGoal = lastActiveDate.toDateString() !== todayStringForGoal;
          let finalStreakData = savedStreakData;
          
          // Always preserve the saved streak on page load
          // Don't call updateStreak here - it will be called when tasks are completed
          console.log('📅 Preserving streak on load (goal):', {
            streak: savedStreakData.currentStreak,
            lastActive: lastActiveDate.toDateString(),
            today: todayStringForGoal,
            isNewDay: isNewDayForGoal
          });
          
          // Preserve the original lastActiveDate - don't update it on page load
          const newLastActiveDateForGoal = goalToLoad.lastActiveDate || lastActiveDate.toISOString();
          
          const firstGoal = {
            ...goalToLoad,
            hasCompletedOnboarding: true,
            // Use calculated streak data
            currentStreak: finalStreakData.currentStreak,
            longestStreak: finalStreakData.longestStreak,
            lastActiveDate: newLastActiveDateForGoal,
            streakStartDate: finalStreakData.streakStartDate.toISOString()
          };
          
          // Only set user if it's different to prevent unnecessary re-renders
          if (!user || user.goalTitle !== firstGoal.goalTitle || 
              user.currentStreak !== firstGoal.currentStreak) {
            setUser(firstGoal);
          }
          setCurrentGoalId(firstGoal.goalTitle + '-' + firstGoal.category);
          
          // Only update session if needed (to prevent infinite loops)
          const isNewDayForGoalUpdate = lastActiveDate.toDateString() !== todayStringForGoal;
          const needsUpdate = !goalsList[0]?.hasCompletedOnboarding ||
            (goalsList[0]?.currentStreak !== firstGoal.currentStreak) ||
            (isNewDayForGoalUpdate && goalsList[0]?.lastActiveDate !== firstGoal.lastActiveDate);
          
          if (needsUpdate) {
            // Use setTimeout to prevent immediate re-trigger of useEffect
            setTimeout(() => {
              if (!hasLoadedFromSession.current) return; // Guard against race conditions
              
              updateHypeOSData({
                user: firstGoal,
                allGoals: goalsList.map((g: any) => 
                  g.goalTitle === firstGoal.goalTitle ? firstGoal : g
                )
              });
            }, 200);
          }
          
          // IMPORTANT: Check localStorage FIRST before using session data (like Bizora)
          // localStorage has priority to prevent overwriting saved data
          const savedTasksFromStorage = typeof window !== 'undefined' ? localStorage.getItem('hypeos:tasks') : null;
          const savedDateFromStorage = typeof window !== 'undefined' ? localStorage.getItem('hypeos:tasksLastDate') : null;
          
          // If localStorage already has today's tasks, don't overwrite with session data
          if (savedTasksFromStorage && savedDateFromStorage === todayStringForGoal) {
            // localStorage has priority - already loaded, don't overwrite
            console.log('✅ localStorage data already loaded (PRIORITY - goal), skipping session data');
          } else if (sessionData?.hypeos?.tasks && sessionData.hypeos.tasks.length > 0) {
            // No localStorage data, but session has tasks
            if (savedTasksLastDateForGoal === todayStringForGoal) {
              // Session has today's tasks - use them (but also save to localStorage)
              setTasks(sessionData.hypeos.tasks);
              console.log('✅ Loaded', sessionData.hypeos.tasks.length, 'saved tasks from session (localStorage empty - goal)', {
                completed: sessionData.hypeos.tasks.filter((t: any) => t.completed).length,
                total: sessionData.hypeos.tasks.length
              });
              // Immediately save to localStorage for future priority
              try {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('hypeos:tasks', JSON.stringify(sessionData.hypeos.tasks));
                  localStorage.setItem('hypeos:tasksLastDate', todayStringForGoal);
                }
              } catch (e) {
                console.warn('Failed to save session tasks to localStorage', e);
              }
            } else {
              // Different day - generate new tasks
              console.log('🔄 Different day detected (goal)', { savedTasksLastDateForGoal, todayStringForGoal });
              generateInitialTasks(firstGoal);
              // Save the date tasks were generated
              updateHypeOSData({
                tasksLastDate: todayStringForGoal
              });
            }
          } else {
            // No session tasks - check localStorage before generating
            if (savedTasksFromStorage && savedDateFromStorage === todayStringForGoal) {
              // localStorage has today's tasks - use them
              const parsed = JSON.parse(savedTasksFromStorage);
              setTasks(parsed);
              console.log('✅ Loaded tasks from localStorage (session empty - goal)', {
                completed: parsed.filter((t: any) => t.completed).length,
                total: parsed.length
              });
            } else {
              // No saved tasks anywhere - generate fresh tasks
              console.log('🔄 No saved tasks found (goal) - generating fresh randomized tasks');
              generateInitialTasks(firstGoal);
              // Save the date tasks were generated
              updateHypeOSData({
                tasksLastDate: todayStringForGoal
              });
            }
          }
          
          lastTaskDateRef.current = todayStringForGoal;
          
          // Load miniWins and quests if they exist
          if (sessionData?.hypeos?.miniWins && sessionData.hypeos.miniWins.length > 0) {
            setMiniWins(sessionData.hypeos.miniWins);
          }
          if (sessionData?.hypeos?.quests && sessionData.hypeos.quests.length > 0) {
            setQuests(sessionData.hypeos.quests);
          }
        } else {
          // No goals found - show onboarding
          console.log('No session user or goals, showing onboarding');
          setShowOnboarding(true);
          setIsLoading(false);
          hasLoadedFromSession.current = true; // Mark as loaded even if no data
        }
      } catch (error) {
        console.error('Error in checkUserStatus:', error);
        // Only show onboarding if no goals exist
        if (allGoals.length === 0 && !sessionData?.hypeos?.user) {
          setShowOnboarding(true);
        }
        setIsLoading(false);
        hasLoadedFromSession.current = true; // Mark as loaded even on error
      } finally {
        setIsLoading(false);
        // Ensure we mark as loaded in finally block to prevent infinite loading
        if (!hasLoadedFromSession.current) {
          hasLoadedFromSession.current = true;
        }
      }
    };

    // Run immediately
    checkUserStatus();
    
    // Fallback timeout to ensure loading state is ALWAYS cleared (reduced to 1 second)
    const timeoutId = setTimeout(() => {
      console.log('Loading timeout reached (1s), forcing isLoading to false');
      setIsLoading(false);
      // Only show onboarding if truly no user or goals exist
      const goalsList = (sessionData?.hypeos as any)?.allGoals || [];
      const hasUser = sessionData?.hypeos?.user;
      const hasGoals = goalsList.length > 0;
      
      if (!hasUser && !user && !hasGoals && allGoals.length === 0) {
        console.log('No user or goals found after timeout, setting showOnboarding to true');
        setShowOnboarding(true);
      } else if (hasGoals && !user) {
        // If we have goals but user state wasn't set, load from goals
        console.log('Found goals but user not set, loading from goals');
        const firstGoal = {
          ...goalsList[0],
          hasCompletedOnboarding: true,
          currentStreak: goalsList[0].currentStreak ?? 0,
          longestStreak: goalsList[0].longestStreak ?? 0
        };
        setUser(firstGoal);
        setAllGoals(goalsList);
        hasLoadedFromSession.current = true;
        setShowOnboarding(false); // Make sure onboarding is hidden
      } else if (user) {
        // If user is loaded, make sure onboarding is hidden
        setShowOnboarding(false);
      }
    }, 1000); // Reduced from 3000ms to 1000ms for faster fallback

    return () => clearTimeout(timeoutId);
    // Only run when session data first loads or when key properties change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sessionData?.hypeos?.user?.goalTitle, 
    sessionData?.hypeos?.user?.hasCompletedOnboarding,
    (sessionData?.hypeos as any)?.allGoals?.length,
    sessionData?.hypeos?.tasksLastDate
  ]);

  // Save user data to session whenever it changes (only if session context exists)
  useEffect(() => {
    if (!user || !sessionContext || isLoading || !hasLoadedFromSession.current || isSavingRef.current) {
      return;
    }
    
    isSavingRef.current = true;
    // Use a small delay to batch updates and prevent rapid re-renders
    const timeoutId = setTimeout(() => {
      const today = new Date().toDateString();
      updateHypeOSData({
        user,
        allGoals: allGoals.length > 0 ? allGoals : (user ? [user] : []),
        tasks,
        miniWins,
        quests,
        tasksLastDate: today // Save the date with tasks
      });
      isSavingRef.current = false;
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      isSavingRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, tasks, miniWins, quests, allGoals, isLoading]);
  
  // Daily task reset check - runs when component mounts or date changes
  useEffect(() => {
    if (!user || isLoading) return; // Don't run during initial load
    
    const today = new Date().toDateString();
    const tasksLastDate = sessionData?.hypeos?.tasksLastDate || lastTaskDateRef.current;
    
    // Only reset tasks if it's actually a new day AND we have existing tasks
    // IMPORTANT: Don't reset if tasks array is empty or if we're in the middle of completing tasks
    // Also check that we actually have saved tasks to avoid clearing completed ones
    const hasSavedTasks = sessionData?.hypeos?.tasks && sessionData.hypeos.tasks.length > 0;
    
    if (tasksLastDate && tasksLastDate !== today && (tasks.length > 0 || hasSavedTasks)) {
      console.log('🔄 New day detected! Resetting tasks...', { 
        tasksLastDate, 
        today, 
        currentTasksCount: tasks.length,
        hasSavedTasks 
      });
      generateInitialTasks(user);
      lastTaskDateRef.current = today;
      // Don't clear tasks immediately - let generateInitialTasks set them
      // This prevents tasks from disappearing before new ones are generated
      updateHypeOSData({
        tasksLastDate: today
        // tasks and miniWins will be set by generateInitialTasks
      });
    } else if (!tasksLastDate) {
      // First time - set the date
      lastTaskDateRef.current = today;
      updateHypeOSData({
        tasksLastDate: today
      });
    } else if (tasksLastDate === today && tasks.length === 0) {
      // Same day but tasks are missing - try to reload from localStorage FIRST (priority)
      const savedTasksFromStorage = typeof window !== 'undefined' ? localStorage.getItem('hypeos:tasks') : null;
      const savedDateFromStorage = typeof window !== 'undefined' ? localStorage.getItem('hypeos:tasksLastDate') : null;
      
      if (savedTasksFromStorage && savedDateFromStorage === today) {
        // localStorage has today's tasks - use them (PRIORITY)
        const parsed = JSON.parse(savedTasksFromStorage);
        console.log('⚠️ Tasks missing - reloading from localStorage (PRIORITY)', {
          savedTasksCount: parsed.length,
          completedCount: parsed.filter((t: any) => t.completed).length
        });
        setTasks(parsed);
      } else if (hasSavedTasks) {
        // Fallback to session if localStorage doesn't have today's data
        console.log('⚠️ Tasks missing - reloading from session (localStorage empty)', {
          savedTasksCount: sessionData.hypeos.tasks.length,
          completedCount: sessionData.hypeos.tasks.filter((t: any) => t.completed).length
        });
        setTasks(sessionData.hypeos.tasks);
        // Save to localStorage for future priority
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('hypeos:tasks', JSON.stringify(sessionData.hypeos.tasks));
            localStorage.setItem('hypeos:tasksLastDate', today);
          }
        } catch (e) {
          console.warn('Failed to save session tasks to localStorage', e);
        }
      }
    } else if (tasksLastDate === today && tasks.length > 0) {
      // Same day and we have tasks - ensure they're saved to localStorage (PRIORITY)
      // This prevents tasks from being lost
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:tasks', JSON.stringify(tasks));
          localStorage.setItem('hypeos:tasksLastDate', today);
          console.log('💾 Ensured tasks are saved to localStorage:', {
            tasksCount: tasks.length,
            completedCount: tasks.filter(t => t.completed).length
          });
        }
      } catch (e) {
        console.warn('Failed to save tasks to localStorage', e);
      }
      
      // Also save to session for compatibility
      const currentSavedTasks = sessionData?.hypeos?.tasks || [];
      if (currentSavedTasks.length === 0 && tasks.length > 0) {
        console.log('💾 Tasks exist but not in session - saving to session');
        updateHypeOSData({
          tasks: tasks,
          tasksLastDate: today
        });
      } else if (currentSavedTasks.length > 0 && tasks.length > 0) {
        // Check if current tasks have more completed tasks than saved
        const savedCompleted = currentSavedTasks.filter((t: any) => t.completed).length;
        const currentCompleted = tasks.filter(t => t.completed).length;
        if (currentCompleted > savedCompleted) {
          // More tasks completed - save the updated state
          console.log('💾 More tasks completed - saving updated state to session', {
            savedCompleted,
            currentCompleted,
            tasksCount: tasks.length
          });
          updateHypeOSData({
            tasks: tasks,
            tasksLastDate: today
          });
        }
      }
    }
  }, [user, sessionData?.hypeos?.tasksLastDate, isLoading]);

  // Load view mode preference
  useEffect(() => {
    const savedViewMode = localStorage.getItem('hypeos-view-mode');
    if (savedViewMode === 'quests' || savedViewMode === 'default' || savedViewMode === 'goals') {
      setViewMode(savedViewMode as 'default' | 'quests' | 'goals');
    }
  }, []);

  // Save view mode preference
  const handleViewModeChange = (mode: 'default' | 'quests' | 'goals') => {
    setViewMode(mode);
    localStorage.setItem('hypeos-view-mode', mode);
  };

  // Switch to a different goal
  const switchToGoal = (goal: User) => {
    const goalId = goal.goalTitle + '-' + goal.category;
    setUser(goal);
    setCurrentGoalId(goalId);
    
    // Try to load tasks for this specific goal from session
    // For now, we'll use the same tasks structure but could be enhanced to store per-goal
    // Only generate tasks if we don't have any saved tasks
    if (!sessionData?.hypeos?.tasks || sessionData.hypeos.tasks.length === 0) {
      generateInitialTasks(goal);
    } else {
      // Use existing tasks (or could filter by goal in future)
      setTasks(sessionData.hypeos.tasks);
    }
    
    // Save current goal selection
    updateHypeOSData({
      user: goal,
      allGoals: allGoals
    });
  };

  // Check for daily goal completion and show celebration (only once per day)
  useEffect(() => {
    if (!dailyGoal || !user || isLoading) return;

    const userId = sessionData?.email || user?.name || 'default-user';
    const history = loadUserHistory(userId);
    const todayXP = history.lastWeekXP.length > 0 
      ? history.lastWeekXP[history.lastWeekXP.length - 1] 
      : 0;
    
    const progress = calculateGoalProgress(
      todayXP,
      tasks.filter(t => t.completed).length,
      dailyGoal
    );
    
    // Only show celebration if goal is complete, has XP, and hasn't been shown today
    const today = new Date().toDateString();
    const celebrationKey = `hypeos-goal-complete-${today}-${userId}`;
    
    // Check localStorage to see if we've already shown the celebration today
    const hasShownToday = typeof window !== 'undefined' 
      ? localStorage.getItem(celebrationKey) === 'true'
      : false;
    
    // Also check the ref (for same session)
    const refKey = `goal-complete-${today}`;
    const hasShownInRef = goalCelebrationShownRef.current === refKey;
    
    if (progress.isComplete && todayXP > 0 && !hasShownToday && !hasShownInRef) {
      // Mark as shown in both ref and localStorage
      goalCelebrationShownRef.current = refKey;
      if (typeof window !== 'undefined') {
        localStorage.setItem(celebrationKey, 'true');
      }
      
      // Small delay to ensure smooth UI
      const timeoutId = setTimeout(() => {
        setCelebration({
          type: 'goal-complete',
          message: `You've earned ${todayXP} XP and completed ${progress.currentTasks} tasks!`
        });
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  }, [dailyGoal, tasks, user, sessionData?.email, isLoading]);

  const completeTask = (taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !user) return;
    
    // Get userId from session email or fallback to user name
    const userId = sessionData?.email || user.name || 'default-user';
    
    // Load performance profile
    const performanceProfile = getUserPerformanceProfile(userId);
    
    // Get streak data - preserve existing dates if available
    const userLastActiveDate = user.lastActiveDate ? new Date(user.lastActiveDate) : new Date();
    const userStreakStartDate = user.streakStartDate ? new Date(user.streakStartDate) : new Date();
    
    const streakData: StreakData = {
      currentStreak: user.currentStreak ?? 0,
      longestStreak: user.longestStreak ?? 0,
      lastActiveDate: userLastActiveDate,
      streakStartDate: userStreakStartDate,
      totalDaysActive: user.currentStreak ?? 0
    };
    
    // Convert task to unified format
    const unifiedTask: UnifiedTask = {
      id: task.id,
      title: task.title,
      category: task.category || 'general',
      impact: task.impact,
      basePoints: task.points,
      skill: task.category ? `${task.category}-${task.id}` : undefined
    };
    
    // Complete task with unified difficulty system
    // Estimate time spent (could be improved with actual tracking)
    const estimatedTimeSpent = 15; // minutes - default estimate
    const completionResult = completeTaskWithDifficulty(
      unifiedTask,
      userId,
      performanceProfile,
      streakData,
      true, // completed
      estimatedTimeSpent,
      undefined // quality - could be added later with user input
    );
    
    // Update task completion
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: true } : t
    );
    setTasks(updatedTasks);
    
    // Immediately save to localStorage (like Bizora does)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hypeos:tasks', JSON.stringify(updatedTasks));
        console.log('💾 Immediately saved completed task to localStorage');
      }
    } catch (e) {
      console.warn('Failed to immediately save task to localStorage', e);
    }
    
    // Update user with calculated points
    const updatedUser = {
      ...user,
      hypePoints: user.hypePoints + completionResult.pointsEarned
    };
    setUser(updatedUser);
    
    // Immediately save user to localStorage (like Bizora does)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hypeos:user', JSON.stringify(updatedUser));
        console.log('💾 Immediately saved user points to localStorage:', updatedUser.hypePoints);
      }
    } catch (e) {
      console.warn('Failed to immediately save user to localStorage', e);
    }
    
    // Check if this is the first task completed today and user has 0 streak
    // If so, start the streak at 1
    let finalUser = updatedUser;
    if (user.currentStreak === 0 && updatedTasks.some(t => t.completed)) {
      // First task completed today with 0 streak - start streak at 1
      finalUser = {
        ...updatedUser,
        currentStreak: 1,
        longestStreak: Math.max(1, user.longestStreak || 0),
        goalProgress: Math.min(100, Math.round((updatedTasks.filter(t => t.completed).length / updatedTasks.length) * 100))
      };
      setUser(finalUser);
      console.log('🔥 Starting streak at 1 day! Progress:', finalUser.goalProgress + '%');
      
      // Immediately save user to localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:user', JSON.stringify(finalUser));
          console.log('💾 Immediately saved user (streak started) to localStorage');
        }
      } catch (e) {
        console.warn('Failed to immediately save user to localStorage', e);
      }
    } else {
      // Update progress for existing streak
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const totalCount = updatedTasks.length;
      const newProgress = Math.min(100, Math.round((completedCount / totalCount) * 100));
      finalUser = {
        ...updatedUser,
        goalProgress: newProgress
      };
      setUser(finalUser);
      
      // Immediately save user to localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:user', JSON.stringify(finalUser));
          console.log('💾 Immediately saved user (progress updated) to localStorage');
        }
      } catch (e) {
        console.warn('Failed to immediately save user to localStorage', e);
      }
    }
    
    // Immediately save tasks and updated user to session and localStorage
    // Save streak data including lastActiveDate
    const todayDate = new Date().toDateString();
    const todayISO = new Date().toISOString();
    const saveTasksImmediately = () => {
      try {
        // Ensure lastActiveDate and streakStartDate are saved with user data
        // Use current user's streak dates if available, otherwise use today
        const userToSave = {
          ...finalUser,
          lastActiveDate: finalUser.lastActiveDate || user.lastActiveDate || todayISO,
          streakStartDate: finalUser.streakStartDate || user.streakStartDate || todayISO,
          // Ensure streak values are preserved
          currentStreak: finalUser.currentStreak ?? user.currentStreak ?? 0,
          longestStreak: finalUser.longestStreak ?? user.longestStreak ?? 0
        };
        
        // IMPORTANT: Always save tasks with their completed state
        // Never clear tasks when saving - always preserve them
        updateHypeOSData({
          user: userToSave,
          allGoals: allGoals.length > 0 ? allGoals.map((g: any) => 
            g.goalTitle === userToSave.goalTitle ? userToSave : g
          ) : [userToSave],
          tasks: updatedTasks, // Always save the updated tasks with completed state
          miniWins,
          quests,
          tasksLastDate: todayDate // Save the date tasks were last updated
        });
        
        // Also save tasksLastDate directly to localStorage (like Bizora)
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('hypeos:tasksLastDate', todayDate);
          }
        } catch (e) {
          console.warn('Failed to save tasksLastDate to localStorage', e);
        }
        
        console.log('💾 Saving tasks after completion:', {
          totalTasks: updatedTasks.length,
          completedTasks: updatedTasks.filter(t => t.completed).length,
          date: todayDate
        });
        
        // Also save directly to localStorage for immediate persistence
        const currentSession = sessionData || {};
        const updatedSession = {
          ...currentSession,
          hypeos: {
            ...(currentSession as any)?.hypeos || {},
            user: userToSave,
            allGoals: allGoals.length > 0 ? allGoals.map((g: any) => 
              g.goalTitle === userToSave.goalTitle ? userToSave : g
            ) : [userToSave],
            tasks: updatedTasks,
            miniWins: miniWins,
            quests: quests,
            tasksLastDate: todayDate
          }
        };
        localStorage.setItem('dreamscale_session', JSON.stringify(updatedSession));
        console.log('✅ Tasks and user progress saved immediately to localStorage, streak:', userToSave.currentStreak);
      } catch (error) {
        console.error('Error saving tasks:', error);
      }
    };
    
    // Save immediately with updated user data
    saveTasksImmediately();
    
    // Phase 3: Update user history for daily goals
    // We need to track daily XP separately, not cumulative
    const completedTasksCount = updatedTasks.filter(t => t.completed).length;
    
    // Get today's current XP from history and add the new points
    const history = loadUserHistory(userId);
    const todayRecord = history.lastWeekXP.length > 0 
      ? history.lastWeekXP[history.lastWeekXP.length - 1] 
      : 0;
    const newTodayXP = todayRecord + completionResult.pointsEarned;
    
    updateUserHistory(
      userId,
      newTodayXP, // Total XP earned today
      completedTasksCount,
      finalUser.currentStreak
    );
    
    // Phase 4: Update review queue after task completion
    try {
      const performanceProfile = getUserPerformanceProfile(userId);
      const streakData: StreakData = {
        currentStreak: finalUser.currentStreak || 0,
        longestStreak: finalUser.longestStreak || 0,
        lastActiveDate: new Date(),
        streakStartDate: new Date(),
        totalDaysActive: finalUser.currentStreak || 0
      };
      
      const unifiedTasks = updatedTasks.map(task => ({
        id: task.id,
        title: task.title || 'Untitled Task',
        category: task.category || 'general',
        impact: task.impact || 'medium',
        basePoints: task.points || 10,
        skill: task.category ? `${task.category}-${task.id}` : undefined
      }));
      
      const updatedQueue = generateDailyReviewQueue(
        unifiedTasks,
        userId,
        performanceProfile,
        streakData,
        10
      );
      setReviewQueue(updatedQueue);
    } catch (error) {
      console.error('Error updating review queue:', error);
    }
    
    // Update quests
    const progress = calculateQuestProgress(updatedTasks, finalUser.hypePoints, finalUser.currentStreak);
    const updatedQuests = updateQuestProgress(quests, progress);
    
    const rewards = checkQuestCompletions(quests, updatedQuests);
    if (rewards.length > 0) {
      const totalRewardPoints = rewards.reduce((sum, reward) => sum + reward.points, 0);
      finalUser = {
        ...finalUser,
        hypePoints: finalUser.hypePoints + totalRewardPoints
      };
      setUser(finalUser);
    }
    
    setQuests(updatedQuests);
    saveQuestProgress(updatedQuests);
    
    // Check if all tasks completed for streak celebration
    const allTasksCompleted = updatedTasks.every(t => t.completed);
    
    if (allTasksCompleted) {
      // Update streak - if current streak is 0 or 1, maintain or increment it
      let updatedStreakData: StreakData;
      if (finalUser.currentStreak === 0) {
        // First time completing all tasks - start streak at 1
        updatedStreakData = {
          ...streakData,
          currentStreak: 1,
          longestStreak: Math.max(1, user.longestStreak || 0),
          lastActiveDate: new Date(),
          streakStartDate: new Date(),
          totalDaysActive: 1
        };
      } else if (finalUser.currentStreak === 1) {
        // Already at 1 day streak (from completing first task), increment for completing all tasks
        // But actually, if it's the same day, keep it at 1
        // Only increment if it's a new day
        updatedStreakData = updateStreak({
          ...streakData,
          currentStreak: finalUser.currentStreak,
          longestStreak: finalUser.longestStreak
        });
      } else {
        // Update existing streak (2+ days)
        updatedStreakData = updateStreak({
          ...streakData,
          currentStreak: finalUser.currentStreak,
          longestStreak: finalUser.longestStreak
        });
      }
      
      const userWithUpdatedStreak = {
        ...finalUser,
        currentStreak: updatedStreakData.currentStreak,
        longestStreak: updatedStreakData.longestStreak,
        lastActiveDate: updatedStreakData.lastActiveDate.toISOString(),
        streakStartDate: updatedStreakData.streakStartDate.toISOString(),
        goalProgress: 100 // All tasks completed = 100% progress
      };
      
      setUser(userWithUpdatedStreak);
      
      // Immediately save the updated streak
      try {
        const updatedAllGoals = allGoals.length > 0 ? allGoals.map((g: any) => 
          g.goalTitle === userWithUpdatedStreak.goalTitle ? userWithUpdatedStreak : g
        ) : [userWithUpdatedStreak];
        
        updateHypeOSData({
          user: userWithUpdatedStreak,
          allGoals: updatedAllGoals,
          tasks: updatedTasks,
          miniWins,
          quests
        });
        
        // Also save directly to localStorage
        const currentSession = sessionData || {};
        const updatedSession = {
          ...currentSession,
          hypeos: {
            ...(currentSession as any)?.hypeos || {},
            user: userWithUpdatedStreak,
            allGoals: updatedAllGoals,
            tasks: updatedTasks,
            miniWins: miniWins,
            quests: quests
          }
        };
        localStorage.setItem('dreamscale_session', JSON.stringify(updatedSession));
        console.log('✅ Streak updated and saved -', userWithUpdatedStreak.currentStreak, 'day streak!');
      } catch (error) {
        console.error('Error saving streak:', error);
      }
      
      setShowStreakCelebration(true);
      
      // Phase 5: Show streak milestone celebration
      if (updatedStreakData.currentStreak % 7 === 0 || updatedStreakData.currentStreak === 30) {
        setTimeout(() => {
          setCelebration({
            type: 'streak-milestone',
            message: `${updatedStreakData.currentStreak} day streak! Incredible consistency!`
          });
        }, 500);
      }
    }
    
    // Phase 5: Show celebration for task completion
    setCelebration({
      type: 'task-complete',
      message: `+${completionResult.pointsEarned} points earned!`
    });
    
    // Check if skill was mastered
    if (completionResult.difficulty.masteryLevel === 'mastered' && 
        completionResult.updatedReviewItem?.mastered) {
      setTimeout(() => {
        setCelebration({
          type: 'skill-mastered',
          message: `${task.title} - Skill mastered!`
        });
      }, 1500);
    }
    
    // Log the difficulty adjustment for debugging
    console.log('🎯 Task completed with unified difficulty:', {
      task: task.title,
      originalPoints: task.points,
      finalPoints: completionResult.pointsEarned,
      difficulty: completionResult.difficulty.difficultyLevel,
      masteryLevel: completionResult.difficulty.masteryLevel,
      needsReview: completionResult.difficulty.needsReview,
      explanation: completionResult.message
    });
  };

  const completeMiniWin = (miniWinId: number) => {
    const updatedMiniWins = miniWins.map(win => 
      win.id === miniWinId 
        ? { ...win, completed: true }
        : win
    );
    setMiniWins(updatedMiniWins);
    
    // Immediately save to localStorage (like Bizora does)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('hypeos:miniWins', JSON.stringify(updatedMiniWins));
        console.log('💾 Immediately saved completed miniWin to localStorage');
      }
    } catch (e) {
      console.warn('Failed to immediately save miniWin to localStorage', e);
    }
    
    const miniWin = miniWins.find(w => w.id === miniWinId);
    const updatedUser = miniWin && user ? {
      ...user,
      hypePoints: user.hypePoints + miniWin.points
    } : user;
    
    if (updatedUser) {
      setUser(updatedUser);
      
      // Immediately save user to localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('hypeos:user', JSON.stringify(updatedUser));
          console.log('💾 Immediately saved user (miniWin) to localStorage');
        }
      } catch (e) {
        console.warn('Failed to immediately save user to localStorage', e);
      }
    }
    
    // Immediately save miniWins and user to session
    if (sessionContext && updatedUser) {
      try {
        updateHypeOSData({
          user: updatedUser,
          allGoals: allGoals.length > 0 ? allGoals : (updatedUser ? [updatedUser] : []),
          tasks,
          miniWins: updatedMiniWins,
          quests
        });
        
        // Also save directly to localStorage
        const currentSession = sessionData || {};
        const updatedSession = {
          ...currentSession,
          hypeos: {
            ...(currentSession as any)?.hypeos || {},
            user: updatedUser,
            allGoals: allGoals.length > 0 ? allGoals : (updatedUser ? [updatedUser] : []),
            tasks: tasks,
            miniWins: updatedMiniWins,
            quests: quests
          }
        };
        localStorage.setItem('dreamscale_session', JSON.stringify(updatedSession));
        console.log('✅ MiniWins saved immediately to localStorage');
      } catch (error) {
        console.error('Error saving miniWins:', error);
      }
    }
  };

  const handleQuestComplete = (rewardPoints: number) => {
    if (user) {
      setUser(prev => prev ? {
        ...prev,
        hypePoints: prev.hypePoints + rewardPoints
      } : null);
    }
  };

  const handleOnboardingComplete = (userData: User) => {
    const userWithOnboarding = { ...userData, hasCompletedOnboarding: true };
    setUser(userWithOnboarding);
    setShowOnboarding(false);
    
    // Add to goals list
    const goalId = userData.goalTitle + '-' + userData.category;
    const updatedGoals = [...allGoals, userWithOnboarding];
    setAllGoals(updatedGoals);
    setCurrentGoalId(goalId);
    
    // Immediately save to session to persist onboarding completion
    updateHypeOSData({
      user: userWithOnboarding,
      allGoals: updatedGoals,
      tasks: [],
      miniWins: [],
      quests: []
    });
    
    // Force immediate save to localStorage (even if session not fully active)
    try {
      const currentSession = sessionData || {};
      const updatedSession = {
        ...currentSession,
        hypeos: {
          ...(currentSession as any)?.hypeos || {},
          user: userWithOnboarding,
          allGoals: updatedGoals,
          tasks: [],
          miniWins: [],
          quests: []
        }
      };
      localStorage.setItem('dreamscale_session', JSON.stringify(updatedSession));
      console.log('✅ Goal saved immediately to localStorage');
    } catch (error) {
      console.error('Error saving goal:', error);
    }
    
    // Mark as loaded to prevent re-loading
    hasLoadedFromSession.current = true;
    
    generateInitialTasks(userData);
  };

  // Early returns - show loading first, then check onboarding
  // Only show loading if we're actually still loading (not based on complex conditions)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#39d2c0] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading HypeOS...</p>
        </div>
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingWizard onComplete={handleOnboardingComplete} />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to HypeOS! 🚀
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Let's get started by setting up your goals
          </p>
          <Button 
            className="bg-[#39d2c0] hover:bg-[#39d2c0]/90 text-white"
            onClick={() => setShowOnboarding(true)}
          >
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <HorizontalNav />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Ready to level up your business today?
              </p>
            </div>
            
            {/* HYPEPOSES Management & View Mode Toggle */}
            <div className="flex items-center space-x-4">
              {/* Create New Goal Button */}
              <Button 
                className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                onClick={() => setShowOnboarding(true)}
              >
                <Target className="w-4 h-4 mr-2" />
                Create New Goal
              </Button>
              
              {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">View:</span>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => handleViewModeChange('default')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'default'
                      ? 'bg-white dark:bg-gray-700 text-[#39d2c0] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => handleViewModeChange('quests')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'quests'
                      ? 'bg-white dark:bg-gray-700 text-[#39d2c0] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Target className="h-4 w-4" />
                  <span>Quests</span>
                </button>
                <button
                  onClick={() => handleViewModeChange('goals')}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    viewMode === 'goals'
                      ? 'bg-white dark:bg-gray-700 text-[#39d2c0] shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  <span>All Goals</span>
                </button>
              </div>
            </div>
          </div>
          </div>
          
          {/* Current HYPEPOSES Info */}
          {user && (
            <div className="mt-4 p-4 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Current Goal: {user.goalTitle || 'No goal set'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Category: {user.category || 'General'} • Target: {user.goalTarget || 'N/A'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-[#39d2c0] text-white">
                    {tasks.filter(t => t.completed).length}/{tasks.length} Tasks
                  </Badge>
                  <Badge variant="outline">
                    {Math.round((user.goalProgress || 0))}% Complete
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats Row */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white dark:bg-slate-900">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.currentStreak || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Level</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.level || 1}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-[#39d2c0]" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Hype Points</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{(user?.hypePoints || 0).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-slate-900">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Longest Streak</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{user?.longestStreak || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Conditional Content Based on View Mode */}
        {user && viewMode === 'default' ? (
          <>
            {/* Phase 3: Daily Goal Card */}
            {dailyGoal && (
              <div className="mb-8">
                <DailyGoalCard
                  goal={dailyGoal}
                  currentXP={(() => {
                    // Calculate today's XP from history
                    const userId = sessionData?.email || user?.name || 'default-user';
                    const history = loadUserHistory(userId);
                    const todayXP = history.lastWeekXP.length > 0 
                      ? history.lastWeekXP[history.lastWeekXP.length - 1] 
                      : 0;
                    return todayXP;
                  })()}
                  currentTasks={tasks.filter(t => t.completed).length}
                  userId={sessionData?.email || user?.name || 'default-user'}
                  onDifficultyChange={(newDifficulty) => {
                    // Recalculate goal with new difficulty
                    const userId = sessionData?.email || user?.name || 'default-user';
                    const history = loadUserHistory(userId);
                    history.preferredDifficulty = newDifficulty;
                    const newGoal = calculatePersonalizedDailyGoal(history);
                    setDailyGoal(newGoal);
                    saveTodayGoal(userId, newGoal);
                  }}
                />
              </div>
            )}
            
            {/* Hype Meter */}
            <div className="mb-8">
              <HypeMeter
                progress={user?.goalProgress || 0}
                streak={user?.currentStreak || 0}
                level={user?.level || 1}
                points={user?.hypePoints || 0}
                goalTitle={user?.goalTitle || ''}
                goalCurrent={user?.goalCurrent || ''}
                goalTarget={user?.goalTarget || ''}
              />
            </div>

            {/* Phase 4: Review Queue */}
            {reviewQueue && reviewQueue.totalItems > 0 && (
              <div className="mb-8">
                <ReviewQueueCard
                  queue={reviewQueue}
                  onTaskClick={(taskId) => {
                    // Scroll to task or highlight it
                    console.log('Review task clicked:', taskId);
                  }}
                  onStartReview={() => {
                    // Start review session
                    console.log('Starting review session');
                  }}
                />
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Today's Focus */}
              <div className="lg:col-span-2">
                <DailyFocusCard
                  tasks={(() => {
                    // Phase 2: Add skill strength data to tasks
                    if (!user) return tasks;
                    
                    const userId = sessionData?.email || user?.name || 'default-user';
                    const performanceProfile = getUserPerformanceProfile(userId);
                    const streakData: StreakData = {
                      currentStreak: user?.currentStreak || 0,
                      longestStreak: user?.longestStreak || 0,
                      lastActiveDate: new Date(),
                      streakStartDate: new Date(),
                      totalDaysActive: user?.currentStreak || 0
                    };
                    
                    // Convert tasks to unified format and get difficulties
                    const unifiedTasks = tasks.map(task => ({
                      id: task.id,
                      title: task.title,
                      category: task.category || 'general',
                      impact: task.impact,
                      basePoints: task.points,
                      skill: task.category ? `${task.category}-${task.id}` : undefined
                    }));
                    
                    const tasksWithDifficulties = getTasksWithDifficulties(
                      unifiedTasks,
                      userId,
                      performanceProfile,
                      streakData
                    );
                    
                    // Merge skill strength back into original tasks
                    return tasks.map(task => {
                      const difficultyData = tasksWithDifficulties.find(t => t.id === task.id);
                      return {
                        ...task,
                        skillStrength: difficultyData?.difficulty.skillStrength || null
                      };
                    });
                  })()}
                  onTaskComplete={completeTask}
                  onTaskSkip={(taskId) => {
                    console.log('Task skipped:', taskId);
                  }}
                  streak={user?.currentStreak || 0}
                  momentumMultiplier={(user?.currentStreak || 0) >= 3 ? 1.5 : 1.0}
                />
              </div>

              {/* Streak Tracker */}
              <div>
                <StreakTracker
                  currentStreak={user?.currentStreak || 0}
                  longestStreak={user?.longestStreak || 0}
                  totalDaysActive={45}
                  streakGoal={30}
                  onStreakMilestone={(milestone) => {
                    console.log('Streak milestone:', milestone);
                  }}
                />
              </div>
            </div>

            {/* Mini Wins */}
            <div className="mt-8">
              <MiniWins
                miniWins={miniWins}
                onComplete={completeMiniWin}
                streak={user?.currentStreak || 0}
              />
            </div>
          </>
        ) : viewMode === 'goals' && user ? (
          <div className="mt-8">
            <Card className="bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-[#39d2c0]" />
                  <span>All Your HypeOS Goals</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allGoals.length === 0 ? (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      You haven't created any goals yet.
                    </p>
                    <Button 
                      className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
                      onClick={() => setShowOnboarding(true)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Create Your First Goal
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allGoals.map((goal, index) => {
                      const goalId = goal.goalTitle + '-' + goal.category;
                      const isActive = currentGoalId === goalId;
                      
                      return (
                        <Card 
                          key={index}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                            isActive 
                              ? 'border-2 border-[#39d2c0] bg-[#39d2c0]/5' 
                              : 'border border-gray-200 dark:border-gray-700'
                          }`}
                          onClick={() => switchToGoal(goal)}
                        >
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                  {goal.goalTitle || 'Untitled Goal'}
                                </h3>
                                <Badge className="bg-[#39d2c0]/10 text-[#39d2c0] border-[#39d2c0]/20">
                                  {goal.category || 'General'}
                                </Badge>
                              </div>
                              {isActive && (
                                <Badge className="bg-[#39d2c0] text-white">
                                  Active
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Progress:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {Math.round(goal.goalProgress || 0)}%
                                </span>
                              </div>
                              <Progress value={goal.goalProgress || 0} className="h-2" />
                              
                              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-1">
                                  <Zap className="h-4 w-4 text-yellow-500" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {(goal.hypePoints || 0).toLocaleString()} pts
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Flame className="h-4 w-4 text-orange-500" />
                                  <span className="text-gray-600 dark:text-gray-400">
                                    {goal.currentStreak || 0} day streak
                                  </span>
                                </div>
                              </div>
                              
                              {goal.goalTarget && (
                                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Target: {goal.goalTarget}
                                  </p>
                                </div>
                              )}
                            </div>
                            
                            {!isActive && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-4"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  switchToGoal(goal);
                                  setViewMode('default');
                                }}
                              >
                                Switch to This Goal
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
                
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button 
                    className="bg-[#39d2c0] hover:bg-[#39d2c0]/90 w-full"
                    onClick={() => setShowOnboarding(true)}
                  >
                    <Target className="w-4 h-4 mr-2" />
                    Create New Goal
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : user ? (
          <div className="mt-8">
            <DailyQuests
              tasks={tasks}
              userPoints={user?.hypePoints || 0}
              streak={user?.currentStreak || 0}
              quests={quests}
              onQuestComplete={handleQuestComplete}
            />
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Button 
            className="bg-[#39d2c0] hover:bg-[#39d2c0]/90"
            onClick={() => window.location.href = '/hypeos/progress'}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Progress
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/hypeos/squads'}
          >
            <Users className="w-4 h-4 mr-2" />
            Leagues
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/hypeos/rewards'}
          >
            <Gift className="w-4 h-4 mr-2" />
            Rewards Store
          </Button>
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/hypeos/daily'}
          >
            <Calendar className="w-4 h-4 mr-2" />
            More Quests
          </Button>
        </div>
      </div>

      {/* Streak Celebration Modal */}
      <StreakCelebration
        isOpen={showStreakCelebration}
        onClose={() => setShowStreakCelebration(false)}
        currentStreak={user?.currentStreak || 0}
        longestStreak={user?.longestStreak || 0}
        weeklyProgress={weeklyProgress}
      />
      
      {/* Phase 5: Celebration Overlay */}
      {celebration && (
        <Celebration
          type={celebration.type}
          message={celebration.message}
          onClose={() => setCelebration(null)}
          duration={7000}
        />
      )}
    </div>
  );
}
