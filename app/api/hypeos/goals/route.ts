import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with real database
let mockGoals = [
  {
    id: 1,
    userId: 'user1',
    title: 'Earn R10k/month',
    description: 'Build a sustainable business that generates R10,000 monthly revenue',
    category: 'revenue',
    timeline: '6-months',
    targetValue: 'R10,000',
    currentValue: 'R2,500',
    progress: 25,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    phases: [
      {
        name: 'Foundation',
        weeks: '1-4',
        milestones: ['Define target audience', 'Create core offers', 'Build landing page'],
        dailyTasks: ['Research competitor pricing', 'Write value proposition', 'Design service package']
      }
    ]
  }
];

let mockTasks = [
  {
    id: 1,
    goalId: 1,
    title: 'Post 3 TikToks',
    description: 'Create and post 3 engaging TikTok videos',
    impact: 'medium',
    category: 'content',
    points: 150,
    completed: false,
    dueDate: new Date(),
    createdAt: new Date()
  },
  {
    id: 2,
    goalId: 1,
    title: 'Email 5 potential clients',
    description: 'Send personalized emails to 5 potential clients',
    impact: 'high',
    category: 'sales',
    points: 300,
    completed: false,
    dueDate: new Date(),
    createdAt: new Date()
  }
];

let mockUser = {
  id: 'user1',
  name: 'Alex',
  email: 'alex@example.com',
  level: 7,
  hypePoints: 2450,
  currentStreak: 12,
  longestStreak: 28,
  totalDaysActive: 45,
  createdAt: new Date('2024-01-01')
};

// GET /api/hypeos/goals
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user1';
    
    const userGoals = mockGoals.filter(goal => goal.userId === userId);
    
    return NextResponse.json({
      success: true,
      data: userGoals
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch goals' },
      { status: 500 }
    );
  }
}

// POST /api/hypeos/goals
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, description, category, timeline, targetValue, currentValue } = body;
    
    const newGoal = {
      id: mockGoals.length + 1,
      userId,
      title,
      description,
      category,
      timeline,
      targetValue,
      currentValue,
      progress: 0,
      status: 'active',
      createdAt: new Date(),
      phases: []
    };
    
    mockGoals.push(newGoal);
    
    return NextResponse.json({
      success: true,
      data: newGoal
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create goal' },
      { status: 500 }
    );
  }
}

// PUT /api/hypeos/goals/[id]
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    const goalIndex = mockGoals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    mockGoals[goalIndex] = { ...mockGoals[goalIndex], ...updates };
    
    return NextResponse.json({
      success: true,
      data: mockGoals[goalIndex]
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

// DELETE /api/hypeos/goals/[id]
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    const goalIndex = mockGoals.findIndex(goal => goal.id === id);
    if (goalIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Goal not found' },
        { status: 404 }
      );
    }
    
    mockGoals.splice(goalIndex, 1);
    
    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}
