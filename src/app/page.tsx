import { MousePointerClick, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { MetricsCard } from '@/components/dashboard/MetricsCard';
import { CampaignList } from '@/components/dashboard/CampaignList';
import { RecentTraces } from '@/components/dashboard/RecentTraces';
import { mockMarketingMetrics, mockCampaignStats, mockTraces } from '@/data';
import { formatCurrency, formatNumber, formatPercent, formatDuration } from '@/lib/utils';

export default function DashboardPage() {
  const metrics = mockMarketingMetrics;
  const recentTraces = mockTraces.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="mt-1 text-gray-600">마케팅 캠페인 성과를 한눈에 확인하세요</p>
      </div>

      {/* 주요 메트릭 카드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="총 클릭"
          value={formatNumber(metrics.totalClicks)}
          icon={MousePointerClick}
        />
        <MetricsCard
          title="전환율"
          value={formatPercent(metrics.averageConversionRate)}
          icon={TrendingUp}
        />
        <MetricsCard
          title="총 매출"
          value={formatCurrency(metrics.totalRevenue)}
          icon={DollarSign}
        />
        <MetricsCard
          title="평균 전환 시간"
          value={formatDuration(metrics.averageConversionTime)}
          icon={Clock}
        />
      </div>

      {/* 캠페인 성과 테이블 */}
      <CampaignList campaigns={mockCampaignStats} />

      {/* 최근 추적 로그 */}
      <RecentTraces traces={recentTraces} />
    </div>
  );
}
