// HypeOS Skill Tree/Progression System
// Organize tasks and concepts into skill trees with unlockable progression paths

export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string; // 'sales', 'marketing', 'content', etc.
  icon: string;
  
  // Prerequisites
  prerequisites: string[]; // IDs of required skills
  requiredTasks: number; // Minimum tasks to complete
  requiredPoints: number; // Minimum points needed
  
  // Progress
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
  tasksCompleted: number;
  pointsEarned: number;
  mastered: boolean;
  masteredAt?: Date;
  
  // Rewards
  unlockReward: number; // Points for unlocking
  masteryReward: number; // Points for mastering
  
  // Difficulty
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedTime: string; // "2-4 hours"
}

export interface SkillBranch {
  id: string;
  name: string; // e.g., "Sales Mastery", "Content Creation"
  icon: string;
  color: string;
  skills: Skill[];
  unlocked: boolean;
  progress: number; // Average progress of all skills
}

export interface SkillTree {
  branches: SkillBranch[];
  totalSkills: number;
  unlockedSkills: number;
  masteredSkills: number;
  overallProgress: number;
}

// Define default skill tree structure
export const DEFAULT_SKILL_TREE: SkillBranch[] = [
  {
    id: 'sales',
    name: 'Sales Mastery',
    icon: '💰',
    color: 'green',
    unlocked: true,
    progress: 0,
    skills: [
      {
        id: 'sales-101',
        name: 'Email Outreach Basics',
        description: 'Master the fundamentals of email outreach and cold emailing',
        category: 'sales',
        icon: '✉️',
        prerequisites: [],
        requiredTasks: 3,
        requiredPoints: 500,
        unlocked: true, // Starter skill
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 100,
        masteryReward: 500,
        difficulty: 'beginner',
        estimatedTime: '1-2 hours'
      },
      {
        id: 'sales-201',
        name: 'Advanced Cold Calling',
        description: 'Learn advanced techniques for cold calling and phone sales',
        category: 'sales',
        icon: '📞',
        prerequisites: ['sales-101'], // Requires email basics
        requiredTasks: 5,
        requiredPoints: 1500,
        unlocked: false,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 200,
        masteryReward: 1000,
        difficulty: 'intermediate',
        estimatedTime: '3-5 hours'
      },
      {
        id: 'sales-301',
        name: 'Closing Mastery',
        description: 'Advanced closing techniques and deal negotiation',
        category: 'sales',
        icon: '🤝',
        prerequisites: ['sales-201'],
        requiredTasks: 8,
        requiredPoints: 3000,
        unlocked: false,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 500,
        masteryReward: 2000,
        difficulty: 'advanced',
        estimatedTime: '5-8 hours'
      }
    ]
  },
  {
    id: 'content',
    name: 'Content Creation',
    icon: '🎨',
    color: 'blue',
    unlocked: true,
    progress: 0,
    skills: [
      {
        id: 'content-101',
        name: 'Social Media Fundamentals',
        description: 'Learn the basics of social media content creation',
        category: 'content',
        icon: '📱',
        prerequisites: [],
        requiredTasks: 5,
        requiredPoints: 800,
        unlocked: true,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 150,
        masteryReward: 750,
        difficulty: 'beginner',
        estimatedTime: '2-3 hours'
      },
      {
        id: 'content-201',
        name: 'Video Content Creation',
        description: 'Master video editing and YouTube content creation',
        category: 'content',
        icon: '🎥',
        prerequisites: ['content-101'],
        requiredTasks: 7,
        requiredPoints: 2000,
        unlocked: false,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 300,
        masteryReward: 1500,
        difficulty: 'intermediate',
        estimatedTime: '4-6 hours'
      },
      {
        id: 'content-301',
        name: 'Content Strategy Mastery',
        description: 'Advanced content planning and strategy development',
        category: 'content',
        icon: '📊',
        prerequisites: ['content-201'],
        requiredTasks: 10,
        requiredPoints: 4000,
        unlocked: false,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 750,
        masteryReward: 3000,
        difficulty: 'advanced',
        estimatedTime: '6-10 hours'
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing & Growth',
    icon: '🚀',
    color: 'purple',
    unlocked: true,
    progress: 0,
    skills: [
      {
        id: 'marketing-101',
        name: 'Social Media Marketing',
        description: 'Basics of social media marketing and engagement',
        category: 'marketing',
        icon: '📢',
        prerequisites: [],
        requiredTasks: 4,
        requiredPoints: 600,
        unlocked: true,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 120,
        masteryReward: 600,
        difficulty: 'beginner',
        estimatedTime: '2-3 hours'
      },
      {
        id: 'marketing-201',
        name: 'Growth Hacking',
        description: 'Advanced growth strategies and viral marketing',
        category: 'marketing',
        icon: '⚡',
        prerequisites: ['marketing-101'],
        requiredTasks: 6,
        requiredPoints: 1800,
        unlocked: false,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 250,
        masteryReward: 1200,
        difficulty: 'intermediate',
        estimatedTime: '4-5 hours'
      }
    ]
  },
  {
    id: 'networking',
    name: 'Networking & Relationships',
    icon: '🤝',
    color: 'orange',
    unlocked: true,
    progress: 0,
    skills: [
      {
        id: 'networking-101',
        name: 'Building Connections',
        description: 'Learn to build and maintain professional relationships',
        category: 'networking',
        icon: '👥',
        prerequisites: [],
        requiredTasks: 3,
        requiredPoints: 400,
        unlocked: true,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 80,
        masteryReward: 400,
        difficulty: 'beginner',
        estimatedTime: '1-2 hours'
      },
      {
        id: 'networking-201',
        name: 'Strategic Partnerships',
        description: 'Advanced partnership and collaboration strategies',
        category: 'networking',
        icon: '🏢',
        prerequisites: ['networking-101'],
        requiredTasks: 5,
        requiredPoints: 1200,
        unlocked: false,
        progress: 0,
        tasksCompleted: 0,
        pointsEarned: 0,
        mastered: false,
        unlockReward: 200,
        masteryReward: 800,
        difficulty: 'intermediate',
        estimatedTime: '3-4 hours'
      }
    ]
  }
];

// Check if skill can be unlocked
export function canUnlockSkill(
  skill: Skill,
  userProgress: {
    completedTasks: number;
    totalPoints: number;
    masteredSkills: string[];
  }
): {
  canUnlock: boolean;
  missingPrerequisites: string[];
  reasons: string[];
} {
  const reasons: string[] = [];
  const missingPrerequisites: string[] = [];
  
  // Check prerequisites
  const hasAllPrerequisites = skill.prerequisites.every(prereqId => 
    userProgress.masteredSkills.includes(prereqId)
  );
  
  if (!hasAllPrerequisites) {
    const missing = skill.prerequisites.filter(p => 
      !userProgress.masteredSkills.includes(p)
    );
    missingPrerequisites.push(...missing);
    reasons.push(`Need to master: ${missing.join(', ')}`);
  }
  
  // Check required tasks
  if (userProgress.completedTasks < skill.requiredTasks) {
    reasons.push(`Complete ${skill.requiredTasks - userProgress.completedTasks} more tasks`);
  }
  
  // Check required points
  if (userProgress.totalPoints < skill.requiredPoints) {
    reasons.push(`Earn ${skill.requiredPoints - userProgress.totalPoints} more points`);
  }
  
  const canUnlock = hasAllPrerequisites && 
                   userProgress.completedTasks >= skill.requiredTasks &&
                   userProgress.totalPoints >= skill.requiredPoints;
  
  return {
    canUnlock,
    missingPrerequisites,
    reasons
  };
}

// Unlock skill
export function unlockSkill(
  skill: Skill
): {
  updatedSkill: Skill;
  rewardPoints: number;
  message: string;
} {
  const updatedSkill: Skill = {
    ...skill,
    unlocked: true,
    unlockedAt: new Date()
  };
  
  return {
    updatedSkill,
    rewardPoints: skill.unlockReward,
    message: `🎉 ${skill.name} unlocked! +${skill.unlockReward} points`
  };
}

// Update skill progress
export function updateSkillProgress(
  skill: Skill,
  tasksCompleted: number,
  pointsEarned: number
): {
  updatedSkill: Skill;
  isMastered: boolean;
  masteryReward?: number;
} {
  const progress = Math.min(100, 
    ((tasksCompleted / skill.requiredTasks) * 50) + 
    ((pointsEarned / skill.requiredPoints) * 50)
  );
  
  const wasAlreadyMastered = skill.mastered;
  const isMastered = progress >= 100 && tasksCompleted >= skill.requiredTasks && pointsEarned >= skill.requiredPoints;
  
  const updatedSkill: Skill = {
    ...skill,
    progress,
    tasksCompleted,
    pointsEarned,
    mastered: isMastered,
    masteredAt: isMastered && !wasAlreadyMastered ? new Date() : skill.masteredAt
  };
  
  return {
    updatedSkill,
    isMastered: isMastered && !wasAlreadyMastered,
    masteryReward: isMastered && !wasAlreadyMastered ? skill.masteryReward : undefined
  };
}

// Get recommended next skill
export function getRecommendedSkill(
  skillTree: SkillTree,
  userProgress: {
    masteredSkills: string[];
    completedTasks: number;
    totalPoints: number;
  }
): Skill | null {
  // Find first unlockable skill that isn't mastered
  for (const branch of skillTree.branches) {
    for (const skill of branch.skills) {
      if (!skill.unlocked && !userProgress.masteredSkills.includes(skill.id)) {
        const unlockCheck = canUnlockSkill(skill, userProgress);
        if (unlockCheck.canUnlock) {
          return skill;
        }
      }
    }
  }
  
  return null;
}

// Calculate overall skill tree progress
export function calculateSkillTreeProgress(skillTree: SkillTree): {
  overallProgress: number;
  unlockedCount: number;
  masteredCount: number;
  availableSkills: number;
} {
  let totalProgress = 0;
  let unlockedCount = 0;
  let masteredCount = 0;
  
  skillTree.branches.forEach(branch => {
    branch.skills.forEach(skill => {
      totalProgress += skill.progress;
      if (skill.unlocked) unlockedCount++;
      if (skill.mastered) masteredCount++;
    });
  });
  
  const overallProgress = skillTree.totalSkills > 0 
    ? totalProgress / skillTree.totalSkills 
    : 0;
  
  return {
    overallProgress,
    unlockedCount,
    masteredCount,
    availableSkills: skillTree.totalSkills - unlockedCount
  };
}

// Initialize skill tree from defaults
export function initializeSkillTree(): SkillTree {
  const tree: SkillTree = {
    branches: DEFAULT_SKILL_TREE.map(branch => ({ ...branch })),
    totalSkills: 0,
    unlockedSkills: 0,
    masteredSkills: 0,
    overallProgress: 0
  };
  
  // Calculate totals
  tree.totalSkills = tree.branches.reduce((sum, branch) => sum + branch.skills.length, 0);
  tree.unlockedSkills = tree.branches.reduce((sum, branch) => 
    sum + branch.skills.filter(s => s.unlocked).length, 0
  );
  tree.masteredSkills = tree.branches.reduce((sum, branch) => 
    sum + branch.skills.filter(s => s.mastered).length, 0
  );
  
  const progressData = calculateSkillTreeProgress(tree);
  tree.overallProgress = progressData.overallProgress;
  
  return tree;
}

// Load skill tree from storage
export function loadSkillTree(userId: string): SkillTree {
  try {
    const stored = localStorage.getItem(`hypeos-skill-tree-${userId}`);
    if (stored) {
      const tree: SkillTree = JSON.parse(stored);
      // Convert date strings back to Date objects
      tree.branches.forEach(branch => {
        branch.skills.forEach(skill => {
          if (skill.unlockedAt) skill.unlockedAt = new Date(skill.unlockedAt);
          if (skill.masteredAt) skill.masteredAt = new Date(skill.masteredAt);
        });
      });
      return tree;
    }
  } catch (error) {
    console.error('Error loading skill tree:', error);
  }
  
  return initializeSkillTree();
}

// Save skill tree to storage
export function saveSkillTree(userId: string, tree: SkillTree): void {
  try {
    localStorage.setItem(`hypeos-skill-tree-${userId}`, JSON.stringify(tree));
  } catch (error) {
    console.error('Error saving skill tree:', error);
  }
}

// Update skill progress when task completed
export function updateSkillProgressFromTask(
  tree: SkillTree,
  task: { category: string; points: number }
): {
  updatedTree: SkillTree;
  unlockedSkills: Skill[];
  masteredSkills: Skill[];
  rewards: number;
} {
  const unlocked: Skill[] = [];
  const mastered: Skill[] = [];
  let totalRewards = 0;
  
  tree.branches.forEach(branch => {
    branch.skills.forEach(skill => {
      if (skill.category === task.category && skill.unlocked && !skill.mastered) {
        const oldProgress = skill.progress;
        const progressUpdate = updateSkillProgress(
          skill,
          skill.tasksCompleted + 1,
          skill.pointsEarned + task.points
        );
        
        skill.progress = progressUpdate.updatedSkill.progress;
        skill.tasksCompleted = progressUpdate.updatedSkill.tasksCompleted;
        skill.pointsEarned = progressUpdate.updatedSkill.pointsEarned;
        
        if (progressUpdate.isMastered) {
          skill.mastered = true;
          skill.masteredAt = new Date();
          mastered.push(skill);
          totalRewards += skill.masteryReward || 0;
        }
      }
    });
  });
  
  // Recalculate tree stats
  const progressData = calculateSkillTreeProgress(tree);
  tree.overallProgress = progressData.overallProgress;
  tree.unlockedSkills = progressData.unlockedCount;
  tree.masteredSkills = progressData.masteredCount;
  
  return {
    updatedTree: tree,
    unlockedSkills: unlocked,
    masteredSkills: mastered,
    rewards: totalRewards
  };
}

