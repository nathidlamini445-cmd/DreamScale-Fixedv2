import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    geminiKeyExists: !!process.env.GEMINI_API_KEY,
    geminiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    geminiKeyPreview: process.env.GEMINI_API_KEY?.substring(0, 15) + '...' || 'undefined',
    geminiModel: process.env.GEMINI_MODEL || 'not set',
    geminiMaxTokens: process.env.GEMINI_MAX_TOKENS || 'not set',
    geminiTemperature: process.env.GEMINI_TEMPERATURE || 'not set',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('GEMINI'))
  })
}

