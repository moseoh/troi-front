import { AdTrace, TraceEvent, ReferrerFlow } from '@/types'

/**
 * 고정 기준 타임스탬프 (hydration 오류 방지)
 * 2024년 10월 27일 기준
 */
const BASE_TIMESTAMP = 1730000000000

/**
 * 샘플 추적 이벤트 생성
 * seed를 사용하여 deterministic한 값을 생성합니다
 */
const createTraceEvents = (
  startTime: number,
  converted: boolean,
  eventCount: number = 3,
  seed: number = 0
): TraceEvent[] => {
  // 간단한 seeded random 함수
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000
    return x - Math.floor(x)
  }

  const events: TraceEvent[] = [
    {
      id: 'event-1',
      timestamp: startTime,
      eventType: 'click',
      duration: 100 + seededRandom(seed + 1) * 200,
      metadata: {
        clickPosition: {
          x: Math.floor(seededRandom(seed + 2) * 1000),
          y: Math.floor(seededRandom(seed + 3) * 800),
        },
        adFormat: ['display', 'video', 'carousel'][Math.floor(seededRandom(seed + 4) * 3)],
      },
      status: 'success',
    },
    {
      id: 'event-2',
      timestamp: startTime + 200,
      eventType: 'landing',
      duration: 800 + seededRandom(seed + 5) * 1000,
      metadata: {
        pageLoadTime: 800 + seededRandom(seed + 6) * 1000,
        firstContentfulPaint: 500 + seededRandom(seed + 7) * 800,
      },
      status: 'success',
    },
  ]

  // 중간 이벤트 (view, pageview)
  for (let i = 0; i < eventCount; i++) {
    events.push({
      id: `event-${i + 3}`,
      timestamp: startTime + 5000 + i * 3000,
      eventType: seededRandom(seed + 8 + i * 2) > 0.5 ? 'view' : 'pageview',
      duration: 2000 + seededRandom(seed + 9 + i * 2) * 3000,
      metadata: {
        scrollDepth: 20 + seededRandom(seed + 10 + i * 2) * 70,
        timeOnPage: 2000 + seededRandom(seed + 11 + i * 2) * 3000,
      },
      status: 'success',
    })
  }

  if (converted) {
    events.push(
      {
        id: `event-${eventCount + 3}`,
        timestamp: startTime + 15000 + eventCount * 3000,
        eventType: 'signup',
        duration: 2000 + seededRandom(seed + 20) * 2000,
        metadata: {
          formFillTime: 2000 + seededRandom(seed + 21) * 2000,
          fieldInteractions: 5 + Math.floor(seededRandom(seed + 22) * 5),
        },
        status: 'success',
      },
      {
        id: `event-${eventCount + 4}`,
        timestamp: startTime + 25000 + eventCount * 3000,
        eventType: 'purchase',
        duration: 2500 + seededRandom(seed + 23) * 1500,
        metadata: {
          itemsInCart: 1 + Math.floor(seededRandom(seed + 24) * 5),
          paymentMethod: ['card', 'bank_transfer', 'mobile'][Math.floor(seededRandom(seed + 25) * 3)],
          purchaseValue: 30000 + Math.floor(seededRandom(seed + 26) * 200000),
        },
        status: 'success',
      }
    )
  }

  return events
}

/**
 * 유입 흐름 생성 헬퍼
 * baseTime과 seed를 사용하여 deterministic한 값을 생성합니다
 */
const createReferrerFlows = (
  sourceDomain: string,
  landingPath: string,
  converted: boolean,
  flowCount: number = 3,
  baseTime: number = 1730000000000,
  seed: number = 0
): ReferrerFlow[] => {
  // 간단한 seeded random 함수
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000
    return x - Math.floor(x)
  }

  const flows: ReferrerFlow[] = [
    {
      sourceUrl: sourceDomain,
      destinationUrl: `https://example.com${landingPath}`,
      flowType: 'external',
      timestamp: baseTime,
      utmParams: {
        utm_source: sourceDomain.includes('google')
          ? 'google'
          : sourceDomain.includes('facebook')
            ? 'facebook'
            : 'other',
        utm_medium: 'cpc',
      },
    },
  ]

  const paths = ['/products', '/category', '/special-offer', '/new-arrivals', '/sale', '/cart', '/checkout']
  let currentUrl = `https://example.com${landingPath}`

  for (let i = 0; i < flowCount; i++) {
    const nextPath = paths[Math.floor(seededRandom(seed + i) * paths.length)]
    const nextUrl = `https://example.com${nextPath}`
    flows.push({
      sourceUrl: currentUrl,
      destinationUrl: nextUrl,
      flowType: 'internal',
      timestamp: baseTime + (i + 1) * 5000,
    })
    currentUrl = nextUrl
  }

  if (converted) {
    if (!currentUrl.includes('/checkout')) {
      flows.push({
        sourceUrl: currentUrl,
        destinationUrl: 'https://example.com/checkout',
        flowType: 'internal',
        timestamp: baseTime + (flowCount + 1) * 5000,
      })
    }
  }

  return flows
}

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
      category: '시즌 프로모션',
      platform: 'Facebook Ads',
      hierarchyLevel: 'campaign',
      objective: '전환',
      targetAudience: '20-30대 여성',
    },
    startTime: BASE_TIMESTAMP - 3600000 * 2,
    endTime: BASE_TIMESTAMP - 3600000 * 2 + 30000,
    totalDuration: 30000,
    events: createTraceEvents(BASE_TIMESTAMP - 3600000 * 2, true, 3, 1),
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
    referrerFlows: [
      {
        sourceUrl: 'https://www.facebook.com/ads',
        destinationUrl: 'https://example.com/summer-collection',
        flowType: 'external',
        timestamp: BASE_TIMESTAMP - 3600000 * 2,
        utmParams: {
          utm_source: 'facebook',
          utm_medium: 'cpc',
          utm_campaign: 'summer-new-arrival',
          utm_term: '여름옷',
        },
      },
      {
        sourceUrl: 'https://example.com/summer-collection',
        destinationUrl: 'https://example.com/products/dress-001',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 3600000 * 2 + 5000,
      },
      {
        sourceUrl: 'https://example.com/products/dress-001',
        destinationUrl: 'https://example.com/cart',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 3600000 * 2 + 15000,
      },
      {
        sourceUrl: 'https://example.com/cart',
        destinationUrl: 'https://example.com/checkout',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 3600000 * 2 + 25000,
      },
    ],
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
      category: '일반 검색 광고',
      platform: 'Google Ads',
      hierarchyLevel: 'campaign',
      objective: '전환',
      targetAudience: '운동화 관심층',
    },
    startTime: BASE_TIMESTAMP - 3600000,
    endTime: BASE_TIMESTAMP - 3600000 + 8000,
    totalDuration: 8000,
    events: createTraceEvents(BASE_TIMESTAMP - 3600000, false, 3, 2),
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
      category: '신상품 출시',
      platform: 'Instagram Ads',
      hierarchyLevel: 'campaign',
      objective: '브랜딩',
      targetAudience: '10-20대 패션 관심층',
    },
    startTime: BASE_TIMESTAMP - 1800000,
    endTime: BASE_TIMESTAMP - 1800000 + 45000,
    totalDuration: 45000,
    events: createTraceEvents(BASE_TIMESTAMP - 1800000, true, 3, 3),
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
    referrerFlows: [
      {
        sourceUrl: 'https://www.instagram.com/stories',
        destinationUrl: 'https://example.com/premium-collection',
        flowType: 'external',
        timestamp: BASE_TIMESTAMP - 1800000,
        utmParams: {
          utm_source: 'instagram',
          utm_medium: 'cpm',
          utm_content: 'story-ad-001',
        },
      },
      {
        sourceUrl: 'https://example.com/premium-collection',
        destinationUrl: 'https://example.com/products/luxury-bag',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 1800000 + 8000,
      },
      {
        sourceUrl: 'https://example.com/products/luxury-bag',
        destinationUrl: 'https://example.com/products/luxury-bag/reviews',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 1800000 + 20000,
      },
      {
        sourceUrl: 'https://example.com/products/luxury-bag/reviews',
        destinationUrl: 'https://example.com/checkout',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 1800000 + 40000,
      },
    ],
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
      category: '일반 쇼핑 광고',
      platform: 'Naver Shopping',
      hierarchyLevel: 'campaign',
      objective: '전환',
      targetAudience: '대학생, 직장인',
    },
    startTime: BASE_TIMESTAMP - 900000,
    endTime: BASE_TIMESTAMP - 900000 + 5000,
    totalDuration: 5000,
    events: createTraceEvents(BASE_TIMESTAMP - 900000, false, 3, 4),
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
      category: '시즌 프로모션',
      platform: 'Facebook Ads',
      hierarchyLevel: 'campaign',
      objective: '전환',
      targetAudience: '20-30대 여성',
    },
    startTime: BASE_TIMESTAMP - 600000,
    endTime: BASE_TIMESTAMP - 600000 + 28000,
    totalDuration: 28000,
    events: createTraceEvents(BASE_TIMESTAMP - 600000, true, 3, 5),
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
      category: '일반 동영상 광고',
      platform: 'YouTube Ads',
      hierarchyLevel: 'campaign',
      objective: '인지도',
      targetAudience: '전 연령층',
    },
    startTime: BASE_TIMESTAMP - 300000,
    endTime: BASE_TIMESTAMP - 300000 + 12000,
    totalDuration: 12000,
    events: createTraceEvents(BASE_TIMESTAMP - 300000, false, 3, 6),
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
      category: '일반 검색 광고',
      platform: 'Google Ads',
      hierarchyLevel: 'campaign',
      objective: '전환',
      targetAudience: '운동화 관심층',
    },
    startTime: BASE_TIMESTAMP - 7200000,
    endTime: BASE_TIMESTAMP - 7200000 + 35000,
    totalDuration: 35000,
    events: createTraceEvents(BASE_TIMESTAMP - 7200000, true, 3, 7),
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
    referrerFlows: [
      {
        sourceUrl: 'https://www.google.com/search',
        destinationUrl: 'https://example.com/sneakers',
        flowType: 'external',
        timestamp: BASE_TIMESTAMP - 7200000,
        utmParams: {
          utm_source: 'google',
          utm_medium: 'cpc',
          utm_term: '스니커즈',
        },
      },
      {
        sourceUrl: 'https://example.com/sneakers',
        destinationUrl: 'https://example.com/sneakers/nike-air-max',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 7200000 + 6000,
      },
      {
        sourceUrl: 'https://example.com/sneakers/nike-air-max',
        destinationUrl: 'https://example.com/compare',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 7200000 + 15000,
      },
      {
        sourceUrl: 'https://example.com/compare',
        destinationUrl: 'https://example.com/sneakers/nike-air-max',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 7200000 + 22000,
      },
      {
        sourceUrl: 'https://example.com/sneakers/nike-air-max',
        destinationUrl: 'https://example.com/checkout',
        flowType: 'internal',
        timestamp: BASE_TIMESTAMP - 7200000 + 30000,
      },
    ],
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
      category: '일반 디스플레이 광고',
      platform: 'Kakao Ads',
      hierarchyLevel: 'campaign',
      objective: '전환',
      targetAudience: '30-40대',
    },
    startTime: BASE_TIMESTAMP - 10800000,
    endTime: BASE_TIMESTAMP - 10800000 + 6000,
    totalDuration: 6000,
    events: createTraceEvents(BASE_TIMESTAMP - 10800000, false, 3, 8),
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
      category: '신상품 출시',
      platform: 'Instagram Ads',
      hierarchyLevel: 'campaign',
      objective: '브랜딩',
      targetAudience: '10-20대 패션 관심층',
    },
    startTime: BASE_TIMESTAMP - 14400000,
    endTime: BASE_TIMESTAMP - 14400000 + 38000,
    totalDuration: 38000,
    events: createTraceEvents(BASE_TIMESTAMP - 14400000, true, 3, 9),
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
      category: '일반 소셜 광고',
      platform: 'Twitter Ads',
      hierarchyLevel: 'campaign',
      objective: '인지도',
      targetAudience: '20-30대 얼리어답터',
    },
    startTime: BASE_TIMESTAMP - 18000000,
    endTime: BASE_TIMESTAMP - 18000000 + 9000,
    totalDuration: 9000,
    events: createTraceEvents(BASE_TIMESTAMP - 18000000, false, 3, 10),
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
]

/**
 * 추가 다양한 시나리오 데이터 생성
 * seed 기반으로 deterministic한 데이터를 생성합니다
 */
const generateAdditionalTraces = (): AdTrace[] => {
  const traces: AdTrace[] = []

  // 간단한 seeded random 함수
  const seededRandom = (s: number) => {
    const x = Math.sin(s) * 10000
    return x - Math.floor(x)
  }

  // 캠페인 템플릿
  const campaigns = [
    // Google Ads
    {
      id: 'camp-g001',
      name: '구글 검색 - 스니커즈',
      source: 'google',
      medium: 'cpc',
      platform: 'Google Ads',
      category: '일반 검색 광고',
      objective: '전환',
      targetAudience: '운동화 구매자',
    },
    {
      id: 'camp-g002',
      name: '구글 디스플레이 - 리타겟팅',
      source: 'google',
      medium: 'display',
      platform: 'Google Display',
      category: '리타겟팅',
      objective: '전환',
      targetAudience: '장바구니 이탈자',
    },
    {
      id: 'camp-g003',
      name: '구글 쇼핑 - 신발',
      source: 'google',
      medium: 'cpc',
      platform: 'Google Shopping',
      category: '일반 쇼핑 광고',
      objective: '전환',
      targetAudience: '신발 구매 의향자',
    },
    {
      id: 'camp-y001',
      name: '유튜브 - 브랜드 인지도',
      source: 'youtube',
      medium: 'video',
      platform: 'YouTube Ads',
      category: '브랜딩',
      objective: '인지도',
      targetAudience: '전 연령층',
    },

    // Naver
    {
      id: 'camp-n001',
      name: '네이버 검색 - 노트북',
      source: 'naver',
      medium: 'cpc',
      platform: 'Naver Search',
      category: '일반 검색 광고',
      objective: '전환',
      targetAudience: '노트북 구매자',
    },
    {
      id: 'camp-n002',
      name: '네이버 쇼핑 - 가전제품',
      source: 'naver',
      medium: 'cpc',
      platform: 'Naver Shopping',
      category: '일반 쇼핑 광고',
      objective: '전환',
      targetAudience: '가전 구매자',
    },
    {
      id: 'camp-n003',
      name: '네이버 블로그 - 체험단',
      source: 'naver',
      medium: 'blog',
      platform: 'Naver Blog',
      category: '브랜딩',
      objective: '인지도',
      targetAudience: '블로거',
    },

    // Facebook & Instagram
    {
      id: 'camp-f001',
      name: '페이스북 피드 - 봄 세일',
      source: 'facebook',
      medium: 'cpc',
      platform: 'Facebook Ads',
      category: '시즌 프로모션',
      objective: '전환',
      targetAudience: '30-40대',
    },
    {
      id: 'camp-f002',
      name: '페이스북 동영상 - 신제품',
      source: 'facebook',
      medium: 'video',
      platform: 'Facebook Ads',
      category: '신상품 출시',
      objective: '브랜딩',
      targetAudience: '전 연령층',
    },
    {
      id: 'camp-i001',
      name: '인스타 스토리 - 패션',
      source: 'instagram',
      medium: 'cpm',
      platform: 'Instagram Ads',
      category: '신상품 출시',
      objective: '브랜딩',
      targetAudience: '20-30대 여성',
    },
    {
      id: 'camp-i002',
      name: '인스타 릴스 - 뷰티',
      source: 'instagram',
      medium: 'video',
      platform: 'Instagram Ads',
      category: '일반 소셜 광고',
      objective: '전환',
      targetAudience: '20-30대',
    },

    // Kakao
    {
      id: 'camp-k001',
      name: '카카오톡 배너',
      source: 'kakao',
      medium: 'display',
      platform: 'Kakao Ads',
      category: '일반 디스플레이 광고',
      objective: '전환',
      targetAudience: '30-40대',
    },
    {
      id: 'camp-k002',
      name: '카카오 비즈보드',
      source: 'kakao',
      medium: 'display',
      platform: 'Kakao Biz',
      category: '브랜딩',
      objective: '인지도',
      targetAudience: '전 연령층',
    },

    // Twitter & TikTok
    {
      id: 'camp-t001',
      name: '트위터 프로모션',
      source: 'twitter',
      medium: 'cpc',
      platform: 'Twitter Ads',
      category: '일반 소셜 광고',
      objective: '인지도',
      targetAudience: '20-30대',
    },
    {
      id: 'camp-tt001',
      name: '틱톡 인피드',
      source: 'tiktok',
      medium: 'video',
      platform: 'TikTok Ads',
      category: '신상품 출시',
      objective: '브랜딩',
      targetAudience: '10-20대',
    },
  ]

  const devices = [
    { device: 'mobile', os: 'iOS', browser: 'Safari' },
    { device: 'mobile', os: 'Android', browser: 'Chrome' },
    { device: 'desktop', os: 'Windows', browser: 'Chrome' },
    { device: 'desktop', os: 'macOS', browser: 'Safari' },
    { device: 'tablet', os: 'iOS', browser: 'Safari' },
  ]

  const referrers = {
    google: 'https://www.google.com/search',
    naver: 'https://search.naver.com',
    facebook: 'https://www.facebook.com',
    instagram: 'https://www.instagram.com',
    youtube: 'https://www.youtube.com',
    kakao: 'https://www.kakaocorp.com',
    twitter: 'https://twitter.com',
    tiktok: 'https://www.tiktok.com',
  }

  const landingPaths = ['/sale', '/new-arrivals', '/products', '/special-offer', '/category', '/summer-collection']

  // 60개의 추가 trace 생성
  for (let i = 0; i < 60; i++) {
    const campaign = campaigns[i % campaigns.length]
    const device = devices[i % devices.length]
    const converted = seededRandom(1000 + i) > 0.6 // 40% 전환율
    const timeOffset = 3600000 * (i + 1) // 시간 차이 부여
    const startTime = BASE_TIMESTAMP - timeOffset
    const duration = converted ? 20000 + seededRandom(2000 + i) * 30000 : 3000 + seededRandom(3000 + i) * 10000
    const endTime = startTime + duration
    const eventCount = converted
      ? 3 + Math.floor(seededRandom(4000 + i) * 3)
      : 1 + Math.floor(seededRandom(5000 + i) * 2)

    const conversionValue = converted ? 30000 + Math.floor(seededRandom(6000 + i) * 150000) : undefined
    const roi = converted && conversionValue ? Math.floor((conversionValue / 20000) * 100) : undefined

    const landingPath = landingPaths[i % landingPaths.length]
    const referrer = referrers[campaign.source as keyof typeof referrers] || 'https://www.google.com'

    const trace: AdTrace = {
      traceId: `trace-${String(i + 11).padStart(3, '0')}`,
      userId: converted ? `user-${10000 + i}` : undefined,
      sessionId: `sess-${String(i + 11).padStart(6, '0')}`,
      campaign: {
        ...campaign,
        hierarchyLevel: 'campaign',
        content: `ad-content-${i}`,
        term: campaign.source === 'google' || campaign.source === 'naver' ? `keyword-${i}` : undefined,
      },
      startTime,
      endTime,
      totalDuration: duration,
      events: createTraceEvents(startTime, converted, eventCount, 100 + i),
      conversion: {
        converted,
        conversionValue,
        roi,
        conversionTime: converted ? duration : undefined,
      },
      deviceInfo: device,
      referrer,
      landingUrl: `https://example.com${landingPath}`,
      referrerFlows:
        converted || seededRandom(7000 + i) > 0.5
          ? createReferrerFlows(
              referrer,
              landingPath,
              converted,
              2 + Math.floor(seededRandom(8000 + i) * 3),
              startTime,
              200 + i
            )
          : undefined,
    }

    traces.push(trace)
  }

  return traces
}

// 기존 데이터와 생성된 데이터를 합침
mockTraces.push(...generateAdditionalTraces())

/**
 * Trace ID로 특정 Trace 조회
 */
export const getTraceById = (traceId: string): AdTrace | undefined => {
  return mockTraces.find((trace) => trace.traceId === traceId)
}

/**
 * 필터링된 Trace 목록 조회
 */
export const getFilteredTraces = (filters?: {
  campaignId?: string
  source?: string
  converted?: boolean
}): AdTrace[] => {
  if (!filters) return mockTraces

  return mockTraces.filter((trace) => {
    if (filters.campaignId && trace.campaign.id !== filters.campaignId) {
      return false
    }
    if (filters.source && trace.campaign.source !== filters.source) {
      return false
    }
    if (filters.converted !== undefined && trace.conversion.converted !== filters.converted) {
      return false
    }
    return true
  })
}
