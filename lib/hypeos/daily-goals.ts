// HypeOS Personalized Daily Goals System
// Adapts daily goals based on user history, consistency, and performance
// Similar to Duolingo's personalized daily goal system

export type GoalDifficulty = 'casual' | 'regular' | 'serious' | 'insane';

export interface DailyGoal {
  targetXP: number;
  targetTasks: number;
  difficulty: GoalDifficulty;
  estimatedTime: number; // minutes
  personalizedReason: string;
  baseXP: number; // Original calculation before adjustments
  multiplier: number; // How much the goal was adjusted
}

export interface UserHistory {
  averageDailyXP: number;
  averageDailyTasks: number;
  consistencyRate: number; // 0-1, how often they complete goals
  streakDays: number;
  lastWeekXP: number[]; // XP earned each day for last 7 days
  lastWeekTasks: number[]; // Tasks completed each day for last 7 days
  preferredDifficulty?: GoalDifficulty;
  totalDaysActive: number;
  bestDayXP: number;
  bestDayTasks: number;
}

export interface GoalProgress {
  currentXP: number;
  currentTasks: number;
  goalXP: number;
  goalTasks: number;
  completionPercentage: number;
  xpRemaining: number;
  tasksRemaining: number;
  isComplete: boolean;
  timeRemaining: number; // minutes estimated
}

/**
 * Calculate personalized daily goal based on user history
 * Similar to Duolingo's adaptive goal system
 */
export function calculatePersonalizedDailyGoal(
  userHistory: UserHistory
): DailyGoal {
  // Base calculation
  const baseXP = userHistory.averageDailyXP || 50;
  const baseTasks = userHistory.averageDailyTasks || 3;
  
  // Adjust based on consistency
  let multiplier = 1.0;
  let difficulty: GoalDifficulty = 'regular';
  let personalizedReason = '';
  
  // Consistency adjustments
  if (userHistory.consistencyRate > 0.8) {
    // High consistency - increase goal by 20%
    multiplier = 1.2;
    personalizedReason = `You've been super consistent! Let's challenge you a bit more.`;
  } else if (userHistory.consistencyRate > 0.6) {
    // Good consistency - increase by 10%
    multiplier = 1.1;
    personalizedReason = `Great consistency! Slightly increasing your goal.`;
  } else if (userHistory.consistencyRate < 0.5) {
    // Low consistency - decrease by 20%
    multiplier = 0.8;
    personalizedReason = `Let's build consistency with an achievable goal.`;
  } else {
    personalizedReason = `Based on your recent activity, this goal fits your pace.`;
  }
  
  // Streak bonus - longer streaks get slightly higher goals
  const streakBonus = Math.min(1.5, 1 + (userHistory.streakDays / 30) * 0.5);
  multiplier *= streakBonus;
  
  // Weekly trend - if improving, increase goal
  const lastWeekAvg = userHistory.lastWeekXP.length > 0
    ? userHistory.lastWeekXP.reduce((a, b) => a + b, 0) / userHistory.lastWeekXP.length
    : baseXP;
  const trendMultiplier = lastWeekAvg > baseXP ? 1.1 : lastWeekAvg < baseXP * 0.7 ? 0.95 : 1.0;
  multiplier *= trendMultiplier;
  
  // Calculate targets
  const targetXP = Math.round(baseXP * multiplier);
  const targetTasks = Math.round(baseTasks * multiplier);
  
  // Determine difficulty level
  if (targetXP < 30) {
    difficulty = 'casual';
  } else if (targetXP >= 30 && targetXP < 100) {
    difficulty = 'regular';
  } else if (targetXP >= 100 && targetXP < 150) {
    difficulty = 'serious';
  } else {
    difficulty = 'insane';
  }
  
  // Override with user preference if set
  if (userHistory.preferredDifficulty) {
    difficulty = userHistory.preferredDifficulty;
    // Adjust targets to match difficulty
    const difficultyMultipliers = {
      casual: 0.6,
      regular: 1.0,
      serious: 1.5,
      insane: 2.0
    };
    const diffMultiplier = difficultyMultipliers[difficulty];
    const adjustedXP = Math.round(targetXP * diffMultiplier);
    const adjustedTasks = Math.round(targetTasks * diffMultiplier);
    
    return {
      targetXP: adjustedXP,
      targetTasks: adjustedTasks,
      difficulty,
      estimatedTime: adjustedTasks * 15, // ~15 min per task
      personalizedReason: `You've set your goal to ${difficulty} mode.`,
      baseXP,
      multiplier: diffMultiplier * multiplier
    };
  }
  
  // Estimated time based on tasks (assume ~15 minutes per task)
  const estimatedTime = targetTasks * 15;
  
  // Enhanced personalized reason
  if (userHistory.streakDays >= 7) {
    personalizedReason = `You're on a ${userHistory.streakDays}-day streak! Let's keep the momentum going.`;
  } else if (userHistory.consistencyRate < 0.5) {
    personalizedReason = `Let's build a consistent habit with an achievable goal.`;
  } else if (lastWeekAvg > baseXP * 1.2) {
    personalizedReason = `You've been improving! This goal matches your recent performance.`;
  }
  
  return {
    targetXP,
    targetTasks,
    difficulty,
    estimatedTime,
    personalizedReason,
    baseXP,
    multiplier
  };
}

/**
 * Calculate goal progress
 */
export function calculateGoalProgress(
  currentXP: number,
  currentTasks: number,
  goal: DailyGoal
): GoalProgress {
  const xpRemaining = Math.max(0, goal.targetXP - currentXP);
  const tasksRemaining = Math.max(0, goal.targetTasks - currentTasks);
  const completionPercentage = Math.min(
    100,
    ((currentXP / goal.targetXP) * 0.5 + (currentTasks / goal.targetTasks) * 0.5) * 100
  );
  const isComplete = currentXP >= goal.targetXP && currentTasks >= goal.targetTasks;
  
  // Estimate time remaining (assuming average task takes 15 min and gives ~50 XP)
  const avgXPPerTask = goal.targetXP / goal.targetTasks;
  const tasksNeededForXP = Math.ceil(xpRemaining / avgXPPerTask);
  const totalTasksNeeded = Math.max(tasksRemaining, tasksNeededForXP);
  const timeRemaining = totalTasksNeeded * 15;
  
  return {
    currentXP,
    currentTasks,
    goalXP: goal.targetXP,
    goalTasks: goal.targetTasks,
    completionPercentage,
    xpRemaining,
    tasksRemaining,
    isComplete,
    timeRemaining
  };
}

/**
 * Get difficulty description and color
 */
export function getDifficultyInfo(difficulty: GoalDifficulty): {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  estimatedMinutes: number;
} {
  switch (difficulty) {
    case 'casual':
      return {
        name: 'Casual',
        description: 'Perfect for busy days. Small, achievable goals.',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
        icon: '☕',
        estimatedMinutes: 10
      };
    case 'regular':
      return {
        name: 'Regular',
        description: 'Balanced goals for consistent progress.',
        color: 'text-green-600',
        bgColor: 'bg-green-100 dark:bg-green-900/20',
        icon: '⭐',
        estimatedMinutes: 20
      };
    case 'serious':
      return {
        name: 'Serious',
        description: 'Ambitious goals for rapid progress.',
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
        icon: '🔥',
        estimatedMinutes: 45
      };
    case 'insane':
      return {
        name: 'Insane',
        description: 'Maximum challenge! For the truly dedicated.',
        color: 'text-red-600',
        bgColor: 'bg-red-100 dark:bg-red-900/20',
        icon: '💪',
        estimatedMinutes: 90
      };
  }
}

/**
 * Load user history from localStorage
 */
export function loadUserHistory(userId: string): UserHistory {
  try {
    const stored = localStorage.getItem(`hypeos-user-history-${userId}`);
    if (stored) {
      const history: UserHistory = JSON.parse(stored);
      return history;
    }
  } catch (error) {
    console.error('Error loading user history:', error);
  }
  
  // Default history for new users
  return {
    averageDailyXP: 50,
    averageDailyTasks: 3,
    consistencyRate: 0.5,
    streakDays: 0,
    lastWeekXP: [],
    lastWeekTasks: [],
    totalDaysActive: 0,
    bestDayXP: 0,
    bestDayTasks: 0
  };
}

/**
 * Save user history to localStorage
 */
export function saveUserHistory(userId: string, history: UserHistory): void {
  try {
    localStorage.setItem(`hypeos-user-history-${userId}`, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving user history:', error);
  }
}

/**
 * Update user history with today's activity
 */
export function updateUserHistory(
  userId: string,
  todayXP: number,
  todayTasks: number,
  streakDays: number
): UserHistory {
  const history = loadUserHistory(userId);
  const now = new Date();
  const today = now.toDateString();
  
  // Get last week's data
  let lastWeekXP = [...history.lastWeekXP];
  let lastWeekTasks = [...history.lastWeekTasks];
  
  // Load daily records from localStorage
  const dailyRecordsKey = `hypeos-daily-records-${userId}`;
  let dailyRecords: Record<string, { xp: number; tasks: number }> = {};
  
  try {
    const stored = localStorage.getItem(dailyRecordsKey);
    if (stored) {
      dailyRecords = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading daily records:', error);
  }
  
  // Update today's record
  dailyRecords[today] = { xp: todayXP, tasks: todayTasks };
  
  // Get last 7 days
  const last7Days: number[] = [];
  const last7DaysTasks: number[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();
    const record = dailyRecords[dateStr];
    if (record) {
      last7Days.push(record.xp);
      last7DaysTasks.push(record.tasks);
    } else {
      last7Days.push(0);
      last7DaysTasks.push(0);
    }
  }
  
  // Save daily records (keep last 30 days only)
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const cleanedRecords: Record<string, { xp: number; tasks: number }> = {};
  Object.entries(dailyRecords).forEach(([dateStr, record]) => {
    const recordDate = new Date(dateStr);
    if (recordDate >= thirtyDaysAgo) {
      cleanedRecords[dateStr] = record;
    }
  });
  
  try {
    localStorage.setItem(dailyRecordsKey, JSON.stringify(cleanedRecords));
  } catch (error) {
    console.error('Error saving daily records:', error);
  }
  
  // Calculate averages
  const totalXP = last7Days.reduce((a, b) => a + b, 0);
  const totalTasks = last7DaysTasks.reduce((a, b) => a + b, 0);
  const averageDailyXP = totalXP / Math.max(1, last7Days.filter(x => x > 0).length || 1);
  const averageDailyTasks = totalTasks / Math.max(1, last7DaysTasks.filter(x => x > 0).length || 1);
  
  // Calculate consistency rate (days with activity / total days)
  const activeDays = last7Days.filter(x => x > 0).length;
  const consistencyRate = activeDays / 7;
  
  // Update best day
  const bestDayXP = Math.max(history.bestDayXP, todayXP);
  const bestDayTasks = Math.max(history.bestDayTasks, todayTasks);
  
  const updatedHistory: UserHistory = {
    averageDailyXP: Math.round(averageDailyXP),
    averageDailyTasks: Math.round(averageDailyTasks * 10) / 10,
    consistencyRate,
    streakDays,
    lastWeekXP: last7Days,
    lastWeekTasks: last7DaysTasks,
    preferredDifficulty: history.preferredDifficulty,
    totalDaysActive: history.totalDaysActive + (todayXP > 0 ? 1 : 0),
    bestDayXP,
    bestDayTasks
  };
  
  saveUserHistory(userId, updatedHistory);
  return updatedHistory;
}

/**
 * Set user's preferred difficulty
 */
export function setPreferredDifficulty(
  userId: string,
  difficulty: GoalDifficulty
): void {
  const history = loadUserHistory(userId);
  history.preferredDifficulty = difficulty;
  saveUserHistory(userId, history);
}

/**
 * Get today's goal from localStorage
 */
export function getTodayGoal(userId: string): DailyGoal | null {
  try {
    const stored = localStorage.getItem(`hypeos-today-goal-${userId}`);
    if (stored) {
      const goal: DailyGoal = JSON.parse(stored);
      const today = new Date().toDateString();
      const goalDate = goal['date' as keyof DailyGoal] as string;
      
      // Check if goal is for today
      if (goalDate === today) {
        return goal;
      }
    }
  } catch (error) {
    console.error('Error loading today goal:', error);
  }
  
  return null;
}

/**
 * Save today's goal to localStorage
 */
export function saveTodayGoal(userId: string, goal: DailyGoal): void {
  try {
    const today = new Date().toDateString();
    const goalWithDate = { ...goal, date: today };
    localStorage.setItem(`hypeos-today-goal-${userId}`, JSON.stringify(goalWithDate));
  } catch (error) {
    console.error('Error saving today goal:', error);
  }
}

/**
 * Initialize or get today's goal
 */
export function getOrCreateTodayGoal(userId: string): DailyGoal {
  // Check if goal already exists for today
  const existingGoal = getTodayGoal(userId);
  if (existingGoal) {
    return existingGoal;
  }
  
  // Create new goal based on history
  const history = loadUserHistory(userId);
  const goal = calculatePersonalizedDailyGoal(history);
  
  // Save it
  saveTodayGoal(userId, goal);
  
  return goal;
}

