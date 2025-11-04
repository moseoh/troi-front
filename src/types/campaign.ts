/**
 * 캠페인 통계
 */
export interface CampaignStats {
  campaignId: string
  campaignName: string
  source: string
  medium: string
  clicks: number
  conversions: number
  conversionRate: number
  revenue: number
  cost: number
  roi: number
  averageSessionDuration: number
}

/**
 * 캠페인 목록 필터
 */
export interface CampaignFilters {
  source?: string
  medium?: string
  dateRange?: {
    start: Date
    end: Date
  }
  sortBy?: 'clicks' | 'conversions' | 'roi' | 'revenue'
  sortOrder?: 'asc' | 'desc'
}

/**
 * 전체 마케팅 메트릭
 */
export interface MarketingMetrics {
  totalClicks: number
  totalConversions: number
  totalRevenue: number
  totalCost: number
  overallROI: number
  averageConversionRate: number
  averageConversionTime: number
  topCampaigns: CampaignStats[]
}
