/**
 * 광고 추적 이벤트 타입
 */
export type EventType = 'click' | 'landing' | 'signup' | 'purchase' | 'view' | 'custom';

/**
 * 개별 추적 이벤트
 */
export interface TraceEvent {
  id: string;
  timestamp: number;
  eventType: EventType;
  duration?: number; // 이벤트 소요 시간 (ms)
  metadata: Record<string, any>;
  status: 'success' | 'pending' | 'failed';
}

/**
 * 캠페인 정보
 */
export interface Campaign {
  id: string;
  name: string;
  source: string;      // facebook, google, instagram, naver 등
  medium: string;      // cpc, cpm, organic, social 등
  content?: string;    // 광고 콘텐츠 ID
  term?: string;       // 검색 키워드
}

/**
 * 전환 정보
 */
export interface Conversion {
  converted: boolean;
  conversionValue?: number;  // 전환 가치 (원)
  roi?: number;              // ROI (%)
  conversionTime?: number;   // 전환까지 소요 시간 (ms)
}

/**
 * 디바이스 정보
 */
export interface DeviceInfo {
  device: string;    // mobile, desktop, tablet
  os: string;        // iOS, Android, Windows, macOS 등
  browser: string;   // Chrome, Safari, Firefox 등
}

/**
 * 광고 추적 전체 정보
 */
export interface AdTrace {
  traceId: string;
  userId?: string;
  sessionId: string;
  campaign: Campaign;
  startTime: number;
  endTime?: number;
  totalDuration: number;
  events: TraceEvent[];
  conversion: Conversion;
  deviceInfo: DeviceInfo;
  referrer?: string;
  landingUrl: string;
}

/**
 * Trace 필터 옵션
 */
export interface TraceFilters {
  campaignId?: string;
  source?: string;
  medium?: string;
  converted?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  deviceType?: string;
}

/**
 * Trace 통계
 */
export interface TraceStats {
  totalTraces: number;
  totalClicks: number;
  totalConversions: number;
  conversionRate: number;
  averageROI: number;
  averageConversionTime: number; // ms
  totalRevenue: number;
}
