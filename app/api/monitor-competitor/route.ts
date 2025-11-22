import { NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

interface CompetitorMonitorData {
  competitor_name: string
  url: string
  last_checked: string
  changes_detected: {
    pricing_changes?: string[]
    new_services?: string[]
    content_updates?: string[]
    social_media_activity?: string[]
  }
  market_insights: {
    trending_topics: string[]
    competitor_mentions: number
    market_sentiment: 'positive' | 'neutral' | 'negative'
  }
  alerts: {
    type: 'pricing' | 'service' | 'content' | 'social'
    message: string
    priority: 'high' | 'medium' | 'low'
    timestamp: string
  }[]
}

export async function POST(request: Request) {
  try {
    const { competitor_urls, niche } = await request.json()

    if (!competitor_urls || competitor_urls.length === 0) {
      return NextResponse.json({ error: 'Competitor URLs are required' }, { status: 400 })
    }

    console.log(`🔍 Starting competitor monitoring for ${competitor_urls.length} competitors`)

    const monitoringResults: CompetitorMonitorData[] = []

    for (const url of competitor_urls) {
      try {
        const monitorData = await monitorCompetitor(url, niche)
        monitoringResults.push(monitorData)
      } catch (error) {
        console.error(`Error monitoring ${url}:`, error)
        // Add error entry
        monitoringResults.push({
          competitor_name: 'Unknown',
          url: url,
          last_checked: new Date().toISOString(),
          changes_detected: {},
          market_insights: {
            trending_topics: [],
            competitor_mentions: 0,
            market_sentiment: 'neutral'
          },
          alerts: [{
            type: 'content',
            message: 'Failed to monitor this competitor',
            priority: 'high',
            timestamp: new Date().toISOString()
          }]
        })
      }
    }

    return NextResponse.json({
      success: true,
      results: monitoringResults,
      summary: {
        total_competitors: competitor_urls.length,
        successful_monitors: monitoringResults.filter(r => r.alerts.length === 0 || !r.alerts.some(a => a.message.includes('Failed'))).length,
        high_priority_alerts: monitoringResults.flatMap(r => r.alerts).filter(a => a.priority === 'high').length
      }
    })

  } catch (error: any) {
    console.error('Monitoring error:', error)
    return NextResponse.json({ error: 'Failed to monitor competitors' }, { status: 500 })
  }
}

/**
 * Monitor a single competitor for changes and insights
 */
async function monitorCompetitor(url: string, niche: string): Promise<CompetitorMonitorData> {
  console.log(`📊 Monitoring competitor: ${url}`)

  // Extract domain name
  const domain = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  const competitorName = domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1)

  // Simulate monitoring data (in a real implementation, this would check for actual changes)
  const changesDetected = await detectChanges(url, niche)
  const marketInsights = await getMarketInsights(competitorName, niche)
  const alerts = generateAlerts(changesDetected, marketInsights)

  return {
    competitor_name: competitorName,
    url: url,
    last_checked: new Date().toISOString(),
    changes_detected: changesDetected,
    market_insights: marketInsights,
    alerts: alerts
  }
}

/**
 * Detect changes in competitor (simulated)
 */
async function detectChanges(url: string, niche: string) {
  // In a real implementation, this would:
  // 1. Scrape the website and compare with previous version
  // 2. Check for pricing changes
  // 3. Monitor new services or products
  // 4. Track content updates
  // 5. Monitor social media activity

  const changes = {
    pricing_changes: [] as string[],
    new_services: [] as string[],
    content_updates: [] as string[],
    social_media_activity: [] as string[]
  }

  // Simulate some changes based on niche
  if (niche.toLowerCase().includes('design')) {
    changes.pricing_changes.push('Logo design packages increased by 15%')
    changes.new_services.push('Brand strategy consultation service added')
    changes.content_updates.push('New case study published: "Modern Brand Identity"')
    changes.social_media_activity.push('Instagram post about design trends gained 500+ likes')
  } else if (niche.toLowerCase().includes('photo')) {
    changes.pricing_changes.push('Wedding photography packages reduced by 10%')
    changes.new_services.push('Drone photography service launched')
    changes.content_updates.push('Portfolio updated with new lifestyle shoots')
    changes.social_media_activity.push('Behind-the-scenes video went viral on TikTok')
  } else {
    changes.pricing_changes.push('Service pricing updated')
    changes.new_services.push('New service offering detected')
    changes.content_updates.push('Website content refreshed')
    changes.social_media_activity.push('Increased social media engagement')
  }

  return changes
}

/**
 * Get market insights for the niche
 */
async function getMarketInsights(competitorName: string, niche: string) {
  // In a real implementation, this would:
  // 1. Analyze social media mentions
  // 2. Check industry news and trends
  // 3. Monitor competitor mentions
  // 4. Analyze market sentiment

  const trendingTopics = [
    `${niche} trends 2024`,
    'Digital transformation in business',
    'Customer experience optimization',
    'Sustainable business practices'
  ]

  const competitorMentions = Math.floor(Math.random() * 100) + 50
  const sentiment = ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)] as 'positive' | 'neutral' | 'negative'

  return {
    trending_topics: trendingTopics,
    competitor_mentions: competitorMentions,
    market_sentiment: sentiment
  }
}

/**
 * Generate alerts based on detected changes
 */
function generateAlerts(changes: any, insights: any) {
  const alerts = []

  // High priority alerts
  if (changes.pricing_changes.length > 0) {
    alerts.push({
      type: 'pricing' as const,
      message: `Pricing changes detected: ${changes.pricing_changes[0]}`,
      priority: 'high' as const,
      timestamp: new Date().toISOString()
    })
  }

  if (changes.new_services.length > 0) {
    alerts.push({
      type: 'service' as const,
      message: `New service launched: ${changes.new_services[0]}`,
      priority: 'high' as const,
      timestamp: new Date().toISOString()
    })
  }

  // Medium priority alerts
  if (changes.content_updates.length > 0) {
    alerts.push({
      type: 'content' as const,
      message: `Content update: ${changes.content_updates[0]}`,
      priority: 'medium' as const,
      timestamp: new Date().toISOString()
    })
  }

  if (insights.market_sentiment === 'negative') {
    alerts.push({
      type: 'social' as const,
      message: 'Negative market sentiment detected',
      priority: 'medium' as const,
      timestamp: new Date().toISOString()
    })
  }

  // Low priority alerts
  if (changes.social_media_activity.length > 0) {
    alerts.push({
      type: 'social' as const,
      message: `Social media activity: ${changes.social_media_activity[0]}`,
      priority: 'low' as const,
      timestamp: new Date().toISOString()
    })
  }

  return alerts
}
