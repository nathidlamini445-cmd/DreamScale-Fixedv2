// HypeOS Spaced Repetition System
// Schedules task/content reviews at optimal intervals for memory retention
// Based on SuperMemo SM-2 algorithm
// Integrated with adaptive difficulty for Duolingo-style learning

export interface ReviewItem {
  id: string;
  taskId: number;
  category: string;
  skill: string; // e.g., "social-media-engagement", "sales-email"
  
  // Spaced repetition data
  easeFactor: number; // Starting at 2.5
  interval: number; // Days until next review
  repetitions: number; // Number of successful reviews
  lastReview: Date;
  nextReview: Date;
  
  // Performance tracking
  qualityHistory: number[]; // 0-5 quality scores
  averageQuality: number;
  
  // Metadata
  createdAt: Date;
  mastered: boolean; // True when interval > 365 days
}

export interface ReviewSession {
  id: string;
  userId: string;
  date: Date;
  itemsReviewed: number;
  itemsDue: ReviewItem[];
  completed: boolean;
}

// Calculate next review date using SM-2 algorithm
export function calculateNextReview(
  item: ReviewItem,
  quality: number // 0-5 scale
): {
  nextInterval: number;
  nextEaseFactor: number;
  nextReviewDate: Date;
  mastered: boolean;
} {
  let newEaseFactor = item.easeFactor;
  let newInterval = item.interval;
  let newRepetitions = item.repetitions;
  
  // Update ease factor based on quality
  if (quality >= 5) {
    newEaseFactor = Math.min(2.5, newEaseFactor + 0.1);
  } else if (quality >= 4) {
    // No change
  } else if (quality >= 3) {
    newEaseFactor = Math.max(1.3, newEaseFactor - 0.15);
  } else {
    // Failed - reset
    newEaseFactor = Math.max(1.3, newEaseFactor - 0.3);
    newInterval = 1;
    newRepetitions = 0;
  }
  
  // Calculate new interval
  if (newRepetitions === 0) {
    newInterval = 1; // First review
  } else if (newRepetitions === 1) {
    newInterval = 6; // Second review
  } else {
    newInterval = Math.round(item.interval * newEaseFactor);
  }
  
  // Increment repetitions if quality >= 3
  if (quality >= 3) {
    newRepetitions += 1;
  }
  
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);
  
  const mastered = newInterval > 365; // Considered mastered if > 1 year
  
  return {
    nextInterval: newInterval,
    nextEaseFactor: newEaseFactor,
    nextReviewDate,
    mastered
  };
}

// Get items due for review today
export function getItemsDueForReview(
  allItems: ReviewItem[],
  date: Date = new Date()
): ReviewItem[] {
  return allItems.filter(item => {
    const nextReview = new Date(item.nextReview);
    return nextReview <= date && !item.mastered;
  });
}

// Initialize review item for new task/concept
export function initializeReviewItem(
  taskId: number,
  category: string,
  skill: string
): ReviewItem {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    id: `${taskId}-${skill}-${Date.now()}`,
    taskId,
    category,
    skill,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    lastReview: new Date(),
    nextReview: tomorrow,
    qualityHistory: [],
    averageQuality: 0,
    createdAt: new Date(),
    mastered: false
  };
}

// Process review and update item
export function processReview(
  item: ReviewItem,
  quality: number, // User's self-assessment: 0-5
  timeSpent?: number,
  difficultyAdjustment?: {
    difficultyLevel: 'easy' | 'medium' | 'hard' | 'expert';
    adjustedPoints: number;
    basePoints: number;
  } // Optional: adaptive difficulty data
): {
  updatedItem: ReviewItem;
  intervalIncrease: number;
  recommendation: string;
  qualityAdjustment: number; // Quality adjusted based on difficulty
} {
  // Adjust quality based on difficulty
  // If task was harder (expert/hard), user gets bonus to quality
  // If task was easier (easy), user needs higher quality to maintain
  let qualityAdjustment = 0;
  let adjustedQuality = quality;
  
  if (difficultyAdjustment) {
    const difficultyMultiplier = difficultyAdjustment.adjustedPoints / difficultyAdjustment.basePoints;
    
    if (difficultyAdjustment.difficultyLevel === 'expert' || difficultyAdjustment.difficultyLevel === 'hard') {
      // Harder task = bonus to quality (user did well on hard task)
      qualityAdjustment = Math.min(1, (difficultyMultiplier - 1) * 2); // Max +1 quality boost
      adjustedQuality = Math.min(5, quality + qualityAdjustment);
    } else if (difficultyAdjustment.difficultyLevel === 'easy') {
      // Easier task = need higher quality to maintain (penalty for easy tasks)
      qualityAdjustment = -0.5; // Slight penalty
      adjustedQuality = Math.max(0, quality + qualityAdjustment);
    }
  }
  
  // Use adjusted quality for review calculation
  const calculation = calculateNextReview(item, adjustedQuality);
  
  // Update quality history (store original quality, but use adjusted for calculation)
  const qualityHistory = [...item.qualityHistory, quality]; // Store original
  const averageQuality = qualityHistory.reduce((sum, q) => sum + q, 0) / qualityHistory.length;
  
  const updatedItem: ReviewItem = {
    ...item,
    easeFactor: calculation.nextEaseFactor,
    interval: calculation.nextInterval,
    repetitions: adjustedQuality >= 3 ? item.repetitions + 1 : 0,
    lastReview: new Date(),
    nextReview: calculation.nextReviewDate,
    qualityHistory,
    averageQuality,
    mastered: calculation.mastered
  };
  
  const intervalIncrease = calculation.nextInterval - item.interval;
  
  let recommendation = '';
  if (adjustedQuality >= 5) {
    recommendation = 'Excellent! Mastery increasing.';
  } else if (adjustedQuality >= 4) {
    recommendation = 'Good work. Keep reviewing.';
  } else if (adjustedQuality >= 3) {
    recommendation = 'Getting there. Review again soon.';
  } else {
    recommendation = 'Needs more practice. We\'ll review this more frequently.';
  }
  
  // Add difficulty context to recommendation
  if (difficultyAdjustment && qualityAdjustment > 0) {
    recommendation += ` Great job on a ${difficultyAdjustment.difficultyLevel} task!`;
  }
  
  return {
    updatedItem,
    intervalIncrease,
    recommendation,
    qualityAdjustment
  };
}

// Generate daily review session
export function generateDailyReviewSession(
  items: ReviewItem[],
  maxItems: number = 10
): ReviewSession {
  const dueItems = getItemsDueForReview(items);
  
  // Prioritize items:
  // 1. Overdue items (most overdue first)
  // 2. Items with lower ease factor
  // 3. Items not reviewed recently
  const prioritized = dueItems.sort((a, b) => {
    const aOverdue = new Date().getTime() - new Date(a.nextReview).getTime();
    const bOverdue = new Date().getTime() - new Date(b.nextReview).getTime();
    
    if (Math.abs(aOverdue - bOverdue) > 86400000) { // > 1 day difference
      return bOverdue - aOverdue; // Most overdue first
    }
    
    if (Math.abs(a.easeFactor - b.easeFactor) > 0.2) {
      return a.easeFactor - b.easeFactor; // Lower ease factor first
    }
    
    return new Date(a.lastReview).getTime() - new Date(b.lastReview).getTime();
  });
  
  return {
    id: `review-${Date.now()}`,
    userId: 'current-user', // Get from session
    date: new Date(),
    itemsReviewed: 0,
    itemsDue: prioritized.slice(0, maxItems),
    completed: false
  };
}

// Calculate retention rate
export function calculateRetentionMetrics(items: ReviewItem[]): {
  totalItems: number;
  masteredItems: number;
  activeItems: number;
  averageEaseFactor: number;
  averageInterval: number;
  retentionRate: number; // 0-1, based on quality history
} {
  if (items.length === 0) {
    return {
      totalItems: 0,
      masteredItems: 0,
      activeItems: 0,
      averageEaseFactor: 2.5,
      averageInterval: 0,
      retentionRate: 0
    };
  }
  
  const mastered = items.filter(i => i.mastered).length;
  const active = items.filter(i => !i.mastered && new Date(i.nextReview) <= new Date()).length;
  
  const avgEaseFactor = items.reduce((sum, i) => sum + i.easeFactor, 0) / items.length;
  const avgInterval = items.reduce((sum, i) => sum + i.interval, 0) / items.length;
  
  // Retention rate: average of all quality scores
  const allQualities = items.flatMap(i => i.qualityHistory);
  const retentionRate = allQualities.length > 0
    ? allQualities.reduce((sum, q) => sum + q, 0) / (allQualities.length * 5) // Normalize to 0-1
    : 0;
  
  return {
    totalItems: items.length,
    masteredItems: mastered,
    activeItems: active,
    averageEaseFactor: avgEaseFactor,
    averageInterval: avgInterval,
    retentionRate
  };
}

// Load review items from storage
export function loadReviewItems(userId: string): ReviewItem[] {
  try {
    const stored = localStorage.getItem(`hypeos-review-items-${userId}`);
    if (stored) {
      const items: ReviewItem[] = JSON.parse(stored);
      // Convert date strings back to Date objects
      return items.map(item => ({
        ...item,
        lastReview: new Date(item.lastReview),
        nextReview: new Date(item.nextReview),
        createdAt: new Date(item.createdAt)
      }));
    }
  } catch (error) {
    console.error('Error loading review items:', error);
  }
  
  return [];
}

// Save review items to storage
export function saveReviewItems(userId: string, items: ReviewItem[]): void {
  try {
    localStorage.setItem(`hypeos-review-items-${userId}`, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving review items:', error);
  }
}

// Add new review item or update existing
export function upsertReviewItem(userId: string, item: ReviewItem): void {
  const items = loadReviewItems(userId);
  const existingIndex = items.findIndex(i => i.id === item.id);
  
  if (existingIndex >= 0) {
    items[existingIndex] = item;
  } else {
    items.push(item);
  }
  
  saveReviewItems(userId, items);
}

// ============================================================================
// INTEGRATION WITH ADAPTIVE DIFFICULTY (Phase 1)
// ============================================================================

/**
 * Get review item for a specific task, considering category and skill
 */
export function getReviewItemForTask(
  userId: string,
  taskId: number,
  category: string,
  skill: string
): ReviewItem | null {
  const items = loadReviewItems(userId);
  
  // Try to find exact match first
  let item = items.find(i => 
    i.taskId === taskId && 
    i.category === category && 
    i.skill === skill
  );
  
  // If not found, try to find by category and skill only
  if (!item) {
    item = items.find(i => 
      i.category === category && 
      i.skill === skill
    );
  }
  
  // If still not found, try by category only
  if (!item) {
    item = items.find(i => i.category === category);
  }
  
  return item || null;
}

/**
 * Initialize or get review item for a task when it's first completed
 * This integrates with the adaptive difficulty system
 */
export function initializeOrGetReviewItem(
  userId: string,
  taskId: number,
  category: string,
  skill: string,
  difficultyLevel?: 'easy' | 'medium' | 'hard' | 'expert'
): ReviewItem {
  let item = getReviewItemForTask(userId, taskId, category, skill);
  
  if (!item) {
    // Create new review item
    item = initializeReviewItem(taskId, category, skill);
    
    // Adjust initial interval based on difficulty
    // Easier tasks = shorter initial interval (review sooner)
    // Harder tasks = longer initial interval (if mastered, review later)
    if (difficultyLevel) {
      if (difficultyLevel === 'easy') {
        item.interval = 1; // Review tomorrow
        item.easeFactor = 2.0; // Lower ease factor for easy tasks
      } else if (difficultyLevel === 'expert' || difficultyLevel === 'hard') {
        item.interval = 2; // Review in 2 days
        item.easeFactor = 2.5; // Higher ease factor for hard tasks
      }
    }
    
    // Save the new item
    upsertReviewItem(userId, item);
  }
  
  return item;
}

// ============================================================================
// SKILL DECAY SYSTEM (Phase 2)
// ============================================================================

export type SkillStrengthLevel = 'new' | 'learning' | 'practiced' | 'mastered' | 'weakened';

export interface SkillStrength {
  strength: number; // 0-100
  level: SkillStrengthLevel;
  daysSinceLastReview: number;
  daysUntilDecay: number;
  needsReview: boolean;
  decayRate: number; // 0-1, how much strength has decayed
  isOverdue: boolean;
}

/**
 * Calculate current skill strength based on review history and decay
 * Similar to Duolingo's skill strength system
 */
export function calculateSkillStrength(
  reviewItem: ReviewItem,
  currentDate: Date = new Date()
): SkillStrength {
  const lastReview = new Date(reviewItem.lastReview);
  const nextReview = new Date(reviewItem.nextReview);
  const daysSinceLastReview = Math.floor(
    (currentDate.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysUntilNextReview = Math.floor(
    (nextReview.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Base strength calculation
  // Mastered skills start at 100, others based on ease factor and repetitions
  let baseStrength = 100;
  
  if (reviewItem.mastered) {
    baseStrength = 100;
  } else if (reviewItem.repetitions >= 10) {
    baseStrength = 90;
  } else if (reviewItem.repetitions >= 5) {
    baseStrength = 75;
  } else if (reviewItem.repetitions >= 3) {
    baseStrength = 60;
  } else if (reviewItem.repetitions >= 1) {
    baseStrength = 40;
  } else {
    baseStrength = 20; // New skill
  }
  
  // Apply ease factor modifier
  const easeModifier = (reviewItem.easeFactor / 2.5) * 10; // Normalize to 0-10, then scale
  baseStrength = Math.min(100, baseStrength + easeModifier);
  
  // Calculate decay
  // Skills decay over time if not reviewed
  // Decay rate increases as time passes the review interval
  const isOverdue = daysSinceLastReview > reviewItem.interval;
  let decayRate = 0;
  let currentStrength = baseStrength;
  
  if (isOverdue) {
    // Exponential decay after review date
    const overdueDays = daysSinceLastReview - reviewItem.interval;
    const decayFactor = Math.min(1, overdueDays / reviewItem.interval); // Max 100% decay after interval
    decayRate = decayFactor;
    
    // Decay strength: lose 2% per day overdue, up to 50% max decay
    const decayPercentage = Math.min(50, overdueDays * 2);
    currentStrength = Math.max(0, baseStrength - decayPercentage);
  } else {
    // Slight decay as we approach review date (gradual weakening)
    const progressToReview = daysSinceLastReview / reviewItem.interval;
    if (progressToReview > 0.7) {
      // In the last 30% of the interval, start gradual decay
      const nearDecay = (progressToReview - 0.7) / 0.3; // 0 to 1 as we approach review
      decayRate = nearDecay * 0.1; // Max 10% decay before review date
      currentStrength = baseStrength * (1 - decayRate);
    }
  }
  
  // Determine strength level
  let level: SkillStrengthLevel = 'new';
  if (reviewItem.mastered && currentStrength >= 90) {
    level = 'mastered';
  } else if (currentStrength >= 75 && !isOverdue) {
    level = 'practiced';
  } else if (currentStrength >= 50 || (reviewItem.repetitions >= 3 && !isOverdue)) {
    level = 'learning';
  } else if (isOverdue || currentStrength < 50) {
    level = 'weakened';
  } else {
    level = 'new';
  }
  
  // Needs review if overdue or strength is low
  const needsReview = isOverdue || currentStrength < 60 || daysUntilNextReview <= 0;
  
  return {
    strength: Math.round(currentStrength),
    level,
    daysSinceLastReview,
    daysUntilDecay: Math.max(0, daysUntilNextReview),
    needsReview,
    decayRate,
    isOverdue
  };
}

/**
 * Get skill strength for a specific task/category
 */
export function getSkillStrengthForTask(
  userId: string,
  taskId: number,
  category: string,
  skill: string
): SkillStrength | null {
  const reviewItem = getReviewItemForTask(userId, taskId, category, skill);
  
  if (!reviewItem) {
    // New skill - no strength yet
    return {
      strength: 0,
      level: 'new',
      daysSinceLastReview: 0,
      daysUntilDecay: 0,
      needsReview: false,
      decayRate: 0,
      isOverdue: false
    };
  }
  
  return calculateSkillStrength(reviewItem);
}

/**
 * Get all skills that need review (decayed or overdue)
 */
export function getSkillsNeedingReview(
  userId: string,
  maxDaysOverdue: number = 30
): Array<{
  reviewItem: ReviewItem;
  strength: SkillStrength;
}> {
  const items = loadReviewItems(userId);
  const now = new Date();
  
  return items
    .map(item => ({
      reviewItem: item,
      strength: calculateSkillStrength(item, now)
    }))
    .filter(({ strength }) => strength.needsReview || strength.isOverdue)
    .filter(({ strength }) => {
      // Filter out items that are too far overdue (might be abandoned)
      return strength.daysSinceLastReview <= maxDaysOverdue || strength.strength > 0;
    })
    .sort((a, b) => {
      // Sort by: most overdue first, then by lowest strength
      if (a.strength.isOverdue !== b.strength.isOverdue) {
        return a.strength.isOverdue ? -1 : 1;
      }
      return a.strength.strength - b.strength.strength;
    });
}

/**
 * Calculate skill decay rate (how fast skills decay without review)
 */
export function calculateDecayRate(
  reviewItem: ReviewItem,
  daysSinceLastReview: number
): number {
  // Decay starts slowly, accelerates as time passes
  if (daysSinceLastReview <= reviewItem.interval) {
    return 0; // No decay before review date
  }
  
  const overdueDays = daysSinceLastReview - reviewItem.interval;
  
  // Decay formula:
  // - First 25% of interval: 1% per day
  // - Next 25%: 2% per day
  // - After 50%: 3% per day
  const intervalFraction = overdueDays / reviewItem.interval;
  
  if (intervalFraction <= 0.25) {
    return overdueDays * 0.01; // 1% per day
  } else if (intervalFraction <= 0.5) {
    return 0.25 * reviewItem.interval * 0.01 + (overdueDays - 0.25 * reviewItem.interval) * 0.02; // 2% per day
  } else {
    return 0.25 * reviewItem.interval * 0.01 + 
           0.25 * reviewItem.interval * 0.02 + 
           (overdueDays - 0.5 * reviewItem.interval) * 0.03; // 3% per day
  }
}

/**
 * Get skill strength summary for a category
 */
export function getCategorySkillStrength(
  userId: string,
  category: string
): {
  averageStrength: number;
  totalSkills: number;
  masteredSkills: number;
  weakenedSkills: number;
  needsReviewCount: number;
} {
  const items = loadReviewItems(userId);
  const categoryItems = items.filter(item => item.category === category);
  
  if (categoryItems.length === 0) {
    return {
      averageStrength: 0,
      totalSkills: 0,
      masteredSkills: 0,
      weakenedSkills: 0,
      needsReviewCount: 0
    };
  }
  
  const strengths = categoryItems.map(item => calculateSkillStrength(item));
  const averageStrength = strengths.reduce((sum, s) => sum + s.strength, 0) / strengths.length;
  const masteredSkills = strengths.filter(s => s.level === 'mastered').length;
  const weakenedSkills = strengths.filter(s => s.level === 'weakened').length;
  const needsReviewCount = strengths.filter(s => s.needsReview).length;
  
  return {
    averageStrength: Math.round(averageStrength),
    totalSkills: categoryItems.length,
    masteredSkills,
    weakenedSkills,
    needsReviewCount
  };
}

