'use client';

import { TraceEvent } from '@/types';
import { formatDuration, getEventTypeLabel } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TraceNodeProps {
  event: TraceEvent;
  startTime: number;
  totalDuration: number;
  isLast: boolean;
  onSelect: (event: TraceEvent) => void;
  isSelected: boolean;
}

const getEventColor = (eventType: string, status: string) => {
  if (status === 'failed') return 'bg-red-500';
  if (status === 'pending') return 'bg-yellow-500';

  switch (eventType) {
    case 'click':
      return 'bg-blue-500';
    case 'landing':
      return 'bg-purple-500';
    case 'view':
      return 'bg-indigo-500';
    case 'signup':
      return 'bg-green-500';
    case 'purchase':
      return 'bg-emerald-600';
    default:
      return 'bg-gray-500';
  }
};

export function TraceNode({ event, startTime, totalDuration, isLast, onSelect, isSelected }: TraceNodeProps) {
  const relativeStart = event.timestamp - startTime;
  const duration = event.duration || 0;

  // 타임라인에서의 위치 계산 (백분율)
  const leftPercent = (relativeStart / totalDuration) * 100;
  const widthPercent = Math.max((duration / totalDuration) * 100, 0.5); // 최소 0.5%

  const eventColor = getEventColor(event.eventType, event.status);

  return (
    <div className="flex items-center gap-4 py-2">
      {/* 이벤트 타입 라벨 */}
      <div className="w-24 flex-shrink-0 text-sm font-medium">
        {getEventTypeLabel(event.eventType)}
      </div>

      {/* 타임라인 바 */}
      <div className="relative flex-1">
        {/* 배경 타임라인 */}
        <div className="h-8 rounded bg-gray-100">
          {/* 이벤트 바 */}
          <button
            onClick={() => onSelect(event)}
            className={cn(
              'absolute h-8 rounded transition-all hover:opacity-80',
              eventColor,
              isSelected && 'ring-2 ring-black ring-offset-2'
            )}
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`,
            }}
          >
            <div className="flex h-full items-center justify-center px-2 text-xs font-medium text-white">
              {duration > 0 && formatDuration(duration)}
            </div>
          </button>
        </div>

        {/* 연결선 */}
        {!isLast && (
          <div className="absolute left-0 top-10 h-6 w-px bg-gray-300" />
        )}
      </div>

      {/* 시작 시간 */}
      <div className="w-20 flex-shrink-0 text-right text-xs text-gray-600">
        +{formatDuration(relativeStart)}
      </div>
    </div>
  );
}
