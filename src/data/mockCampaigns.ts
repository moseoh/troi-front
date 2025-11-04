import { CampaignStats, MarketingMetrics } from '@/types'
import { mockTraces } from './mockTraces'

/**
 * 캠페인별 통계 계산
 */
const calculateCampaignStats = (): CampaignStats[] => {
  const campaignMap = new Map<string, CampaignStats>()

  mockTraces.forEach((trace) => {
    const { campaign, conversion, totalDuration } = trace

    if (!campaignMap.has(campaign.id)) {
      campaignMap.set(campaign.id, {
        campaignId: campaign.id,
        campaignName: campaign.name,
        source: campaign.source,
        medium: campaign.medium,
        clicks: 0,
        conversions: 0,
        conversionRate: 0,
        revenue: 0,
        cost: 0,
        roi: 0,
        averageSessionDuration: 0,
      })
    }

    const stats = campaignMap.get(campaign.id)!
    stats.clicks += 1

    if (conversion.converted) {
      stats.conversions += 1
      stats.revenue += conversion.conversionValue || 0
    }

    stats.averageSessionDuration += totalDuration
  })

  // 평균 및 비율 계산
  campaignMap.forEach((stats) => {
    stats.conversionRate = stats.clicks > 0 ? (stats.conversions / stats.clicks) * 100 : 0
    stats.averageSessionDuration = stats.clicks > 0 ? stats.averageSessionDuration / stats.clicks : 0

    // 비용은 임의로 설정 (실제로는 광고 플랫폼에서 가져와야 함)
    stats.cost = stats.clicks * 2000 // 클릭당 2000원으로 가정

    stats.roi = stats.cost > 0 ? ((stats.revenue - stats.cost) / stats.cost) * 100 : 0
  })

  return Array.from(campaignMap.values())
}

/**
 * 모킹 캠페인 통계 데이터
 */
export const mockCampaignStats: CampaignStats[] = calculateCampaignStats()

/**
 * 전체 마케팅 메트릭 계산
 */
export const mockMarketingMetrics: MarketingMetrics = {
  totalClicks: mockTraces.length,
  totalConversions: mockTraces.filter((t) => t.conversion.converted).length,
  totalRevenue: mockTraces.reduce((sum, t) => sum + (t.conversion.conversionValue || 0), 0),
  totalCost: mockTraces.length * 2000, // 클릭당 2000원
  overallROI: 0, // 아래에서 계산
  averageConversionRate: 0, // 아래에서 계산
  averageConversionTime: 0, // 아래에서 계산
  topCampaigns: mockCampaignStats.sort((a, b) => b.roi - a.roi).slice(0, 5),
}

// 전체 메트릭 계산
mockMarketingMetrics.overallROI =
  mockMarketingMetrics.totalCost > 0
    ? ((mockMarketingMetrics.totalRevenue - mockMarketingMetrics.totalCost) / mockMarketingMetrics.totalCost) * 100
    : 0

mockMarketingMetrics.averageConversionRate =
  mockMarketingMetrics.totalClicks > 0
    ? (mockMarketingMetrics.totalConversions / mockMarketingMetrics.totalClicks) * 100
    : 0

const convertedTraces = mockTraces.filter((t) => t.conversion.converted)
mockMarketingMetrics.averageConversionTime =
  convertedTraces.length > 0
    ? convertedTraces.reduce((sum, t) => sum + (t.conversion.conversionTime || 0), 0) / convertedTraces.length
    : 0

/**
 * 캠페인 ID로 통계 조회
 */
export const getCampaignStatsById = (campaignId: string): CampaignStats | undefined => {
  return mockCampaignStats.find((stats) => stats.campaignId === campaignId)
}

/**
 * 소스별 캠페인 통계 조회
 */
export const getCampaignStatsBySource = (source: string): CampaignStats[] => {
  return mockCampaignStats.filter((stats) => stats.source === source)
}

/**
 * 정렬된 캠페인 통계 조회
 */
export const getSortedCampaignStats = (
  sortBy: 'clicks' | 'conversions' | 'roi' | 'revenue' = 'roi',
  sortOrder: 'asc' | 'desc' = 'desc'
): CampaignStats[] => {
  const sorted = [...mockCampaignStats].sort((a, b) => {
    const aVal = a[sortBy]
    const bVal = b[sortBy]
    return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
  })

  return sorted
}
