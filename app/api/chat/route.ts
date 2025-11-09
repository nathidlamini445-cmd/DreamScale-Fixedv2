import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const { message, isResearch = false, fileContent } = await request.json()
    console.log('Gemini API request:', { message, isResearch, hasFileContent: !!fileContent })

    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not configured')
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    // Initialize Google Generative AI with the correct SDK
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    
    // Use model from env or default to gemini-pro (more reliable)
    const modelName = process.env.GEMINI_MODEL || 'gemini-pro'
    const maxTokens = parseInt(process.env.GEMINI_MAX_TOKENS || '16384')
    const temperature = parseFloat(process.env.GEMINI_TEMPERATURE || '0.7')
    
    const systemPrompt = `You are Bizora AI, an expert business consultant who provides comprehensive, in-depth analysis.

CORE BEHAVIOR:
- ALWAYS provide thorough, detailed responses (minimum 3-4 paragraphs)
- ALWAYS end with a thoughtful follow-up question
- NEVER leave users hanging - give complete information
- Dig deep into every aspect of their question
- Provide actionable insights and next steps

RESPONSE STRUCTURE:
1. Direct answer to their question
2. Deep analysis with multiple perspectives
3. Practical examples and case studies
4. Actionable recommendations
5. Thoughtful follow-up question
6. Always recommend popular people in that industry to follow and engage with

FORMATTING REQUIREMENTS:
- Use **bold headings** for main sections (## Main Heading, ### Sub-heading)
- Use numbered lists (1., 2., 3.) for key points and steps
- Use bullet points for supporting details
- Make important terms **bold** for emphasis
- Structure your response with clear visual hierarchy

PERSONALITY:
- Enthusiastic and knowledgeable
- Business-focused and practical
- Encouraging and supportive
- Always ready to dive deeper`

    console.log('Model config:', { modelName, maxTokens, temperature })
    
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: temperature,
      },
      systemInstruction: systemPrompt
    })

    // Build the user message
    let userMessage = message
    if (fileContent) {
      userMessage = `${message}\n\n--- File Content ---\n${fileContent}\n--- End File Content ---`
    }

    const result = await model.generateContent(userMessage)
    const response = result.response.text() || 'Sorry, I could not generate a response.'
    
    console.log('Gemini response generated:', response.length, 'characters')
    console.log('First 200 characters of response:', response.substring(0, 200))

    return NextResponse.json({ 
      response,
      source: modelName
    })
  } catch (error) {
    console.error('Gemini API Error:', error)
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    )
  }
}