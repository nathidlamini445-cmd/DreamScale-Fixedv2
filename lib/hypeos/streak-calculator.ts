// HypeOS Streak Calculator
// Handles streak tracking, maintenance, and bonus calculations

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  streakStartDate: Date;
  totalDaysActive: number;
}

export interface StreakMilestone {
  days: number;
  name: string;
  description: string;
  multiplier: number;
  reward?: string;
}

export interface StreakStatus {
  isActive: boolean;
  daysUntilReset: number;
  canMaintain: boolean;
  nextMilestone?: StreakMilestone;
}

// Streak milestones and their rewards
export const STREAK_MILESTONES: StreakMilestone[] = [
  {
    days: 3,
    name: "Getting Started",
    description: "First 3 days completed!",
    multiplier: 1.5,
    reward: "1.5x Points Multiplier"
  },
  {
    days: 7,
    name: "Week Warrior",
    description: "One full week of consistency!",
    multiplier: 2.0,
    reward: "2x Points Multiplier + Bronze Rewards"
  },
  {
    days: 14,
    name: "Two Week Champion",
    description: "Two weeks of dedication!",
    multiplier: 2.5,
    reward: "2.5x Points Multiplier"
  },
  {
    days: 21,
    name: "Habit Master",
    description: "Three weeks - habit formed!",
    multiplier: 3.0,
    reward: "3x Points Multiplier + Silver Rewards"
  },
  {
    days: 30,
    name: "Monthly Legend",
    description: "One month of consistency!",
    multiplier: 3.5,
    reward: "3.5x Points Multiplier"
  },
  {
    days: 50,
    name: "Consistency King",
    description: "50 days of unstoppable progress!",
    multiplier: 4.0,
    reward: "4x Points Multiplier + Gold Rewards"
  },
  {
    days: 100,
    name: "Century Streak",
    description: "100 days - you're legendary!",
    multiplier: 5.0,
    reward: "5x Points Multiplier + Platinum Rewards"
  }
];

export function calculateStreakStatus(
  streakData: StreakData,
  today: Date = new Date()
): StreakStatus {
  const lastActive = new Date(streakData.lastActiveDate);
  const daysSinceLastActive = Math.floor(
    (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Streak is active if last activity was yesterday or today
  const isActive = daysSinceLastActive <= 1;
  
  // Days until streak resets (if no activity today)
  const daysUntilReset = isActive ? 0 : 1;
  
  // Can maintain streak if last activity was yesterday
  const canMaintain = daysSinceLastActive === 1;

  // Find next milestone
  const nextMilestone = STREAK_MILESTONES.find(
    milestone => milestone.days > streakData.currentStreak
  );

  return {
    isActive,
    daysUntilReset,
    canMaintain,
    nextMilestone
  };
}

export function updateStreak(
  streakData: StreakData,
  activityDate: Date = new Date()
): StreakData {
  const lastActive = new Date(streakData.lastActiveDate);
  
  // Normalize dates to midnight for accurate day comparison
  const lastActiveMidnight = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
  const activityMidnight = new Date(activityDate.getFullYear(), activityDate.getMonth(), activityDate.getDate());
  
  // Calculate days difference using normalized dates
  const daysSinceLastActive = Math.floor(
    (activityMidnight.getTime() - lastActiveMidnight.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newStreakData = { ...streakData };

  if (daysSinceLastActive === 0) {
    // Same day - no change to streak, but update lastActiveDate to current time
    newStreakData.lastActiveDate = activityDate;
    return newStreakData;
  } else if (daysSinceLastActive === 1) {
    // Consecutive day - increment streak
    newStreakData.currentStreak += 1;
    newStreakData.longestStreak = Math.max(
      newStreakData.longestStreak,
      newStreakData.currentStreak
    );
    newStreakData.lastActiveDate = activityDate;
    newStreakData.totalDaysActive += 1;
  } else if (daysSinceLastActive > 1) {
    // Streak broken - reset to 1 (but only if more than 1 day has passed)
    newStreakData.currentStreak = 1;
    newStreakData.streakStartDate = activityDate;
    newStreakData.lastActiveDate = activityDate;
    newStreakData.totalDaysActive += 1;
  } else {
    // Negative days (shouldn't happen, but preserve streak if it does)
    // This handles edge cases where dates might be slightly off
    newStreakData.lastActiveDate = activityDate;
  }

  return newStreakData;
}

export function getStreakMultiplier(streak: number): number {
  // Find the highest applicable milestone
  const applicableMilestones = STREAK_MILESTONES.filter(
    milestone => streak >= milestone.days
  );

  if (applicableMilestones.length === 0) {
    return 1.0;
  }

  // Return the highest multiplier
  return Math.max(...applicableMilestones.map(m => m.multiplier));
}

export function getStreakLevel(streak: number): {
  level: string;
  color: string;
  icon: string;
} {
  if (streak >= 100) {
    return { level: "Legendary", color: "text-purple-600", icon: "👑" };
  } else if (streak >= 50) {
    return { level: "Epic", color: "text-red-600", icon: "🏆" };
  } else if (streak >= 30) {
    return { level: "Master", color: "text-orange-600", icon: "⭐" };
  } else if (streak >= 21) {
    return { level: "Expert", color: "text-yellow-600", icon: "⚡" };
  } else if (streak >= 14) {
    return { level: "Advanced", color: "text-green-600", icon: "🔥" };
  } else if (streak >= 7) {
    return { level: "Intermediate", color: "text-blue-600", icon: "💪" };
  } else if (streak >= 3) {
    return { level: "Beginner", color: "text-gray-600", icon: "🌱" };
  } else {
    return { level: "Starting", color: "text-gray-500", icon: "🚀" };
  }
}

export function getStreakMotivation(streak: number): string {
  const motivations = [
    "Every day counts! Keep building that momentum! 🚀",
    "You're building something amazing! 💪",
    "Consistency is your superpower! ⚡",
    "Each day makes you stronger! 🔥",
    "You're creating unstoppable habits! 🌟",
    "Progress compounds every single day! 📈",
    "You're becoming the person you want to be! 🎯"
  ];

  // Cycle through motivations based on streak
  const index = streak % motivations.length;
  return motivations[index];
}

export function calculateStreakBonus(
  basePoints: number,
  streak: number
): { multiplier: number; bonusPoints: number } {
  const multiplier = getStreakMultiplier(streak);
  const bonusPoints = Math.round(basePoints * (multiplier - 1));
  
  return { multiplier, bonusPoints };
}

export function getStreakCalendar(
  streakData: StreakData,
  days: number = 30
): Array<{ date: Date; active: boolean; streakDay: number }> {
  const calendar = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Check if this date was active (simplified logic)
    const isActive = Math.random() > 0.3; // Mock data - replace with real logic
    
    calendar.push({
      date,
      active: isActive,
      streakDay: isActive ? Math.max(1, streakData.currentStreak - i) : 0
    });
  }
  
  return calendar;
}

export function getStreakInsights(streakData: StreakData): {
  averageStreakLength: number;
  streakFrequency: number;
  bestStreakPeriod: string;
  recommendations: string[];
} {
  // Mock insights - replace with real calculations
  const insights = {
    averageStreakLength: Math.round(streakData.longestStreak * 0.6),
    streakFrequency: Math.round((streakData.totalDaysActive / 365) * 100),
    bestStreakPeriod: "Monday mornings",
    recommendations: [
      "Set a consistent daily reminder",
      "Complete at least one task before 10 AM",
      "Join an accountability squad",
      "Celebrate small wins daily"
    ]
  };

  return insights;
}

export function predictStreakOutcome(
  currentStreak: number,
  consistencyRate: number
): {
  predicted30Days: number;
  predicted90Days: number;
  confidence: number;
} {
  // Simple prediction model
  const dailyConsistency = consistencyRate / 100;
  const predicted30Days = Math.round(currentStreak + (30 * dailyConsistency));
  const predicted90Days = Math.round(currentStreak + (90 * dailyConsistency));
  
  // Confidence based on consistency rate
  const confidence = Math.min(95, Math.max(60, consistencyRate));

  return {
    predicted30Days,
    predicted90Days,
    confidence
  };
}
