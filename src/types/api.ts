import { AdTrace, TraceFilters, TraceStats } from './trace';
import { CampaignStats, CampaignFilters, MarketingMetrics } from './campaign';

/**
 * API 응답 타입
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: number;
}

/**
 * 페이지네이션 정보
 */
export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination?: Pagination;
}

/**
 * Trace API 인터페이스
 * 백엔드 연동 시 사용할 API 함수 시그니처
 */
export interface TraceAPI {
  /**
   * Trace 목록 조회
   */
  getTraces(filters?: TraceFilters, page?: number, pageSize?: number): Promise<PaginatedResponse<AdTrace[]>>;

  /**
   * 특정 Trace 조회
   */
  getTraceById(traceId: string): Promise<ApiResponse<AdTrace>>;

  /**
   * Trace 통계 조회
   */
  getTraceStats(filters?: TraceFilters): Promise<ApiResponse<TraceStats>>;
}

/**
 * Campaign API 인터페이스
 */
export interface CampaignAPI {
  /**
   * 캠페인 통계 목록 조회
   */
  getCampaignStats(filters?: CampaignFilters): Promise<ApiResponse<CampaignStats[]>>;

  /**
   * 전체 마케팅 메트릭 조회
   */
  getMarketingMetrics(dateRange?: { start: Date; end: Date }): Promise<ApiResponse<MarketingMetrics>>;
}

/**
 * 날짜 범위
 */
export interface DateRange {
  start: Date;
  end: Date;
}
