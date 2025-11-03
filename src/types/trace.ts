/**
 * 광고 추적 이벤트 타입
 */
export type EventType = 'click' | 'landing' | 'signup' | 'purchase' | 'view' | 'pageview' | 'custom';

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

  // Phase 1.1: 계층 구조 추가
  category?: string;   // 이벤트 분류 (예: "여름 프로모션", "신규 가입 이벤트")
  platform?: string;   // 플랫폼 분류 (source를 더 명확히)
  hierarchyLevel?: 'campaign' | 'adSet' | 'ad';  // 계층 레벨
  parentId?: string;   // 상위 캠페인 참조
  objective?: string;  // 캠페인 목적 (인지도, 전환, 리타겟팅)
  targetAudience?: string;  // 타겟 오디언스 정보
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
 * UTM 파라미터
 */
export interface UTMParams {
  utm_source?: string;      // 트래픽 소스 (예: google, facebook)
  utm_medium?: string;      // 매체 (예: cpc, email, social)
  utm_campaign?: string;    // 캠페인 이름
  utm_term?: string;        // 검색 키워드
  utm_content?: string;     // 광고 콘텐츠 구분자
}

/**
 * 유입 흐름 정보 (Phase 1.2)
 */
export interface ReferrerFlow {
  sourceUrl: string;           // 이전 페이지 URL
  destinationUrl: string;      // 현재 페이지 URL
  utmParams?: UTMParams;       // UTM 파라미터
  flowType: 'external' | 'internal' | 'direct';  // 유입 타입
  timestamp: number;           // 흐름 발생 시간
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

  // Phase 1.2: 유입 흐름 추적
  referrerFlows?: ReferrerFlow[];  // 페이지 간 유입 흐름 정보
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
