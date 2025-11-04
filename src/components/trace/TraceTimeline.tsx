'use client'

import { useState } from 'react'
import { AdTrace, TraceEvent } from '@/types'
import { TraceNode } from './TraceNode'
import { TraceDetails } from './TraceDetails'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { formatDuration } from '@/lib/utils'

interface TraceTimelineProps {
  trace: AdTrace
}

export function TraceTimeline({ trace }: TraceTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TraceEvent | null>(null)

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* 타임라인 (2/3) */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>추적 타임라인</CardTitle>
              <div className="text-sm text-gray-600">
                총 소요 시간: <span className="font-semibold">{formatDuration(trace.totalDuration)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* 타임스케일 */}
            <div className="mb-4 flex items-center gap-4">
              <div className="w-24 flex-shrink-0" />
              <div className="relative flex-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>0ms</span>
                  <span>{formatDuration(trace.totalDuration / 2)}</span>
                  <span>{formatDuration(trace.totalDuration)}</span>
                </div>
              </div>
              <div className="w-20 flex-shrink-0" />
            </div>

            {/* 이벤트 노드들 */}
            <div className="space-y-1">
              {trace.events.map((event, index) => (
                <TraceNode
                  key={event.id}
                  event={event}
                  startTime={trace.startTime}
                  totalDuration={trace.totalDuration}
                  isLast={index === trace.events.length - 1}
                  onSelect={setSelectedEvent}
                  isSelected={selectedEvent?.id === event.id}
                />
              ))}
            </div>

            {/* 전환 표시 */}
            {trace.conversion.converted && (
              <div className="mt-6 rounded-lg bg-green-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                  <span className="font-medium text-green-900">전환 완료</span>
                  {trace.conversion.conversionValue && (
                    <span className="ml-auto text-lg font-semibold text-green-900">
                      {trace.conversion.conversionValue.toLocaleString('ko-KR')}원
                    </span>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 상세 정보 (1/3) */}
      <div>
        <TraceDetails trace={trace} selectedEvent={selectedEvent} />
      </div>
    </div>
  )
}
