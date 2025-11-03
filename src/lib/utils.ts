import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSS 클래스를 병합하는 유틸리티 함수
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 숫자를 한국 원화 형식으로 포맷
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(value);
}

/**
 * 숫자를 천단위 콤마로 포맷
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ko-KR').format(value);
}

/**
 * 퍼센트 포맷 (소수점 1자리)
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * 밀리초를 읽기 쉬운 형식으로 변환
 * @example formatDuration(65000) => "1분 5초"
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }

  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes % 60}분`;
  }

  if (minutes > 0) {
    return `${minutes}분 ${seconds % 60}초`;
  }

  return `${seconds}초`;
}

/**
 * 이벤트 타입을 한국어로 변환
 */
export function getEventTypeLabel(eventType: string): string {
  const labels: Record<string, string> = {
    click: '클릭',
    landing: '랜딩',
    view: '조회',
    signup: '회원가입',
    purchase: '구매',
    custom: '커스텀',
  };

  return labels[eventType] || eventType;
}

/**
 * 디바이스 타입을 한국어로 변환
 */
export function getDeviceLabel(device: string): string {
  const labels: Record<string, string> = {
    mobile: '모바일',
    desktop: '데스크톱',
    tablet: '태블릿',
  };

  return labels[device] || device;
}

/**
 * 광고 소스를 한국어로 변환
 */
export function getSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    facebook: '페이스북',
    google: '구글',
    instagram: '인스타그램',
    naver: '네이버',
    kakao: '카카오',
    youtube: '유튜브',
  };

  return labels[source] || source;
}

/**
 * ROI 값에 따른 색상 클래스 반환
 */
export function getRoiColorClass(roi: number): string {
  if (roi >= 400) return 'text-green-600';
  if (roi >= 200) return 'text-blue-600';
  if (roi >= 0) return 'text-yellow-600';
  return 'text-red-600';
}

/**
 * 전환율에 따른 색상 클래스 반환
 */
export function getConversionRateColorClass(rate: number): string {
  if (rate >= 50) return 'text-green-600';
  if (rate >= 30) return 'text-blue-600';
  if (rate >= 10) return 'text-yellow-600';
  return 'text-red-600';
}
