import { NextResponse } from 'next/server'
import axios from 'axios'
import * as cheerio from 'cheerio'

interface ScrapeResult {
  success: boolean
  method: 'scraped' | 'failed' | 'blocked'
  dataQuality: number
  preFillData: {
    valueProposition?: string
    keyFeatures?: string[]
    pricing?: string
    trustSignals?: string[]
  }
  message: string
}

export async function POST(request: Request) {
  try {
    const { competitorUrl } = await request.json()
    
    if (!competitorUrl) {
      return NextResponse.json({ error: 'Competitor URL is required' }, { status: 400 })
    }

    // Normalize URL
    const normalizedUrl = competitorUrl.startsWith('http') ? competitorUrl : `https://${competitorUrl}`
    
    console.log(`🔍 Starting initial scrape for: ${normalizedUrl}`)
    
    const result = await attemptScraping(normalizedUrl)
    
    return NextResponse.json(result)
    
  } catch (error: any) {
    console.error('❌ Scraping error:', error)
    return NextResponse.json({
      success: false,
      method: 'failed',
      dataQuality: 0,
      preFillData: {},
      message: 'Failed to analyze website. Please fill in the form manually.'
    })
  }
}

async function attemptScraping(url: string): Promise<ScrapeResult> {
  try {
    // Attempt to scrape with realistic headers
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    })

    const $ = cheerio.load(response.data)
    
    // Extract data
    const extractedData = extractWebsiteData($, url)
    const dataQuality = calculateDataQuality(extractedData)
    
    if (dataQuality < 30) {
      return {
        success: false,
        method: 'failed',
        dataQuality,
        preFillData: {},
        message: 'Limited data found. Please fill in the form manually.'
      }
    }

    return {
      success: true,
      method: 'scraped',
      dataQuality,
      preFillData: extractedData,
      message: `Successfully analyzed ${url}. We found some information to pre-fill your form.`
    }

  } catch (error: any) {
    console.error('Scraping failed:', error.message)
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return {
        success: false,
        method: 'blocked',
        dataQuality: 0,
        preFillData: {},
        message: 'Website is protected or slow to respond. Please fill in the form manually.'
      }
    }
    
    if (error.response?.status === 403 || error.response?.status === 429) {
      return {
        success: false,
        method: 'blocked',
        dataQuality: 0,
        preFillData: {},
        message: 'Access blocked by website. Please fill in the form manually.'
      }
    }

    return {
      success: false,
      method: 'failed',
      dataQuality: 0,
      preFillData: {},
      message: 'Unable to analyze website. Please fill in the form manually.'
    }
  }
}

function extractWebsiteData($: cheerio.CheerioAPI, url: string) {
  const data: any = {}
  
  // Extract value proposition from h1, meta description, or title
  const h1 = $('h1').first().text().trim()
  const metaDescription = $('meta[name="description"]').attr('content') || ''
  const title = $('title').text().trim()
  
  data.valueProposition = h1 || metaDescription || title || ''
  
  // Extract features from common patterns
  const features: string[] = []
  $('h2, h3').each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 10 && text.length < 100 && 
        (text.toLowerCase().includes('feature') || 
         text.toLowerCase().includes('benefit') ||
         text.toLowerCase().includes('advantage'))) {
      features.push(text)
    }
  })
  
  // Also look for list items that might be features
  $('ul li, ol li').each((_, el) => {
    const text = $(el).text().trim()
    if (text.length > 15 && text.length < 80) {
      features.push(text)
    }
  })
  
  data.keyFeatures = [...new Set(features)].slice(0, 5)
  
  // Extract pricing information
  const pricingText = $('*').text().toLowerCase()
  const pricingMatches = pricingText.match(/\$[\d,]+(?:\.\d{2})?(?:\s*(?:per|\/)\s*(?:month|year|user|seat))?/g)
  if (pricingMatches) {
    data.pricing = pricingMatches.slice(0, 3).join(', ')
  }
  
  // Extract trust signals
  const trustSignals: string[] = []
  if ($('[class*="testimonial"], [class*="review"]').length > 0) trustSignals.push('Testimonials')
  if ($('[class*="case-study"], [class*="casestudy"]').length > 0) trustSignals.push('Case Studies')
  if ($('[class*="award"], [class*="badge"]').length > 0) trustSignals.push('Awards')
  if ($('[class*="press"], [class*="media"]').length > 0) trustSignals.push('Press')
  if ($('*').text().toLowerCase().includes('guarantee')) trustSignals.push('Guarantee')
  if ($('[class*="security"], [class*="ssl"]').length > 0) trustSignals.push('Security Badges')
  
  data.trustSignals = trustSignals
  
  return data
}

function calculateDataQuality(data: any): number {
  let score = 0
  
  if (data.valueProposition && data.valueProposition.length > 20) score += 25
  if (data.keyFeatures && data.keyFeatures.length > 0) score += 25
  if (data.pricing) score += 20
  if (data.trustSignals && data.trustSignals.length > 0) score += 15
  
  // Bonus for comprehensive data
  if (data.valueProposition && data.keyFeatures && data.pricing) score += 15
  
  return Math.min(score, 100)
}
