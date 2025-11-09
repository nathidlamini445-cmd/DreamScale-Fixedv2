// HypeOS Points System
// Calculates points based on task completion, streaks, and multipliers

export interface Task {
  id: number;
  title: string;
  impact: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
  completedAt?: Date;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
}

export interface PointsCalculation {
  basePoints: number;
  streakMultiplier: number;
  impactMultiplier: number;
  totalPoints: number;
  bonusPoints: number;
}

// Base points by impact level
const IMPACT_POINTS = {
  high: 500,
  medium: 200,
  low: 100
};

// Streak multipliers
const STREAK_MULTIPLIERS = {
  3: 1.5,    // 3 days = 1.5x
  7: 2.0,    // 7 days = 2x
  14: 2.5,   // 14 days = 2.5x
  21: 3.0,   // 21 days = 3x
  30: 3.5,   // 30 days = 3.5x
  50: 4.0,   // 50 days = 4x
  100: 5.0   // 100 days = 5x
};

// Impact multipliers for different categories
const CATEGORY_MULTIPLIERS = {
  'sales': 1.5,      // Revenue-generating activities
  'marketing': 1.3,  // Growth activities
  'content': 1.2,    // Content creation
  'admin': 1.0,      // Administrative tasks
  'learning': 1.1,   // Skill development
  'networking': 1.4  // Relationship building
};

export function calculateTaskPoints(
  task: Task, 
  streakData: StreakData,
  isMiniWin: boolean = false
): PointsCalculation {
  // Base points
  let basePoints = IMPACT_POINTS[task.impact];
  
  // Mini wins get reduced points
  if (isMiniWin) {
    basePoints = Math.round(basePoints * 0.2);
  }

  // Category multiplier
  const categoryMultiplier = CATEGORY_MULTIPLIERS[task.category as keyof typeof CATEGORY_MULTIPLIERS] || 1.0;

  // Streak multiplier
  const streakMultiplier = getStreakMultiplier(streakData.currentStreak);

  // Calculate total points
  const impactMultiplier = categoryMultiplier;
  const totalPoints = Math.round(basePoints * impactMultiplier * streakMultiplier);
  const bonusPoints = Math.round(totalPoints - (basePoints * impactMultiplier));

  return {
    basePoints,
    streakMultiplier,
    impactMultiplier,
    totalPoints,
    bonusPoints
  };
}

export function getStreakMultiplier(streak: number): number {
  // Find the highest applicable multiplier
  const applicableMultipliers = Object.entries(STREAK_MULTIPLIERS)
    .filter(([days]) => streak >= parseInt(days))
    .map(([, multiplier]) => multiplier);

  return applicableMultipliers.length > 0 
    ? Math.max(...applicableMultipliers) 
    : 1.0;
}

export function calculateDailyPoints(tasks: Task[], streakData: StreakData): number {
  return tasks.reduce((total, task) => {
    if (task.completed) {
      const calculation = calculateTaskPoints(task, streakData);
      return total + calculation.totalPoints;
    }
    return total;
  }, 0);
}

export function calculateWeeklyPoints(
  weeklyTasks: Task[][], 
  streakData: StreakData
): { total: number; daily: number[] } {
  const dailyPoints = weeklyTasks.map(dayTasks => 
    calculateDailyPoints(dayTasks, streakData)
  );
  
  const total = dailyPoints.reduce((sum, points) => sum + points, 0);
  
  return { total, daily: dailyPoints };
}

export function getPointsToNextReward(
  currentPoints: number, 
  rewardTiers: number[]
): { nextReward: number; pointsNeeded: number } {
  const nextReward = rewardTiers.find(tier => tier > currentPoints);
  
  if (!nextReward) {
    return { nextReward: 0, pointsNeeded: 0 };
  }
  
  return {
    nextReward,
    pointsNeeded: nextReward - currentPoints
  };
}

export function getPointsBreakdown(
  tasks: Task[], 
  streakData: StreakData
): {
  byImpact: Record<string, number>;
  byCategory: Record<string, number>;
  streakBonus: number;
  total: number;
} {
  const breakdown = {
    byImpact: { high: 0, medium: 0, low: 0 },
    byCategory: {} as Record<string, number>,
    streakBonus: 0,
    total: 0
  };

  tasks.forEach(task => {
    if (task.completed) {
      const calculation = calculateTaskPoints(task, streakData);
      
      // Impact breakdown
      breakdown.byImpact[task.impact] += calculation.totalPoints;
      
      // Category breakdown
      if (!breakdown.byCategory[task.category]) {
        breakdown.byCategory[task.category] = 0;
      }
      breakdown.byCategory[task.category] += calculation.totalPoints;
      
      // Streak bonus
      breakdown.streakBonus += calculation.bonusPoints;
      
      // Total
      breakdown.total += calculation.totalPoints;
    }
  });

  return breakdown;
}

export function getLevelFromPoints(points: number): {
  level: number;
  pointsToNext: number;
  progressPercentage: number;
} {
  // Level progression: each level requires exponentially more points
  const levelThresholds = [
    0,      // Level 1
    1000,   // Level 2
    2500,   // Level 3
    5000,   // Level 4
    8500,   // Level 5
    13000,  // Level 6
    18500,  // Level 7
    25000,  // Level 8
    32500,  // Level 9
    41000,  // Level 10
    50000,  // Level 11+
  ];

  let currentLevel = 1;
  for (let i = 0; i < levelThresholds.length - 1; i++) {
    if (points >= levelThresholds[i] && points < levelThresholds[i + 1]) {
      currentLevel = i + 1;
      break;
    }
    if (points >= levelThresholds[levelThresholds.length - 1]) {
      currentLevel = levelThresholds.length;
      break;
    }
  }

  const currentLevelPoints = levelThresholds[currentLevel - 1] || 0;
  const nextLevelPoints = levelThresholds[currentLevel] || levelThresholds[levelThresholds.length - 1];
  const pointsToNext = nextLevelPoints - points;
  const progressPercentage = ((points - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;

  return {
    level: currentLevel,
    pointsToNext: Math.max(0, pointsToNext),
    progressPercentage: Math.min(100, Math.max(0, progressPercentage))
  };
}

export function getAchievementPoints(achievementType: string): number {
  const achievementPoints = {
    'first_task': 50,
    'first_week': 200,
    'first_month': 1000,
    'streak_7': 500,
    'streak_30': 2000,
    'streak_100': 10000,
    'level_5': 1000,
    'level_10': 5000,
    'goal_complete': 5000,
    'invite_friend': 500,
    'help_others': 200,
    'perfect_week': 1000,
    'perfect_month': 5000
  };

  return achievementPoints[achievementType as keyof typeof achievementPoints] || 0;
}
