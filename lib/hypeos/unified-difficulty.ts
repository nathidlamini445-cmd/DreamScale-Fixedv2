// HypeOS Unified Difficulty System
// Main integration point for adaptive difficulty + spaced repetition
// This is the primary interface for the HypeOS page to use

import {
  calculateUnifiedTaskDifficulty,
  calculatePerformanceScore,
  updatePerformanceMetrics,
  loadPerformanceProfile,
  savePerformanceProfile,
  initializePerformanceProfile,
  type UserPerformanceProfile,
  type PerformanceMetrics
} from './adaptive-difficulty';
import {
  getReviewItemForTask,
  initializeOrGetReviewItem,
  processReview,
  loadReviewItems,
  saveReviewItems,
  upsertReviewItem,
  calculateSkillStrength,
  getSkillStrengthForTask,
  getSkillsNeedingReview,
  type ReviewItem,
  type SkillStrength
} from './spaced-repetition';
import {
  type StreakData
} from './streak-calculator';

export interface Task {
  id: number;
  title: string;
  category: string;
  impact: 'high' | 'medium' | 'low';
  basePoints: number;
  completed?: boolean;
  skill?: string; // e.g., "social-media-engagement", "sales-email"
}

export interface UnifiedTaskDifficulty {
  finalPoints: number;
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
  reviewInterval: number;
  masteryLevel: 'new' | 'learning' | 'practiced' | 'mastered' | 'weakened';
  needsReview: boolean;
  performanceScore: number;
  explanation: string;
  streakMultiplier: number;
  masteryMultiplier: number;
  skillStrength: SkillStrength | null; // Phase 2: Skill decay data
}

/**
 * Calculate unified difficulty for a task
 * This is the main function to call when displaying a task
 */
export function getTaskDifficulty(
  task: Task,
  userId: string,
  performanceProfile: UserPerformanceProfile,
  streakData: StreakData
): UnifiedTaskDifficulty {
  // Get review item for this task
  const skill = task.skill || `${task.category}-${task.id}`;
  const reviewItem = getReviewItemForTask(userId, task.id, task.category, skill);
  
  // Calculate skill strength (Phase 2: Skill decay)
  const skillStrength = reviewItem 
    ? calculateSkillStrength(reviewItem)
    : getSkillStrengthForTask(userId, task.id, task.category, skill);
  
  // Calculate unified difficulty
  const difficulty = calculateUnifiedTaskDifficulty(
    {
      id: task.id,
      category: task.category,
      basePoints: task.basePoints,
      impact: task.impact
    },
    performanceProfile,
    streakData,
    reviewItem
  );
  
  // Get category and streak multipliers from points system
  // We need to apply these on top of the difficulty-adjusted points
  const CATEGORY_MULTIPLIERS: Record<string, number> = {
    'sales': 1.5,
    'marketing': 1.3,
    'content': 1.2,
    'admin': 1.0,
    'learning': 1.1,
    'networking': 1.4
  };
  
  const categoryMultiplier = CATEGORY_MULTIPLIERS[task.category] || 1.0;
  
  // Get streak multiplier (reuse from points-system logic)
  const STREAK_MULTIPLIERS: Record<number, number> = {
    3: 1.5,
    7: 2.0,
    14: 2.5,
    21: 3.0,
    30: 3.5,
    50: 4.0,
    100: 5.0
  };
  
  const applicableStreakMultipliers = Object.entries(STREAK_MULTIPLIERS)
    .filter(([days]) => streakData.currentStreak >= parseInt(days))
    .map(([, multiplier]) => multiplier);
  
  const streakMultiplier = applicableStreakMultipliers.length > 0
    ? Math.max(...applicableStreakMultipliers)
    : 1.0;
  
  // Calculate final points:
  // 1. difficulty.finalPoints = basePoints adjusted for performance + mastery
  // 2. Apply category multiplier
  // 3. Apply streak multiplier
  const pointsAfterCategory = Math.round(difficulty.finalPoints * categoryMultiplier);
  const finalPointsWithStreak = Math.round(pointsAfterCategory * streakMultiplier);
  
  return {
    ...difficulty,
    finalPoints: finalPointsWithStreak,
    streakMultiplier,
    masteryMultiplier: difficulty.reviewInterval > 0 ? 1.3 : 1.0, // Simplified for now
    skillStrength // Phase 2: Include skill strength data
  };
}

/**
 * Complete a task and update both systems
 * This should be called when a user completes a task
 */
export function completeTask(
  task: Task,
  userId: string,
  performanceProfile: UserPerformanceProfile,
  streakData: StreakData,
  completed: boolean,
  timeSpent: number, // in minutes
  quality?: number // 0-5 user self-assessment (optional)
): {
  updatedPerformanceProfile: UserPerformanceProfile;
  updatedReviewItem: ReviewItem | null;
  pointsEarned: number;
  difficulty: UnifiedTaskDifficulty;
  message: string;
} {
  // Get difficulty before completion
  const difficulty = getTaskDifficulty(task, userId, performanceProfile, streakData);
  
  // Update performance metrics
  const updatedProfile = updatePerformanceMetrics(
    performanceProfile,
    {
      id: task.id,
      category: task.category
    },
    completed,
    timeSpent
  );
  
  // Save updated profile
  savePerformanceProfile(updatedProfile);
  
  // Handle spaced repetition
  let updatedReviewItem: ReviewItem | null = null;
  let reviewMessage = '';
  
  if (completed) {
    const skill = task.skill || `${task.category}-${task.id}`;
    
    // Get or initialize review item
    let reviewItem = getReviewItemForTask(userId, task.id, task.category, skill);
    
    if (!reviewItem) {
      // Initialize new review item
      reviewItem = initializeOrGetReviewItem(
        userId,
        task.id,
        task.category,
        skill,
        difficulty.difficultyLevel
      );
    }
    
    // Process review if quality provided
    if (quality !== undefined) {
      const reviewResult = processReview(
        reviewItem,
        quality,
        timeSpent,
        {
          difficultyLevel: difficulty.difficultyLevel,
          adjustedPoints: difficulty.finalPoints,
          basePoints: task.basePoints
        }
      );
      
      updatedReviewItem = reviewResult.updatedItem;
      reviewMessage = reviewResult.recommendation;
      
      // Save updated review item
      upsertReviewItem(userId, updatedReviewItem);
    } else {
      // Just update last review date
      reviewItem.lastReview = new Date();
      updatedReviewItem = reviewItem;
      upsertReviewItem(userId, updatedReviewItem);
    }
  }
  
  // Calculate points earned
  const pointsEarned = completed ? difficulty.finalPoints : 0;
  
  const message = completed
    ? `Task completed! +${pointsEarned} points. ${reviewMessage || difficulty.explanation}`
    : 'Task marked as incomplete.';
  
  return {
    updatedPerformanceProfile: updatedProfile,
    updatedReviewItem,
    pointsEarned,
    difficulty,
    message
  };
}

/**
 * Get all tasks with their unified difficulties
 * Useful for displaying a list of tasks with difficulty indicators
 */
export function getTasksWithDifficulties(
  tasks: Task[],
  userId: string,
  performanceProfile: UserPerformanceProfile,
  streakData: StreakData
): Array<Task & { difficulty: UnifiedTaskDifficulty }> {
  return tasks.map(task => ({
    ...task,
    difficulty: getTaskDifficulty(task, userId, performanceProfile, streakData)
  }));
}

/**
 * Get tasks that need review (Duolingo-style review queue)
 * Phase 2: Enhanced with skill decay tracking
 */
export function getTasksNeedingReview(
  tasks: Task[],
  userId: string,
  performanceProfile: UserPerformanceProfile,
  streakData: StreakData
): Array<Task & { difficulty: UnifiedTaskDifficulty }> {
  const allTasks = getTasksWithDifficulties(tasks, userId, performanceProfile, streakData);
  
  // Filter by needsReview flag OR skill strength decay
  return allTasks.filter(task => {
    const needsBasicReview = task.difficulty.needsReview;
    const skillNeedsReview = task.difficulty.skillStrength?.needsReview || false;
    const skillIsOverdue = task.difficulty.skillStrength?.isOverdue || false;
    
    return needsBasicReview || skillNeedsReview || skillIsOverdue;
  }).sort((a, b) => {
    // Prioritize most overdue skills first
    const aOverdue = a.difficulty.skillStrength?.isOverdue ? 1 : 0;
    const bOverdue = b.difficulty.skillStrength?.isOverdue ? 1 : 0;
    if (aOverdue !== bOverdue) return bOverdue - aOverdue;
    
    // Then by lowest strength
    const aStrength = a.difficulty.skillStrength?.strength || 0;
    const bStrength = b.difficulty.skillStrength?.strength || 0;
    return aStrength - bStrength;
  });
}

/**
 * Get recommended next task based on difficulty and review status
 */
export function getRecommendedNextTask(
  tasks: Task[],
  userId: string,
  performanceProfile: UserPerformanceProfile,
  streakData: StreakData
): (Task & { difficulty: UnifiedTaskDifficulty }) | null {
  const allTasks = getTasksWithDifficulties(tasks, userId, performanceProfile, streakData);
  
  // Priority order:
  // 1. Tasks needing review (most overdue first)
  // 2. New tasks (masteryLevel === 'new')
  // 3. Learning tasks (masteryLevel === 'learning')
  // 4. Other tasks
  
  const reviewTasks = allTasks
    .filter(t => t.difficulty.needsReview && !t.completed)
    .sort((a, b) => {
      // Most overdue first (shorter intervals = more urgent)
      return a.difficulty.reviewInterval - b.difficulty.reviewInterval;
    });
  
  if (reviewTasks.length > 0) {
    return reviewTasks[0];
  }
  
  const newTasks = allTasks
    .filter(t => t.difficulty.masteryLevel === 'new' && !t.completed)
    .sort((a, b) => b.difficulty.finalPoints - a.difficulty.finalPoints); // Higher points first
  
  if (newTasks.length > 0) {
    return newTasks[0];
  }
  
  const learningTasks = allTasks
    .filter(t => t.difficulty.masteryLevel === 'learning' && !t.completed)
    .sort((a, b) => b.difficulty.finalPoints - a.difficulty.finalPoints);
  
  if (learningTasks.length > 0) {
    return learningTasks[0];
  }
  
  // Return first incomplete task
  const incomplete = allTasks.find(t => !t.completed);
  return incomplete || null;
}

/**
 * Initialize or load user's performance profile
 */
export function getUserPerformanceProfile(userId: string): UserPerformanceProfile {
  return loadPerformanceProfile(userId) || initializePerformanceProfile(userId);
}

