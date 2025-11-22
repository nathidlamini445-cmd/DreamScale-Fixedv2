import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

interface QuestionnaireData {
  competitorUrl: string  // Now it's a social media profile URL
  contentNiche: string
  targetAudience: string[]
  postingFrequency: string
  contentFormats: string[]
  uniqueStyle: string
  weaknesses: string
  engagementTactics: string[]
  monetization: string[]
  contentRating: {
    videoQuality: number
    editing: number
    storytelling: number
    consistency: number
  }
  yourAdvantage: string
}

export async function POST(request: Request) {
  try {
    const data: QuestionnaireData = await request.json()
    
    if (!data.competitorUrl || !data.contentNiche) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
    }

    // Debug: Log all environment variables related to Gemini
    console.log('🔍 Environment Check:')
    console.log('  GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)
    console.log('  GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length || 0)
    console.log('  GEMINI_API_KEY first 10 chars:', process.env.GEMINI_API_KEY?.substring(0, 10) || 'undefined')
    console.log('  GEMINI_MODEL:', process.env.GEMINI_MODEL)
    console.log('  GEMINI_MAX_TOKENS:', process.env.GEMINI_MAX_TOKENS)
    
    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables')
      const fallbackAnalysis = generateFallbackAnalysis(data)
      return NextResponse.json({ 
        analysis: fallbackAnalysis,
        warning: 'API key not configured. Using fallback analysis.'
      })
    }

    console.log(`🧠 Starting Gemini analysis for: ${data.competitorUrl}`)
    console.log('API Key available:', !!process.env.GEMINI_API_KEY)
    
    try {
      const analysis = await performGeminiAnalysis(data)
      return NextResponse.json({ analysis })
    } catch (analysisError: any) {
      console.error('❌ Error in performGeminiAnalysis:', analysisError)
      console.error('Error message:', analysisError?.message)
      console.error('Error stack:', analysisError?.stack)
      // Re-throw to be caught by outer catch
      throw analysisError
    }
    
  } catch (error: any) {
    console.error('❌ Analysis error:', error)
    
    // If Gemini fails, try to provide a fallback analysis
    // Return error - no data available for fallback
    return NextResponse.json({ 
      error: 'Analysis failed. Please try again.',
      details: error.message 
    }, { status: 500 })
  }
}

async function performGeminiAnalysis(data: QuestionnaireData): Promise<string> {
  // Initialize genAI with the API key (do this here so it always uses current env vars)
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  
  // Use the model from environment variables (consistent with other routes)
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash"
  console.log('🔍 Using model:', modelName)
  console.log('🔍 Max tokens:', process.env.GEMINI_MAX_TOKENS || "16384")
  const model = genAI.getGenerativeModel({ 
    model: modelName,
    generationConfig: {
      maxOutputTokens: parseInt(process.env.GEMINI_MAX_TOKENS || "16384"),
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE || "0.7"),
    }
  })
  
  const prompt = `
You are a senior social media strategy analyst with expertise in content creator analysis and competitive positioning. Provide a comprehensive analysis for this social media creator.

CREATOR: ${data.competitorUrl}
CONTENT NICHE: ${data.contentNiche}
TARGET AUDIENCE: ${data.targetAudience.join(', ')}
POSTING FREQUENCY: ${data.postingFrequency}
CONTENT FORMATS: ${data.contentFormats.join(', ')}
UNIQUE STYLE: ${data.uniqueStyle}
WEAKNESSES: ${data.weaknesses}
ENGAGEMENT TACTICS: ${data.engagementTactics.join(', ')}
MONETIZATION STRATEGY: ${data.monetization.join(', ')}
CONTENT RATINGS: Video Quality ${data.contentRating.videoQuality}/5, Editing ${data.contentRating.editing}/5, Storytelling ${data.contentRating.storytelling}/5, Consistency ${data.contentRating.consistency}/5
YOUR COMPETITIVE ADVANTAGE: ${data.yourAdvantage}

Provide a detailed analysis with these sections:

## Executive Summary
Strategic assessment of this creator's content strategy, audience positioning, and key strengths/weaknesses. Include specific insights about their competitive positioning in their niche.

## Competitive Warfare Analysis
Provide aggressive competitive intelligence:
- **Market Position:** Where they stand in the competitive landscape
- **Vulnerable Weaknesses:** Their biggest strategic gaps you can exploit
- **Defensive Strength:** What they do well that you need to neutralize or improve upon
- **Market Share Capture:** Tactical strategies to take their audience
- **Response Capability:** How likely they can counter your competitive moves

## Content Strategy Analysis
- What makes their content stand out in their niche
- How their posting frequency affects their reach
- Content format strategy and effectiveness
- Engagement tactics and audience interaction patterns
- **Content gaps** where they're underserving their audience

## Target Audience Deep Dive
- Demographic analysis: ${data.targetAudience.join(', ')}
- How well their content resonates with this audience
- Audience retention and growth potential
- **Untapped audience segments** you can capture
- **Audience acquisition tactics** to poach their followers

## Content Quality Assessment
- **Video/Photo Quality**: ${data.contentRating.videoQuality}/5 - analyze their production value
- **Editing Skills**: ${data.contentRating.editing}/5 - assess their editing techniques
- **Storytelling**: ${data.contentRating.storytelling}/5 - evaluate their narrative skills
- **Posting Consistency**: ${data.contentRating.consistency}/5 - analyze their content schedule effectiveness
- Overall content strategy strengths and gaps
- **Specific quality benchmarks** you must exceed to dominate

## Unique Style & Branding
${data.uniqueStyle}
Analyze their unique positioning and how it creates competitive moats in their niche.

## Weakness Exploitation Strategy
**Identified Weaknesses:** ${data.weaknesses}

For each section below, provide COMPLETE, DETAILED tactical strategies. CRITICAL: Every numbered item MUST include a full explanation.

**Primary Attack Vectors:**
Provide 3-5 specific weaknesses to exploit immediately. For each point, include:
• The exact weakness (what it is)
• Why this makes them strategically vulnerable
• Concrete steps on how to exploit this weakness

**Quick Strike Tactics:**
Provide 3-5 actions you can take THIS WEEK to outcompete them. For each numbered point, include:
• The specific actionable tactic
• Why this will be effective against their current strategy
• Implementation details or next steps
**CRITICAL: You MUST provide complete descriptions for all numbered items. Do not truncate or leave any tactic incomplete.**

**Gap Exploitation:**
How to capitalize on areas where they fail. For each point:
• The specific gap they leave open
• How you can fill this gap better than them
• The competitive advantage this creates for you

**Tactical Positioning:**
Content strategies that highlight their flaws while showcasing your strengths. For each point:
• The specific content angle or positioning move
• How this contrasts with their weaknesses
• How it elevates your brand in comparison
## Superior Content Strategies to Dominate
Based on analyzing their approach, create a battle plan:
- **Content angles they miss** - Topics and perspectives you should cover
- **Content formats they underutilize** - Formats where you can excel
- **Posting schedule advantages** - How to out-frequent or out-quality them
- **Niche depth opportunities** - Underserved sub-niches you can own
- **Platform diversification** - Platforms they ignore that you can dominate

## Monetization Intelligence
**Current Monetization:** ${data.monetization.join(', ')}
- Sophistication of their revenue strategy
- Revenue stream diversification analysis
- **Monetization gaps** they're leaving on the table
- **Higher-value monetization strategies** you can implement
- **Premium positioning tactics** to command better rates
- **Revenue capture timeline** - When you can realistically outearn them

## Engagement Strategy Analysis
**Tactics Used:** ${data.engagementTactics.join(', ')}
- Effectiveness of their engagement approach
- Audience interaction patterns
- Community building strengths and gaps
- **Superior engagement tactics** to build stronger audience relationships
- **Community building strategies** to create more loyal fans
- **Engagement loopholes** where you can outperform their metrics

## Strategic Differentiation Roadmap
Based on your advantage: "${data.yourAdvantage}"
- How to position yourself as the **definitive superior** creator
- Unique value propositions to emphasize and own
- Content strategies to win and convert their audience
- **Competitive moat building** - How to create advantages they can't replicate
- **Response planning** - How to react when they copy your strategies

## 15 Specific Tactics to Dominate Your Competition
Provide a single numbered list of 15 highly actionable, immediately implementable tactics:

Use this format:
1. [First content creation tactic]
2. [Second content creation tactic]
3. [Third content creation tactic]
4. [Fourth content creation tactic]
5. [Fifth content creation tactic]
6. [First audience acquisition tactic]
7. [Second audience acquisition tactic]
8. [Third audience acquisition tactic]
9. [First engagement domination tactic]
10. [Second engagement domination tactic]
11. [Third engagement domination tactic]
12. [First monetization tactic]
13. [Second monetization tactic]
14. [First brand positioning tactic]
15. [Second brand positioning tactic]

Cover: 5 content creation strategies, 3 audience acquisition strategies, 3 engagement tactics, 2 monetization strategies, and 2 brand positioning strategies. Use ONE continuous numbered list from 1 to 15. **CRITICAL: You MUST complete all 15 items. Do not truncate or cut off the list.**

## Attack Timeline & Priorities

**Week 1-2: Quick Dominance Moves**
- Immediate content wins you can execute
- Low-hanging fruit in their weaknesses
- Fast audience capture opportunities

**Month 1: Defensive Positioning**
- Strengthening your competitive moat
- Matching or exceeding their strengths
- Building audience loyalty

**Months 2-3: Market Leadership**
- Becoming the authority they can't match
- Owning specific content angles they ignore
- Developing unique positioning they can't replicate

**Months 4-6: Market Domination**
- Establishing as the dominant creator in the niche
- Diversifying beyond their capabilities
- Building systems that scale beyond their operation

## Competitive Intelligence Framework

**Daily Monitoring Checklist**
- Key metrics to track: ${data.competitorUrl}
- Red flags that signal they're adapting to your strategy
- Content performance indicators to watch
- Audience migration signals to detect

**Weekly Competitive Analysis**
- Content themes they're testing
- New engagement tactics they're trying
- Monetization changes to watch for
- Audience sentiment shifts

**Monthly Strategic Review**
- Market share changes
- New competitive threats
- Opportunity gaps to exploit
- Strategic pivot recommendations

## Winning Action Plan Summary
**Your Path to Victory:**
1. **Immediate Actions (This Week):** List 3-5 things to do right now
2. **30-Day Game Plan:** Specific objectives to achieve in the next month
3. **90-Day Dominance Strategy:** How to establish market leadership
4. **6-Month Vision:** Becoming the undisputed authority in your niche

Be specific, data-driven, and actionable. Focus on measurable creator success metrics and strategic insights that drive real competitive advantage in social media.

**MANDATORY: Complete ALL sections fully. Do not truncate any lists. Ensure the "15 Specific Tactics" section has exactly 15 complete items numbered 1-15.**

CRITICAL FORMATTING REQUIREMENTS:
- **ALWAYS format content using bullet points with bold key terms**
- Use this format: • **Bold Term:** Description or analysis
- **Example:** • **Video Quality:** Clean, well-lit production with high-quality cameras that maintains relatability
- **DO NOT write long paragraphs.** Use concise bullet points with bold terms
- Each section should use bullet points throughout, not paragraph blocks
- Use numbered lists (1., 2., 3.) only for sequential steps or rankings
- **IMPORTANT:** When creating subsections within a section, use bullet points (•) not numbered lists to avoid duplicate numbering
- Keep each bullet point to 2-3 short sentences maximum
- Break complex ideas into multiple bullet points
- Make content scannable and visually consistent across all sections
`

  try {
    // Set timeout to 120 seconds for complex analyses (enough time for thinking models)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Analysis timeout after 120 seconds')), 120000)
    })
    
    console.log('Starting Gemini API call...')
    console.log('⏱️ Timeout set to 120 seconds to allow for thinking/analysis time')
    
    // Start the API call
    const analysisPromise = model.generateContent(prompt)
    
    // Wait for either the result or timeout (whichever comes first)
    const result = await Promise.race([analysisPromise, timeoutPromise]) as any
    const response = await result.response
    const text = response.text()
    
    console.log('✅ Gemini API response received, length:', text.length)
    console.log('⏱️ Analysis completed successfully')
    return text
  } catch (error: any) {
    console.error('❌ Gemini API error:', error)
    console.error('Error name:', error?.name)
    console.error('Error message:', error?.message)
    console.error('Error stack:', error?.stack)
    
    // Return a fallback analysis if API fails
    if (error.message.includes('timeout')) {
      console.log('API timed out, using fallback analysis')
      return generateFallbackAnalysis(data)
    }
    
    // Check for API key issues
    if (error.message.includes('API_KEY') || error.message.includes('authentication') || error.message.includes('401') || error.message.includes('403')) {
      console.error('API key issue detected:', error.message)
      return generateFallbackAnalysis(data)
    }
    
    console.log('Using fallback analysis due to error:', error.message)
    // Log the full error for debugging
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    return generateFallbackAnalysis(data)
  }
}

function generateFallbackAnalysis(data: QuestionnaireData): string {
  return `# Social Media Creator Analysis for ${data.competitorUrl}

## Executive Summary
This creator operates in the **${data.contentNiche}** niche and targets **${data.targetAudience.join(', ')}**.

**Key Details:**
• Content niche: ${data.contentNiche}
• Target audience: ${data.targetAudience.join(', ')}
• Posting frequency: ${data.postingFrequency}
• Content formats: ${data.contentFormats.join(', ')}
• Unique style: ${data.uniqueStyle}
• Weaknesses: ${data.weaknesses}
• Engagement tactics: ${data.engagementTactics.join(', ')}
• Monetization: ${data.monetization.join(', ')}
• Content ratings: Video ${data.contentRating.videoQuality}/5, Editing ${data.contentRating.editing}/5, Storytelling ${data.contentRating.storytelling}/5, Consistency ${data.contentRating.consistency}/5
• Your advantage: ${data.yourAdvantage}

## Content Strategy Analysis
This creator focuses on ${data.contentNiche} content targeting ${data.targetAudience.join(', ')}. Their posting frequency is ${data.postingFrequency} and they create ${data.contentFormats.join(', ')}.

## Competitive Insights
Their unique style is: ${data.uniqueStyle}

**Areas to exploit:**
${data.weaknesses ? `• ${data.weaknesses.split('\n').join('\n• ')}` : '• Limited weaknesses identified'}

**Your Competitive Advantage:**
${data.yourAdvantage || 'Not specified'}

## Recommendations
1. Focus on improving your ${data.contentRating.videoQuality < 4 ? 'video quality' : 'storytelling'}
2. ${data.contentRating.editing < 4 ? 'Enhance your editing skills to match their level' : 'Continue creating high-quality content'}
3. Leverage your advantage: ${data.yourAdvantage || 'Build on your unique strengths'}
4. Explore additional monetization strategies beyond ${data.monetization.join(', ')}
5. Improve engagement through ${data.engagementTactics.length > 0 ? 'better implementation of' : ''} ${data.engagementTactics.join(', ') || 'direct audience interaction'}

*This is a fallback analysis. For more detailed AI-powered insights, ensure your GEMINI_API_KEY is configured.*`
}
