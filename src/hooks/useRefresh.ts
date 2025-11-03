'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseRefreshOptions {
  autoRefreshInterval?: number; // ms
  manualRefreshCooldown?: number; // ms
  onRefresh?: () => void;
}

const LAST_REFRESH_KEY = 'troi_last_refresh_time';
const COOLDOWN_END_KEY = 'troi_cooldown_end_time';

export function useRefresh(options: UseRefreshOptions = {}) {
  const {
    autoRefreshInterval = 60 * 60 * 1000, // 1시간
    manualRefreshCooldown = 5 * 60 * 1000, // 5분
    onRefresh,
  } = options;

  // Lazy initialization: sessionStorage에서 바로 읽어서 초기값 설정
  const [lastRefreshTime, setLastRefreshTime] = useState<Date>(() => {
    if (typeof window === 'undefined') return new Date();

    const savedTime = sessionStorage.getItem(LAST_REFRESH_KEY);
    if (savedTime) {
      return new Date(savedTime);
    }

    const now = new Date();
    sessionStorage.setItem(LAST_REFRESH_KEY, now.toISOString());
    return now;
  });

  const [canManualRefresh, setCanManualRefresh] = useState(() => {
    if (typeof window === 'undefined') return true;

    const savedCooldownEnd = sessionStorage.getItem(COOLDOWN_END_KEY);
    if (savedCooldownEnd) {
      const remaining = new Date(savedCooldownEnd).getTime() - Date.now();
      return remaining <= 0;
    }
    return true;
  });

  const [cooldownRemaining, setCooldownRemaining] = useState(() => {
    if (typeof window === 'undefined') return 0;

    const savedCooldownEnd = sessionStorage.getItem(COOLDOWN_END_KEY);
    if (savedCooldownEnd) {
      const remaining = new Date(savedCooldownEnd).getTime() - Date.now();
      if (remaining > 0) return remaining;
      sessionStorage.removeItem(COOLDOWN_END_KEY);
    }
    return 0;
  });

  // 갱신 로직
  const refresh = useCallback(() => {
    const now = new Date();
    setLastRefreshTime(now);
    sessionStorage.setItem(LAST_REFRESH_KEY, now.toISOString());
    onRefresh?.();
  }, [onRefresh]);

  // 쿨다운 타이머 (복원된 경우에도 작동)
  useEffect(() => {
    if (!canManualRefresh) {
      const cooldownInterval = setInterval(() => {
        setCooldownRemaining((prev) => {
          if (prev <= 1000) {
            setCanManualRefresh(true);
            sessionStorage.removeItem(COOLDOWN_END_KEY);
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);

      return () => clearInterval(cooldownInterval);
    }
  }, [canManualRefresh]);

  // 자동 갱신 (1시간마다)
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [refresh, autoRefreshInterval]);

  // 수동 갱신 (쿨다운 포함)
  const manualRefresh = useCallback(() => {
    if (!canManualRefresh) return;

    refresh();
    setCanManualRefresh(false);
    setCooldownRemaining(manualRefreshCooldown);

    // 쿨다운 종료 시간 저장
    const cooldownEndTime = new Date(Date.now() + manualRefreshCooldown);
    sessionStorage.setItem(COOLDOWN_END_KEY, cooldownEndTime.toISOString());
  }, [canManualRefresh, refresh, manualRefreshCooldown]);

  return {
    lastRefreshTime,
    canManualRefresh,
    cooldownRemaining,
    manualRefresh,
  };
}
