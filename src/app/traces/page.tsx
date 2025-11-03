import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { mockTraces } from '@/data';
import { formatDuration, getDeviceLabel, getSourceLabel } from '@/lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TracesPage() {
  const traces = mockTraces.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">추적 로그</h1>
        <p className="mt-1 text-gray-600">
          사용자 행동과 전환 경로를 추적합니다
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {traces.map((trace) => (
              <Link
                key={trace.traceId}
                href={`/trace/${trace.traceId}`}
                className="block rounded-lg border p-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{trace.campaign.name}</h4>
                      {trace.conversion.converted ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                      <span>{getSourceLabel(trace.campaign.source)}</span>
                      <span>•</span>
                      <span>{getDeviceLabel(trace.deviceInfo.device)}</span>
                      <span>•</span>
                      <span>{formatDuration(trace.totalDuration)}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {format(new Date(trace.startTime), 'HH:mm', { locale: ko })}
                    </div>
                    {trace.conversion.converted && trace.conversion.conversionValue && (
                      <div className="mt-1 font-semibold text-green-600">
                        {trace.conversion.conversionValue.toLocaleString('ko-KR')}원
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
