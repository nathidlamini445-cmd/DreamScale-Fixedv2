// HypeOS Adaptive Difficulty System
// Adjusts task difficulty/points based on user performance patterns
// Integrated with spaced repetition for Duolingo-style adaptive learning

import { StreakData } from './streak-calculator';
import { ReviewItem } from './spaced-repetition';

export interface PerformanceMetrics {
  taskId: string;
  category: string;
  attempts: number;
  completions: number;
  averageTime: number; // in minutes
  lastAttempt: Date;
  consecutiveFails: number;
  consecutiveSuccesses: number;
  difficultyHistory: number[]; // Track difficulty over time
}

export interface UserPerformanceProfile {
  userId: string;
  overallSuccessRate: number;
  categoryPerformance: Record<string, PerformanceMetrics>;
  weeklyTrend: number; // -1 to 1, -1 = declining, 1 = improving
  consistencyScore: number; // 0 to 1
  lastUpdated: Date;
  totalTasksAttempted: number;
  totalTasksCompleted: number;
}

// Calculate overall performance score
export function calculatePerformanceScore(
  profile: UserPerformanceProfile,
  streakData: StreakData
): number {
  const successRate = profile.overallSuccessRate;
  const consistency = streakData.currentStreak / Math.max(streakData.longestStreak, 1);
  const trend = profile.weeklyTrend;
  
  // Normalize trend to 0-1 range (from -1 to 1)
  const normalizedTrend = (trend + 1) / 2;
  
  return (successRate * consistency * normalizedTrend);
}

// Determine next difficulty level
export function calculateAdaptiveDifficulty(
  currentPoints: number,
  performanceScore: number,
  category: string,
  categoryMetrics: PerformanceMetrics
): {
  adjustedPoints: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  explanation: string;
} {
  let multiplier = 1.0;
  let difficulty: 'easy' | 'medium' | 'hard' | 'expert' = 'medium';
  
  // Base adjustment from overall performance
  if (performanceScore > 0.8) {
    multiplier = 1.15; // 15% harder
    difficulty = 'hard';
  } else if (performanceScore > 0.65) {
    multiplier = 1.05; // 5% harder
    difficulty = 'medium';
  } else if (performanceScore < 0.4) {
    multiplier = 0.85; // 15% easier
    difficulty = 'easy';
  }
  
  // Category-specific adjustment
  const categorySuccessRate = categoryMetrics.completions / Math.max(categoryMetrics.attempts, 1);
  if (categorySuccessRate > 0.9 && categoryMetrics.attempts >= 5) {
    multiplier *= 1.1; // Extra 10% if excelling in category
    difficulty = difficulty === 'hard' ? 'expert' : 'hard';
  } else if (categorySuccessRate < 0.3 && categoryMetrics.attempts >= 3) {
    multiplier *= 0.9; // Extra 10% easier if struggling
    difficulty = 'easy';
  }
  
  // Prevent extreme adjustments
  multiplier = Math.max(0.7, Math.min(1.5, multiplier));
  
  const adjustedPoints = Math.round(currentPoints * multiplier);
  
  return {
    adjustedPoints,
    difficultyLevel: difficulty,
    explanation: getDifficultyExplanation(performanceScore, categorySuccessRate, multiplier)
  };
}

function getDifficultyExplanation(
  performanceScore: number,
  categorySuccessRate: number,
  multiplier: number
): string {
  if (multiplier > 1.1) {
    return 'Difficulty increased - You\'re performing excellently!';
  } else if (multiplier < 0.9) {
    return 'Difficulty decreased - Let\'s build confidence with achievable goals.';
  } else if (categorySuccessRate > 0.9) {
    return 'Category mastery bonus applied!';
  } else if (categorySuccessRate < 0.3) {
    return 'Extra support in this category to help you improve.';
  }
  return 'Difficulty maintained at current level.';
}

// Update performance metrics when task completed
export function updatePerformanceMetrics(
  profile: UserPerformanceProfile,
  task: { id: number; category: string },
  completed: boolean,
  timeSpent: number // in minutes
): UserPerformanceProfile {
  const category = task.category || 'general';
  
  // Initialize category metrics if doesn't exist
  if (!profile.categoryPerformance[category]) {
    profile.categoryPerformance[category] = {
      taskId: task.id.toString(),
      category,
      attempts: 0,
      completions: 0,
      averageTime: 0,
      lastAttempt: new Date(),
      consecutiveFails: 0,
      consecutiveSuccesses: 0,
      difficultyHistory: []
    };
  }
  
  const metrics = profile.categoryPerformance[category];
  metrics.attempts += 1;
  metrics.lastAttempt = new Date();
  
  if (completed) {
    metrics.completions += 1;
    metrics.consecutiveSuccesses += 1;
    metrics.consecutiveFails = 0;
  } else {
    metrics.consecutiveFails += 1;
    metrics.consecutiveSuccesses = 0;
  }
  
  // Update average time (exponential moving average)
  metrics.averageTime = metrics.averageTime === 0 
    ? timeSpent 
    : (metrics.averageTime * 0.7) + (timeSpent * 0.3);
  
  // Recalculate overall success rate
  profile.totalTasksAttempted += 1;
  if (completed) {
    profile.totalTasksCompleted += 1;
  }
  
  profile.overallSuccessRate = profile.totalTasksCompleted / Math.max(profile.totalTasksAttempted, 1);
  profile.lastUpdated = new Date();
  
  // Calculate weekly trend (simplified - compare last 7 days to previous 7)
  // For now, use a simple moving average
  const recentPerformance = Object.values(profile.categoryPerformance)
    .reduce((sum, m) => {
      const recentCompletions = m.completions / Math.max(m.attempts, 1);
      return sum + recentCompletions;
    }, 0) / Math.max(Object.keys(profile.categoryPerformance).length, 1);
  
  profile.weeklyTrend = recentPerformance > profile.overallSuccessRate ? 0.5 : -0.2;
  profile.consistencyScore = Math.min(1, profile.totalTasksCompleted / Math.max(profile.totalTasksAttempted * 0.7, 1));
  
  return profile;
}

// Initialize performance profile
export function initializePerformanceProfile(userId: string): UserPerformanceProfile {
  return {
    userId,
    overallSuccessRate: 0.5, // Neutral starting point
    categoryPerformance: {},
    weeklyTrend: 0,
    consistencyScore: 0,
    lastUpdated: new Date(),
    totalTasksAttempted: 0,
    totalTasksCompleted: 0
  };
}

// Load performance profile from storage
export function loadPerformanceProfile(userId: string): UserPerformanceProfile {
  try {
    const stored = localStorage.getItem(`hypeos-performance-profile-${userId}`);
    if (stored) {
      const profile = JSON.parse(stored);
      // Convert date strings back to Date objects
      profile.lastUpdated = new Date(profile.lastUpdated);
      Object.values(profile.categoryPerformance).forEach((metrics: any) => {
        metrics.lastAttempt = new Date(metrics.lastAttempt);
      });
      return profile;
    }
  } catch (error) {
    console.error('Error loading performance profile:', error);
  }
  
  return initializePerformanceProfile(userId);
}

// Save performance profile to storage
export function savePerformanceProfile(profile: UserPerformanceProfile): void {
  try {
    localStorage.setItem(`hypeos-performance-profile-${profile.userId}`, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving performance profile:', error);
  }
}

// Get performance summary
export function getPerformanceSummary(profile: UserPerformanceProfile): {
  overallGrade: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
} {
  const grade = profile.overallSuccessRate >= 0.8 ? 'A'
    : profile.overallSuccessRate >= 0.65 ? 'B'
    : profile.overallSuccessRate >= 0.5 ? 'C'
    : 'D';
  
  const strengths: string[] = [];
  const improvements: string[] = [];
  
  Object.entries(profile.categoryPerformance).forEach(([category, metrics]) => {
    const successRate = metrics.completions / Math.max(metrics.attempts, 1);
    if (successRate >= 0.8 && metrics.attempts >= 5) {
      strengths.push(category);
    } else if (successRate < 0.5 && metrics.attempts >= 3) {
      improvements.push(category);
    }
  });
  
  const recommendations: string[] = [];
  if (profile.overallSuccessRate < 0.5) {
    recommendations.push('Focus on completing easier tasks to build confidence');
  }
  if (profile.weeklyTrend < 0) {
    recommendations.push('Try to maintain consistency - your streak helps!');
  }
  if (strengths.length > 0) {
    recommendations.push(`Keep excelling in ${strengths[0]} - you're doing great!`);
  }
  if (improvements.length > 0) {
    recommendations.push(`Consider spending more time on ${improvements[0]} to improve`);
  }
  
  return {
    overallGrade: grade,
    strengths,
    improvements,
    recommendations
  };
}

// ============================================================================
// INTEGRATION WITH SPACED REPETITION (Phase 1)
// ============================================================================

/**
 * Calculate adaptive difficulty combined with spaced repetition data
 * This creates a Duolingo-style system where difficulty adjusts based on
 * both performance AND mastery level from spaced repetition
 */
export function calculateAdaptiveDifficultyWithSpacedRepetition(
  currentPoints: number,
  performanceScore: number,
  category: string,
  categoryMetrics: PerformanceMetrics,
  reviewItem: ReviewItem | null // Optional: spaced repetition data for this task
): {
  adjustedPoints: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  reviewInterval: number; // Days until next review (from spaced repetition)
  masteryMultiplier: number; // How mastery affects difficulty
  explanation: string;
} {
  // First, get base adaptive difficulty
  const baseDifficulty = calculateAdaptiveDifficulty(
    currentPoints,
    performanceScore,
    category,
    categoryMetrics
  );
  
  // If no review item, return base difficulty
  if (!reviewItem) {
    return {
      ...baseDifficulty,
      reviewInterval: 0,
      masteryMultiplier: 1.0,
      explanation: `${baseDifficulty.explanation} (No review data available)`
    };
  }
  
  // Calculate mastery-based multiplier
  // Mastered skills (high ease factor, long intervals) = harder tasks
  // Struggling skills (low ease factor, short intervals) = easier tasks
  let masteryMultiplier = 1.0;
  let masteryExplanation = '';
  
  if (reviewItem.mastered || reviewItem.interval > 30) {
    // Mastered skill - increase difficulty by 30%
    masteryMultiplier = 1.3;
    masteryExplanation = 'Mastered skill - difficulty increased to maintain challenge.';
  } else if (reviewItem.easeFactor >= 2.3 && reviewItem.repetitions >= 5) {
    // Strong skill - increase difficulty by 15%
    masteryMultiplier = 1.15;
    masteryExplanation = 'Strong performance - slightly increasing difficulty.';
  } else if (reviewItem.easeFactor < 1.8 || reviewItem.repetitions < 2) {
    // Struggling skill - decrease difficulty by 20%
    masteryMultiplier = 0.8;
    masteryExplanation = 'Building confidence - difficulty reduced for this skill.';
  } else if (reviewItem.averageQuality < 3.0 && reviewItem.qualityHistory.length > 0) {
    // Low quality scores - decrease difficulty
    masteryMultiplier = 0.85;
    masteryExplanation = 'Extra support - difficulty reduced based on review history.';
  }
  
  // Combine both multipliers
  // Base difficulty already has a multiplier, so we need to apply mastery multiplier
  // to the adjusted points
  const finalPoints = Math.round(baseDifficulty.adjustedPoints * masteryMultiplier);
  
  // Ensure we don't go too extreme
  const finalAdjustedPoints = Math.max(
    Math.round(currentPoints * 0.5), // Never less than 50% of original
    Math.min(finalPoints, Math.round(currentPoints * 2.0)) // Never more than 200% of original
  );
  
  // Determine final difficulty level
  let finalDifficulty: 'easy' | 'medium' | 'hard' | 'expert' = baseDifficulty.difficultyLevel;
  if (masteryMultiplier > 1.2 && finalDifficulty === 'hard') {
    finalDifficulty = 'expert';
  } else if (masteryMultiplier < 0.9 && finalDifficulty !== 'easy') {
    finalDifficulty = finalDifficulty === 'expert' ? 'hard' : 'medium';
  }
  
  const combinedExplanation = `${baseDifficulty.explanation} ${masteryExplanation} Review interval: ${reviewItem.interval} days.`;
  
  return {
    adjustedPoints: finalAdjustedPoints,
    difficultyLevel: finalDifficulty,
    reviewInterval: reviewItem.interval,
    masteryMultiplier,
    explanation: combinedExplanation.trim()
  };
}

/**
 * Get unified task difficulty calculation
 * Combines adaptive difficulty, spaced repetition, and performance metrics
 */
export function calculateUnifiedTaskDifficulty(
  task: {
    id: number;
    category: string;
    basePoints: number;
    impact: 'high' | 'medium' | 'low';
  },
  performanceProfile: UserPerformanceProfile,
  streakData: StreakData,
  reviewItem: ReviewItem | null
): {
  finalPoints: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  reviewInterval: number;
  masteryLevel: 'new' | 'learning' | 'practiced' | 'mastered' | 'weakened';
  needsReview: boolean;
  performanceScore: number;
  explanation: string;
} {
  // Calculate performance score
  const performanceScore = calculatePerformanceScore(performanceProfile, streakData);
  
  // Get category metrics
  const categoryMetrics = performanceProfile.categoryPerformance[task.category] || {
    taskId: task.id.toString(),
    category: task.category,
    attempts: 0,
    completions: 0,
    averageTime: 0,
    lastAttempt: new Date(),
    consecutiveFails: 0,
    consecutiveSuccesses: 0,
    difficultyHistory: []
  };
  
  // Calculate integrated difficulty
  const difficulty = calculateAdaptiveDifficultyWithSpacedRepetition(
    task.basePoints,
    performanceScore,
    task.category,
    categoryMetrics,
    reviewItem
  );
  
  // Determine mastery level from review item
  let masteryLevel: 'new' | 'learning' | 'practiced' | 'mastered' | 'weakened' = 'new';
  let needsReview = false;
  
  if (reviewItem) {
    const daysSinceLastReview = Math.floor(
      (new Date().getTime() - new Date(reviewItem.lastReview).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (reviewItem.mastered) {
      masteryLevel = 'mastered';
    } else if (reviewItem.repetitions === 0) {
      masteryLevel = 'new';
      needsReview = true;
    } else if (reviewItem.repetitions < 3) {
      masteryLevel = 'learning';
      needsReview = daysSinceLastReview >= reviewItem.interval;
    } else if (reviewItem.repetitions < 10) {
      masteryLevel = 'practiced';
      needsReview = daysSinceLastReview >= reviewItem.interval;
    } else {
      // Check if skill has weakened
      const decayRate = daysSinceLastReview / reviewItem.interval;
      if (decayRate > 1.5) {
        masteryLevel = 'weakened';
        needsReview = true;
      } else {
        masteryLevel = 'practiced';
        needsReview = daysSinceLastReview >= reviewItem.interval;
      }
    }
  } else {
    // No review item = new task
    masteryLevel = 'new';
    needsReview = false;
  }
  
  return {
    finalPoints: difficulty.adjustedPoints,
    difficultyLevel: difficulty.difficultyLevel,
    reviewInterval: difficulty.reviewInterval,
    masteryLevel,
    needsReview,
    performanceScore,
    explanation: difficulty.explanation
  };
}

