import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Since RSS parsing is client-side only, return a message to use client-side hook
    return NextResponse.json({
      success: false,
      error: 'Upwork jobs must be fetched client-side. Use the useUpworkJobs hook instead.',
      jobs: []
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
