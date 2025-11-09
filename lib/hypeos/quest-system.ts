// Daily Quests System for HypeOS
// Tracks daily quest progress and rewards

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  completed: boolean;
  reward: number;
  type: 'tasks' | 'xp' | 'streak' | 'performance';
}

export interface QuestProgress {
  tasksCompleted: number;
  xpEarned: number;
  streakCount: number;
  highImpactTasks: number;
  lastResetDate: string;
}

export interface QuestReward {
  questId: string;
  points: number;
  message: string;
}

// Default daily quests
export const DEFAULT_QUESTS: Omit<Quest, 'current' | 'completed'>[] = [
  {
    id: 'earn-xp',
    title: 'Earn 50 XP',
    description: 'Complete tasks to earn experience points',
    icon: '⚡',
    target: 50,
    reward: 25,
    type: 'xp'
  },
  {
    id: 'complete-tasks',
    title: 'Complete 3 tasks',
    description: 'Finish your daily task list',
    icon: '🎯',
    target: 3,
    reward: 30,
    type: 'tasks'
  },
  {
    id: 'high-performance',
    title: 'Complete 2 high-impact tasks',
    description: 'Focus on high-impact activities',
    icon: '🔥',
    target: 2,
    reward: 40,
    type: 'performance'
  },
  {
    id: 'maintain-streak',
    title: 'Get 5 in a row correct',
    description: 'Complete tasks without skipping',
    icon: '🏆',
    target: 5,
    reward: 35,
    type: 'streak'
  }
];

// Quest tracking functions
export function initializeQuests(): Quest[] {
  try {
    const today = new Date().toDateString();
    const savedProgress = getQuestProgress();
    
    // Reset if it's a new day
    if (savedProgress.lastResetDate !== today) {
      resetDailyQuests();
      return DEFAULT_QUESTS.map(quest => ({
        ...quest,
        current: 0,
        completed: false
      }));
    }
    
    // Load saved progress
    return DEFAULT_QUESTS.map(quest => {
      const saved = getQuestById(quest.id);
      return {
        ...quest,
        current: saved?.current || 0,
        completed: saved?.completed || false
      };
    });
  } catch (error) {
    console.error('Error initializing quests:', error);
    // Return default quests if anything fails
    return DEFAULT_QUESTS.map(quest => ({
      ...quest,
      current: 0,
      completed: false
    }));
  }
}

export function updateQuestProgress(
  quests: Quest[],
  progress: QuestProgress
): Quest[] {
  return quests.map(quest => {
    let current = quest.current;
    
    switch (quest.type) {
      case 'tasks':
        current = progress.tasksCompleted;
        break;
      case 'xp':
        current = progress.xpEarned;
        break;
      case 'streak':
        current = progress.streakCount;
        break;
      case 'performance':
        current = progress.highImpactTasks;
        break;
    }
    
    const completed = current >= quest.target;
    
    return {
      ...quest,
      current: Math.min(current, quest.target),
      completed
    };
  });
}

export function checkQuestCompletions(
  oldQuests: Quest[],
  newQuests: Quest[]
): QuestReward[] {
  const rewards: QuestReward[] = [];
  
  newQuests.forEach((newQuest, index) => {
    const oldQuest = oldQuests[index];
    
    // Check if quest was just completed
    if (!oldQuest.completed && newQuest.completed) {
      rewards.push({
        questId: newQuest.id,
        points: newQuest.reward,
        message: `Quest completed: ${newQuest.title}! +${newQuest.reward} XP`
      });
    }
  });
  
  return rewards;
}

export function saveQuestProgress(quests: Quest[]): void {
  const today = new Date().toDateString();
  const progress: QuestProgress = {
    tasksCompleted: 0,
    xpEarned: 0,
    streakCount: 0,
    highImpactTasks: 0,
    lastResetDate: today
  };
  
  // Calculate current progress
  quests.forEach(quest => {
    switch (quest.type) {
      case 'tasks':
        progress.tasksCompleted = quest.current;
        break;
      case 'xp':
        progress.xpEarned = quest.current;
        break;
      case 'streak':
        progress.streakCount = quest.current;
        break;
      case 'performance':
        progress.highImpactTasks = quest.current;
        break;
    }
  });
  
  localStorage.setItem('hypeos-quest-progress', JSON.stringify(progress));
  localStorage.setItem('hypeos-quests', JSON.stringify(quests));
}

export function getQuestProgress(): QuestProgress {
  const saved = localStorage.getItem('hypeos-quest-progress');
  if (!saved) {
    return {
      tasksCompleted: 0,
      xpEarned: 0,
      streakCount: 0,
      highImpactTasks: 0,
      lastResetDate: new Date().toDateString()
    };
  }
  
  return JSON.parse(saved);
}

export function getQuestById(questId: string): Quest | null {
  try {
    const saved = localStorage.getItem('hypeos-quests');
    if (!saved) return null;
    
    const quests: Quest[] = JSON.parse(saved);
    return quests.find(q => q.id === questId) || null;
  } catch (error) {
    console.error('Error getting quest by ID:', error);
    return null;
  }
}

export function resetDailyQuests(): void {
  const today = new Date().toDateString();
  const progress: QuestProgress = {
    tasksCompleted: 0,
    xpEarned: 0,
    streakCount: 0,
    highImpactTasks: 0,
    lastResetDate: today
  };
  
  localStorage.setItem('hypeos-quest-progress', JSON.stringify(progress));
  localStorage.removeItem('hypeos-quests');
}

export function calculateQuestProgress(
  tasks: any[],
  userPoints: number,
  streak: number
): QuestProgress {
  const completedTasks = tasks.filter(task => task.completed);
  const highImpactTasks = completedTasks.filter(task => task.impact === 'high');
  
  return {
    tasksCompleted: completedTasks.length,
    xpEarned: userPoints,
    streakCount: streak,
    highImpactTasks: highImpactTasks.length,
    lastResetDate: new Date().toDateString()
  };
}

export function getQuestCompletionRate(quests: Quest[]): number {
  if (quests.length === 0) return 0;
  const completed = quests.filter(q => q.completed).length;
  return Math.round((completed / quests.length) * 100);
}

export function getTotalQuestRewards(quests: Quest[]): number {
  return quests
    .filter(q => q.completed)
    .reduce((total, quest) => total + quest.reward, 0);
}
