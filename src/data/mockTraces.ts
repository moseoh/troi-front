import { AdTrace, TraceEvent } from '@/types';

/**
 * 샘플 추적 이벤트 생성
 */
const createTraceEvents = (startTime: number, converted: boolean): TraceEvent[] => {
  const events: TraceEvent[] = [
    {
      id: 'event-1',
      timestamp: startTime,
      eventType: 'click',
      duration: 150,
      metadata: {
        clickPosition: { x: 320, y: 480 },
        adFormat: 'display',
      },
      status: 'success',
    },
    {
      id: 'event-2',
      timestamp: startTime + 200,
      eventType: 'landing',
      duration: 1200,
      metadata: {
        pageLoadTime: 1200,
        firstContentfulPaint: 800,
      },
      status: 'success',
    },
    {
      id: 'event-3',
      timestamp: startTime + 5000,
      eventType: 'view',
      duration: 3000,
      metadata: {
        scrollDepth: 45,
        timeOnPage: 3000,
      },
      status: 'success',
    },
  ];

  if (converted) {
    events.push(
      {
        id: 'event-4',
        timestamp: startTime + 15000,
        eventType: 'signup',
        duration: 2500,
        metadata: {
          formFillTime: 2500,
          fieldInteractions: 8,
        },
        status: 'success',
      },
      {
        id: 'event-5',
        timestamp: startTime + 25000,
        eventType: 'purchase',
        duration: 3200,
        metadata: {
          itemsInCart: 2,
          paymentMethod: 'card',
          purchaseValue: 89000,
        },
        status: 'success',
      }
    );
  }

  return events;
};

/**
 * 모킹 Trace 데이터
 */
export const mockTraces: AdTrace[] = [
  {
    traceId: 'trace-001',
    userId: 'user-12345',
    sessionId: 'sess-abc123',
    campaign: {
      id: 'camp-001',
      name: '여름 신상품 프로모션',
      source: 'facebook',
      medium: 'cpc',
      content: 'summer-new-arrival',
      term: '여름옷',
    },
    startTime: Date.now() - 3600000 * 2,
    endTime: Date.now() - 3600000 * 2 + 30000,
    totalDuration: 30000,
    events: createTraceEvents(Date.now() - 3600000 * 2, true),
    conversion: {
      converted: true,
      conversionValue: 89000,
      roi: 445,
      conversionTime: 30000,
    },
    deviceInfo: {
      device: 'mobile',
      os: 'iOS',
      browser: 'Safari',
    },
    referrer: 'https://www.facebook.com',
    landingUrl: 'https://example.com/summer-collection',
  },
  {
    traceId: 'trace-002',
    sessionId: 'sess-def456',
    campaign: {
      id: 'camp-002',
      name: '구글 검색 광고',
      source: 'google',
      medium: 'cpc',
      term: '운동화 추천',
    },
    startTime: Date.now() - 3600000,
    endTime: Date.now() - 3600000 + 8000,
    totalDuration: 8000,
    events: createTraceEvents(Date.now() - 3600000, false),
    conversion: {
      converted: false,
    },
    deviceInfo: {
      device: 'desktop',
      os: 'Windows',
      browser: 'Chrome',
    },
    referrer: 'https://www.google.com',
    landingUrl: 'https://example.com/sneakers',
  },
  {
    traceId: 'trace-003',
    userId: 'user-67890',
    sessionId: 'sess-ghi789',
    campaign: {
      id: 'camp-003',
      name: '인스타그램 스토리 광고',
      source: 'instagram',
      medium: 'cpm',
      content: 'story-ad-001',
    },
    startTime: Date.now() - 1800000,
    endTime: Date.now() - 1800000 + 45000,
    totalDuration: 45000,
    events: createTraceEvents(Date.now() - 1800000, true),
    conversion: {
      converted: true,
      conversionValue: 125000,
      roi: 520,
      conversionTime: 45000,
    },
    deviceInfo: {
      device: 'mobile',
      os: 'Android',
      browser: 'Chrome',
    },
    referrer: 'https://www.instagram.com',
    landingUrl: 'https://example.com/premium-collection',
  },
  {
    traceId: 'trace-004',
    sessionId: 'sess-jkl012',
    campaign: {
      id: 'camp-004',
      name: '네이버 쇼핑 광고',
      source: 'naver',
      medium: 'cpc',
      term: '백팩',
    },
    startTime: Date.now() - 900000,
    endTime: Date.now() - 900000 + 5000,
    totalDuration: 5000,
    events: createTraceEvents(Date.now() - 900000, false),
    conversion: {
      converted: false,
    },
    deviceInfo: {
      device: 'mobile',
      os: 'Android',
      browser: 'Samsung Internet',
    },
    referrer: 'https://shopping.naver.com',
    landingUrl: 'https://example.com/backpacks',
  },
  {
    traceId: 'trace-005',
    userId: 'user-11111',
    sessionId: 'sess-mno345',
    campaign: {
      id: 'camp-001',
      name: '여름 신상품 프로모션',
      source: 'facebook',
      medium: 'cpc',
      content: 'summer-new-arrival',
      term: '여름패션',
    },
    startTime: Date.now() - 600000,
    endTime: Date.now() - 600000 + 28000,
    totalDuration: 28000,
    events: createTraceEvents(Date.now() - 600000, true),
    conversion: {
      converted: true,
      conversionValue: 67000,
      roi: 335,
      conversionTime: 28000,
    },
    deviceInfo: {
      device: 'desktop',
      os: 'macOS',
      browser: 'Safari',
    },
    referrer: 'https://www.facebook.com',
    landingUrl: 'https://example.com/summer-collection',
  },
  {
    traceId: 'trace-006',
    sessionId: 'sess-pqr678',
    campaign: {
      id: 'camp-005',
      name: '유튜브 동영상 광고',
      source: 'youtube',
      medium: 'video',
      content: 'video-ad-001',
    },
    startTime: Date.now() - 300000,
    endTime: Date.now() - 300000 + 12000,
    totalDuration: 12000,
    events: createTraceEvents(Date.now() - 300000, false),
    conversion: {
      converted: false,
    },
    deviceInfo: {
      device: 'mobile',
      os: 'iOS',
      browser: 'Safari',
    },
    referrer: 'https://www.youtube.com',
    landingUrl: 'https://example.com/video-promo',
  },
  {
    traceId: 'trace-007',
    userId: 'user-22222',
    sessionId: 'sess-stu901',
    campaign: {
      id: 'camp-002',
      name: '구글 검색 광고',
      source: 'google',
      medium: 'cpc',
      term: '스니커즈',
    },
    startTime: Date.now() - 7200000,
    endTime: Date.now() - 7200000 + 35000,
    totalDuration: 35000,
    events: createTraceEvents(Date.now() - 7200000, true),
    conversion: {
      converted: true,
      conversionValue: 145000,
      roi: 625,
      conversionTime: 35000,
    },
    deviceInfo: {
      device: 'desktop',
      os: 'Windows',
      browser: 'Edge',
    },
    referrer: 'https://www.google.com',
    landingUrl: 'https://example.com/sneakers',
  },
  {
    traceId: 'trace-008',
    sessionId: 'sess-vwx234',
    campaign: {
      id: 'camp-006',
      name: '카카오톡 광고',
      source: 'kakao',
      medium: 'display',
      content: 'kakao-banner-001',
    },
    startTime: Date.now() - 10800000,
    endTime: Date.now() - 10800000 + 6000,
    totalDuration: 6000,
    events: createTraceEvents(Date.now() - 10800000, false),
    conversion: {
      converted: false,
    },
    deviceInfo: {
      device: 'mobile',
      os: 'Android',
      browser: 'KakaoTalk',
    },
    referrer: 'https://www.kakaocorp.com',
    landingUrl: 'https://example.com/special-offer',
  },
  {
    traceId: 'trace-009',
    userId: 'user-33333',
    sessionId: 'sess-yza567',
    campaign: {
      id: 'camp-003',
      name: '인스타그램 스토리 광고',
      source: 'instagram',
      medium: 'cpm',
      content: 'story-ad-002',
    },
    startTime: Date.now() - 14400000,
    endTime: Date.now() - 14400000 + 38000,
    totalDuration: 38000,
    events: createTraceEvents(Date.now() - 14400000, true),
    conversion: {
      converted: true,
      conversionValue: 98000,
      roi: 490,
      conversionTime: 38000,
    },
    deviceInfo: {
      device: 'mobile',
      os: 'iOS',
      browser: 'Instagram',
    },
    referrer: 'https://www.instagram.com',
    landingUrl: 'https://example.com/new-arrivals',
  },
  {
    traceId: 'trace-010',
    sessionId: 'sess-bcd890',
    campaign: {
      id: 'camp-007',
      name: '트위터 프로모션',
      source: 'twitter',
      medium: 'cpc',
      content: 'tweet-promo-001',
    },
    startTime: Date.now() - 18000000,
    endTime: Date.now() - 18000000 + 9000,
    totalDuration: 9000,
    events: createTraceEvents(Date.now() - 18000000, false),
    conversion: {
      converted: false,
    },
    deviceInfo: {
      device: 'desktop',
      os: 'Windows',
      browser: 'Firefox',
    },
    referrer: 'https://twitter.com',
    landingUrl: 'https://example.com/twitter-special',
  },
];

/**
 * Trace ID로 특정 Trace 조회
 */
export const getTraceById = (traceId: string): AdTrace | undefined => {
  return mockTraces.find(trace => trace.traceId === traceId);
};

/**
 * 필터링된 Trace 목록 조회
 */
export const getFilteredTraces = (filters?: {
  campaignId?: string;
  source?: string;
  converted?: boolean;
}): AdTrace[] => {
  if (!filters) return mockTraces;

  return mockTraces.filter(trace => {
    if (filters.campaignId && trace.campaign.id !== filters.campaignId) {
      return false;
    }
    if (filters.source && trace.campaign.source !== filters.source) {
      return false;
    }
    if (filters.converted !== undefined && trace.conversion.converted !== filters.converted) {
      return false;
    }
    return true;
  });
};
