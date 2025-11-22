import { NextRequest, NextResponse } from 'next/server';

// Mock data - replace with real database
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
    createdAt: new Date(),
    completedAt: null
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
    createdAt: new Date(),
    completedAt: null
  },
  {
    id: 3,
    goalId: 1,
    title: 'Update pricing page',
    description: 'Review and update pricing information on website',
    impact: 'medium',
    category: 'admin',
    points: 200,
    completed: false,
    dueDate: new Date(),
    createdAt: new Date(),
    completedAt: null
  }
];

let mockMiniWins = [
  {
    id: 1,
    title: 'Check analytics',
    description: 'Review daily analytics and metrics',
    points: 25,
    time: '2 min',
    category: 'admin',
    difficulty: 'easy',
    completed: false,
    createdAt: new Date()
  },
  {
    id: 2,
    title: 'Reply to comments',
    description: 'Respond to social media comments',
    points: 30,
    time: '3 min',
    category: 'social',
    difficulty: 'easy',
    completed: false,
    createdAt: new Date()
  },
  {
    id: 3,
    title: 'Update bio',
    description: 'Refresh social media bio',
    points: 20,
    time: '1 min',
    category: 'admin',
    difficulty: 'easy',
    completed: false,
    createdAt: new Date()
  }
];

// GET /api/hypeos/tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');
    const type = searchParams.get('type') || 'all'; // 'tasks', 'mini-wins', 'all'
    const date = searchParams.get('date');
    
    let tasks = mockTasks;
    let miniWins = mockMiniWins;
    
    // Filter by goal ID
    if (goalId) {
      tasks = tasks.filter(task => task.goalId === parseInt(goalId));
    }
    
    // Filter by date (simplified - in real app, you'd filter by due date)
    if (date) {
      const targetDate = new Date(date);
      // Mock filtering by date
    }
    
    const response: any = { success: true };
    
    if (type === 'tasks' || type === 'all') {
      response.tasks = tasks;
    }
    
    if (type === 'mini-wins' || type === 'all') {
      response.miniWins = miniWins;
    }
    
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

// POST /api/hypeos/tasks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, title, description, impact, category, points, type = 'task', howToComplete } = body;
    
    if (type === 'mini-win') {
      const newMiniWin = {
        id: mockMiniWins.length + 1,
        title,
        description,
        points: points || 25,
        time: '2 min',
        category: category || 'admin',
        difficulty: 'easy',
        completed: false,
        createdAt: new Date()
      };
      
      mockMiniWins.push(newMiniWin);
      
      return NextResponse.json({
        success: true,
        data: newMiniWin
      });
    } else {
      const newTask = {
        id: mockTasks.length + 1,
        goalId,
        title,
        description,
        impact: impact || 'medium',
        category: category || 'admin',
        points: points || 100,
        completed: false,
        dueDate: new Date(),
        createdAt: new Date(),
        completedAt: null,
        howToComplete: howToComplete || [] // Store step-by-step instructions
      };
      
      mockTasks.push(newTask);
      
      return NextResponse.json({
        success: true,
        data: newTask
      });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create task' },
      { status: 500 }
    );
  }
}

// PUT /api/hypeos/tasks/[id]
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    
    // Check if it's a task or mini-win
    let taskIndex = mockTasks.findIndex(task => task.id === id);
    let miniWinIndex = mockMiniWins.findIndex(win => win.id === id);
    
    if (taskIndex !== -1) {
      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
      
      // If completing a task, set completion time
      if (updates.completed && !mockTasks[taskIndex].completedAt) {
        mockTasks[taskIndex].completedAt = new Date();
      }
      
      return NextResponse.json({
        success: true,
        data: mockTasks[taskIndex]
      });
    } else if (miniWinIndex !== -1) {
      mockMiniWins[miniWinIndex] = { ...mockMiniWins[miniWinIndex], ...updates };
      
      return NextResponse.json({
        success: true,
        data: mockMiniWins[miniWinIndex]
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// DELETE /api/hypeos/tasks/[id]
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '0');
    
    // Check if it's a task or mini-win
    let taskIndex = mockTasks.findIndex(task => task.id === id);
    let miniWinIndex = mockMiniWins.findIndex(win => win.id === id);
    
    if (taskIndex !== -1) {
      mockTasks.splice(taskIndex, 1);
    } else if (miniWinIndex !== -1) {
      mockMiniWins.splice(miniWinIndex, 1);
    } else {
      return NextResponse.json(
        { success: false, error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete task' },
      { status: 500 }
    );
  }
}
