'use client';

import * as React from 'react';
import { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Activity, TrendingUp } from 'lucide-react';
import { TraceTimeline } from '@/components/trace/TraceTimeline';
import { TraceFlowDiagram } from '@/components/trace/TraceFlowDiagram';
import { getTraceById } from '@/data';
import { formatCurrency, formatPercent, formatDuration, getSourceLabel, getDeviceLabel } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TracePageProps {
  params: Promise<{ id: string }>;
}

export default function TracePage({ params }: TracePageProps) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;
  const trace = getTraceById(id);
  const [activeTab, setActiveTab] = useState<'timeline' | 'flow' | 'events'>('timeline');

  if (!trace) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <Link
          href="/traces"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          추적 로그로 돌아가기
        </Link>

        <div className="mt-4 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{trace.campaign.name}</h1>
            <p className="mt-1 text-gray-600">
              {format(new Date(trace.startTime), 'yyyy년 MM월 dd일 HH:mm:ss', { locale: ko })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {trace.conversion.converted ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-600">전환 완료</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-gray-400" />
                <span className="font-medium text-gray-600">미전환</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 주요 메트릭 */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            총 소요 시간
          </div>
          <div className="mt-1 text-2xl font-bold">{formatDuration(trace.totalDuration)}</div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="h-4 w-4" />
            이벤트 수
          </div>
          <div className="mt-1 text-2xl font-bold">{trace.events.length}개</div>
        </div>

        {trace.conversion.converted && (
          <>
            <div className="rounded-lg border bg-white p-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="h-4 w-4" />
                전환 가치
              </div>
              <div className="mt-1 text-2xl font-bold text-green-600">
                {formatCurrency(trace.conversion.conversionValue || 0)}
              </div>
            </div>

            <div className="rounded-lg border bg-white p-4">
              <div className="text-sm text-gray-600">ROI</div>
              <div className="mt-1 text-2xl font-bold text-blue-600">
                {formatPercent(trace.conversion.roi || 0)}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 2컬럼 레이아웃 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 좌측: 시각화 영역 (2/3) */}
        <div className="lg:col-span-2">
          {/* 탭 네비게이션 */}
          <div className="mb-4 flex gap-2 border-b">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'timeline'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              타임라인
            </button>
            <button
              onClick={() => setActiveTab('flow')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'flow'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              유입 흐름
            </button>
          </div>

          {/* 탭 콘텐츠 */}
          {activeTab === 'timeline' && <TraceTimeline trace={trace} />}

          {activeTab === 'flow' && (
            <div className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-lg font-medium">유입 흐름</h3>
              {trace.referrerFlows && trace.referrerFlows.length > 0 ? (
                <TraceFlowDiagram traces={[trace]} />
              ) : (
                <div className="flex h-64 items-center justify-center text-gray-500">
                  유입 흐름 데이터가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>

        {/* 우측: 상세 정보 패널 (1/3) */}
        <div className="space-y-4">
          {/* 캠페인 정보 */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">캠페인 정보</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">플랫폼</div>
                <div className="mt-1 font-medium">{trace.campaign.platform || getSourceLabel(trace.campaign.source)}</div>
              </div>
              {trace.campaign.category && (
                <div>
                  <div className="text-gray-600">카테고리</div>
                  <div className="mt-1 font-medium">{trace.campaign.category}</div>
                </div>
              )}
              {trace.campaign.objective && (
                <div>
                  <div className="text-gray-600">목적</div>
                  <div className="mt-1 font-medium">{trace.campaign.objective}</div>
                </div>
              )}
              <div>
                <div className="text-gray-600">매체</div>
                <div className="mt-1 font-medium">{trace.campaign.medium}</div>
              </div>
              {trace.campaign.targetAudience && (
                <div>
                  <div className="text-gray-600">타겟 오디언스</div>
                  <div className="mt-1 font-medium">{trace.campaign.targetAudience}</div>
                </div>
              )}
            </div>
          </div>

          {/* 디바이스 정보 */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">디바이스 정보</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">디바이스</div>
                <div className="mt-1 font-medium">{getDeviceLabel(trace.deviceInfo.device)}</div>
              </div>
              <div>
                <div className="text-gray-600">운영체제</div>
                <div className="mt-1 font-medium">{trace.deviceInfo.os}</div>
              </div>
              <div>
                <div className="text-gray-600">브라우저</div>
                <div className="mt-1 font-medium">{trace.deviceInfo.browser}</div>
              </div>
            </div>
          </div>

          {/* URL 정보 */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">URL 정보</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">랜딩 URL</div>
                <div className="mt-1 break-all text-xs text-blue-600">{trace.landingUrl}</div>
              </div>
              {trace.referrer && (
                <div>
                  <div className="text-gray-600">참조 URL</div>
                  <div className="mt-1 break-all text-xs text-gray-700">{trace.referrer}</div>
                </div>
              )}
            </div>
          </div>

          {/* 세션 정보 */}
          <div className="rounded-lg border bg-white p-4">
            <h3 className="mb-3 font-medium">세션 정보</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="text-gray-600">Trace ID</div>
                <div className="mt-1 font-mono text-xs">{trace.traceId}</div>
              </div>
              <div>
                <div className="text-gray-600">Session ID</div>
                <div className="mt-1 font-mono text-xs">{trace.sessionId}</div>
              </div>
              {trace.userId && (
                <div>
                  <div className="text-gray-600">User ID</div>
                  <div className="mt-1 font-mono text-xs">{trace.userId}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// React.use polyfill for older Next.js versions
if (!('use' in React)) {
  (React as any).use = function <T>(promise: Promise<T>): T {
    if ((promise as any)._result !== undefined) {
      return (promise as any)._result;
    }
    throw promise.then(
      (result: T) => {
        (promise as any)._result = result;
      },
      (error: any) => {
        (promise as any)._result = error;
        throw error;
      }
    );
  };
}
