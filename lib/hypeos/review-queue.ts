// HypeOS Daily Review Queue System
// Creates a prioritized list of tasks that need review (Duolingo-style)
// Combines spaced repetition, skill decay, and adaptive difficulty

import {
  getTasksNeedingReview,
  getTasksWithDifficulties,
  getRecommendedNextTask,
  type Task,
  type UnifiedTaskDifficulty
} from './unified-difficulty';
import {
  getSkillsNeedingReview,
  calculateSkillStrength,
  type SkillStrength
} from './spaced-repetition';
import {
  type UserPerformanceProfile
} from './adaptive-difficulty';
import {
  type StreakData
} from './streak-calculator';

export interface ReviewQueueItem {
  task: Task;
  difficulty: UnifiedTaskDifficulty;
  priority: number; // 1-100, higher = more urgent
  reason: string;
  reviewType: 'overdue' | 'weakened' | 'new' | 'practice' | 'mastery';
  daysOverdue?: number;
  strengthLoss?: number; // How much strength has been lost
}

export interface DailyReviewQueue {
  items: ReviewQueueItem[];
  totalItems: number;
  overdueCount: number;
  weakenedCount: number;
  newCount: number;
  estimatedTime: number; // minutes
  generatedAt: Date;
}

/**
 * Generate daily review queue
 * Prioritizes tasks that need review based on spaced repetition and skill decay
 */
export function generateDailyReviewQueue(
  tasks: Task[],
  userId: string,
  performanceProfile: UserPerformanceProfile,
  streakData: StreakData,
  maxItems: number = 10
): DailyReviewQueue {
  // Get all tasks with their difficulties
  const tasksWithDifficulties = getTasksWithDifficulties(
    tasks,
    userId,
    performanceProfile,
    streakData
  );
  
  // Filter tasks that need review
  const reviewTasks = getTasksNeedingReview(
    tasks,
    userId,
    performanceProfile,
    streakData
  );
  
  // Get skills needing review
  const skillsNeedingReview = getSkillsNeedingReview(userId);
  
  // Create review queue items with priorities
  const queueItems: ReviewQueueItem[] = reviewTasks.map(taskWithDiff => {
    const task = taskWithDiff;
    const difficulty = taskWithDiff.difficulty;
    const skillStrength = difficulty.skillStrength;
    
    // Determine review type and priority
    let priority = 50; // Base priority
    let reason = '';
    let reviewType: ReviewQueueItem['reviewType'] = 'practice';
    let daysOverdue: number | undefined;
    let strengthLoss: number | undefined;
    
    // Priority 1: Overdue skills (most urgent)
    if (skillStrength?.isOverdue) {
      reviewType = 'overdue';
      daysOverdue = skillStrength.daysSinceLastReview - skillStrength.daysUntilDecay;
      priority = 90 + Math.min(10, daysOverdue); // 90-100 priority
      strengthLoss = 100 - skillStrength.strength;
      reason = `Overdue by ${daysOverdue} day${daysOverdue === 1 ? '' : 's'}. Strength: ${skillStrength.strength}%`;
    }
    // Priority 2: Weakened skills (high urgency)
    else if (skillStrength?.level === 'weakened' || (skillStrength && skillStrength.strength < 50)) {
      reviewType = 'weakened';
      priority = 75 + Math.floor(skillStrength.strength / 2); // 75-100 priority
      strengthLoss = 100 - skillStrength.strength;
      reason = `Skill has weakened to ${skillStrength.strength}%. Needs review soon.`;
    }
    // Priority 3: New skills (learning phase)
    else if (difficulty.masteryLevel === 'new' && !task.completed) {
      reviewType = 'new';
      priority = 60;
      reason = 'New skill - start learning today!';
    }
    // Priority 4: Practice needed (approaching review date)
    else if (skillStrength?.needsReview && skillStrength.daysUntilDecay <= 2) {
      reviewType = 'practice';
      priority = 55 + (2 - skillStrength.daysUntilDecay) * 5; // 55-65 priority
      reason = `Review in ${skillStrength.daysUntilDecay} day${skillStrength.daysUntilDecay === 1 ? '' : 's'}`;
    }
    // Priority 5: Mastery maintenance
    else if (skillStrength?.level === 'mastered' && skillStrength.daysUntilDecay <= 7) {
      reviewType = 'mastery';
      priority = 40;
      reason = 'Maintain mastery - review soon';
    }
    // Default: General practice
    else {
      reviewType = 'practice';
      priority = 30;
      reason = 'Good to practice';
    }
    
    return {
      task: task as Task,
      difficulty,
      priority,
      reason,
      reviewType,
      daysOverdue,
      strengthLoss
    };
  });
  
  // Sort by priority (highest first)
  queueItems.sort((a, b) => b.priority - a.priority);
  
  // Take top items
  const topItems = queueItems.slice(0, maxItems);
  
  // Count by type
  const overdueCount = topItems.filter(item => item.reviewType === 'overdue').length;
  const weakenedCount = topItems.filter(item => item.reviewType === 'weakened').length;
  const newCount = topItems.filter(item => item.reviewType === 'new').length;
  
  // Estimate time (assume ~15 minutes per task)
  const estimatedTime = topItems.length * 15;
  
  return {
    items: topItems,
    totalItems: topItems.length,
    overdueCount,
    weakenedCount,
    newCount,
    estimatedTime,
    generatedAt: new Date()
  };
}

/**
 * Get review queue summary
 */
export function getReviewQueueSummary(
  queue: DailyReviewQueue
): {
  urgentCount: number;
  totalCount: number;
  estimatedTime: number;
  message: string;
} {
  const urgentCount = queue.overdueCount + queue.weakenedCount;
  
  let message = '';
  if (urgentCount > 0) {
    message = `${urgentCount} urgent review${urgentCount === 1 ? '' : 's'} needed`;
  } else if (queue.totalItems > 0) {
    message = `${queue.totalItems} skill${queue.totalItems === 1 ? '' : 's'} ready for review`;
  } else {
    message = 'All skills are up to date!';
  }
  
  return {
    urgentCount,
    totalCount: queue.totalItems,
    estimatedTime: queue.estimatedTime,
    message
  };
}

/**
 * Get next review task (highest priority)
 */
export function getNextReviewTask(
  queue: DailyReviewQueue
): ReviewQueueItem | null {
  return queue.items.length > 0 ? queue.items[0] : null;
}

/**
 * Filter review queue by type
 */
export function filterReviewQueue(
  queue: DailyReviewQueue,
  type: ReviewQueueItem['reviewType']
): ReviewQueueItem[] {
  return queue.items.filter(item => item.reviewType === type);
}

/**
 * Get review queue statistics
 */
export function getReviewQueueStats(
  queue: DailyReviewQueue
): {
  byType: Record<string, number>;
  averagePriority: number;
  highestPriority: number;
  lowestPriority: number;
} {
  const byType: Record<string, number> = {};
  let totalPriority = 0;
  let highestPriority = 0;
  let lowestPriority = 100;
  
  queue.items.forEach(item => {
    byType[item.reviewType] = (byType[item.reviewType] || 0) + 1;
    totalPriority += item.priority;
    highestPriority = Math.max(highestPriority, item.priority);
    lowestPriority = Math.min(lowestPriority, item.priority);
  });
  
  const averagePriority = queue.items.length > 0 
    ? totalPriority / queue.items.length 
    : 0;
  
  return {
    byType,
    averagePriority: Math.round(averagePriority),
    highestPriority,
    lowestPriority
  };
}

/**
 * Check if review queue needs attention
 */
export function needsReviewAttention(
  queue: DailyReviewQueue
): boolean {
  // Needs attention if there are overdue or weakened skills
  return queue.overdueCount > 0 || queue.weakenedCount > 0;
}

/**
 * Get review queue motivation message
 */
export function getReviewQueueMotivation(
  queue: DailyReviewQueue
): string {
  if (queue.overdueCount > 0) {
    return `⚠️ ${queue.overdueCount} skill${queue.overdueCount === 1 ? '' : 's'} ${queue.overdueCount === 1 ? 'is' : 'are'} overdue! Let's restore them.`;
  }
  if (queue.weakenedCount > 0) {
    return `💪 ${queue.weakenedCount} skill${queue.weakenedCount === 1 ? '' : 's'} ${queue.weakenedCount === 1 ? 'has' : 'have'} weakened. Time to strengthen!`;
  }
  if (queue.newCount > 0) {
    return `🎯 ${queue.newCount} new skill${queue.newCount === 1 ? '' : 's'} to learn!`;
  }
  if (queue.totalItems > 0) {
    return `📚 ${queue.totalItems} skill${queue.totalItems === 1 ? '' : 's'} ready for review.`;
  }
  return '✨ All skills are strong! Great work maintaining your knowledge.';
}

