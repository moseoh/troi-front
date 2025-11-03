import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { TraceTimeline } from '@/components/trace/TraceTimeline';
import { getTraceById } from '@/data';
import { formatCurrency, formatPercent, formatDuration } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TracePageProps {
  params: Promise<{ id: string }>;
}

export default async function TracePage({ params }: TracePageProps) {
  const { id } = await params;
  const trace = getTraceById(id);

  if (!trace) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          대시보드로 돌아가기
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
          <div className="text-sm text-gray-600">총 소요 시간</div>
          <div className="mt-1 text-2xl font-bold">{formatDuration(trace.totalDuration)}</div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm text-gray-600">이벤트 수</div>
          <div className="mt-1 text-2xl font-bold">{trace.events.length}개</div>
        </div>

        {trace.conversion.converted && (
          <>
            <div className="rounded-lg border bg-white p-4">
              <div className="text-sm text-gray-600">전환 가치</div>
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

      {/* 타임라인 */}
      <TraceTimeline trace={trace} />
    </div>
  );
}
