import { AdTrace, TraceEvent } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatDuration, getEventTypeLabel, getDeviceLabel, getSourceLabel } from '@/lib/utils';

interface TraceDetailsProps {
  trace: AdTrace;
  selectedEvent: TraceEvent | null;
}

export function TraceDetails({ trace, selectedEvent }: TraceDetailsProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle>{selectedEvent ? '이벤트 상세' : '추적 정보'}</CardTitle>
      </CardHeader>
      <CardContent>
        {selectedEvent ? (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">이벤트 타입</div>
              <div className="mt-1 font-medium">{getEventTypeLabel(selectedEvent.eventType)}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">소요 시간</div>
              <div className="mt-1 font-medium">
                {selectedEvent.duration ? formatDuration(selectedEvent.duration) : 'N/A'}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">상태</div>
              <div className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                    selectedEvent.status === 'success'
                      ? 'bg-green-100 text-green-800'
                      : selectedEvent.status === 'failed'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {selectedEvent.status === 'success' ? '성공' : selectedEvent.status === 'failed' ? '실패' : '진행중'}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">메타데이터</div>
              <div className="mt-2 rounded bg-gray-50 p-3">
                <pre className="text-xs">
                  {JSON.stringify(selectedEvent.metadata, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="text-sm text-gray-600">캠페인</div>
              <div className="mt-1 font-medium">{trace.campaign.name}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">소스</div>
              <div className="mt-1">
                <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                  {getSourceLabel(trace.campaign.source)}
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">매체</div>
              <div className="mt-1 font-medium">{trace.campaign.medium}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">디바이스</div>
              <div className="mt-1 font-medium">
                {getDeviceLabel(trace.deviceInfo.device)} / {trace.deviceInfo.os}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">브라우저</div>
              <div className="mt-1 font-medium">{trace.deviceInfo.browser}</div>
            </div>

            <div>
              <div className="text-sm text-gray-600">랜딩 URL</div>
              <div className="mt-1 truncate text-sm text-blue-600">{trace.landingUrl}</div>
            </div>

            {trace.referrer && (
              <div>
                <div className="text-sm text-gray-600">참조 URL</div>
                <div className="mt-1 truncate text-sm text-gray-700">{trace.referrer}</div>
              </div>
            )}

            <div>
              <div className="text-sm text-gray-600">이벤트 수</div>
              <div className="mt-1 font-medium">{trace.events.length}개</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
