import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { CampaignStats } from '@/types'
import { formatCurrency, formatNumber, formatPercent, getRoiColorClass } from '@/lib/utils'

interface CampaignListProps {
  campaigns: CampaignStats[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>캠페인 성과</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="pb-3 text-left font-medium text-gray-600">캠페인명</th>
                <th className="pb-3 text-left font-medium text-gray-600">소스</th>
                <th className="pb-3 text-right font-medium text-gray-600">클릭</th>
                <th className="pb-3 text-right font-medium text-gray-600">전환</th>
                <th className="pb-3 text-right font-medium text-gray-600">전환율</th>
                <th className="pb-3 text-right font-medium text-gray-600">매출</th>
                <th className="pb-3 text-right font-medium text-gray-600">ROI</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.campaignId} className="border-b last:border-0">
                  <td className="py-3 font-medium">{campaign.campaignName}</td>
                  <td className="py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs">{campaign.source}</span>
                  </td>
                  <td className="py-3 text-right">{formatNumber(campaign.clicks)}</td>
                  <td className="py-3 text-right">{formatNumber(campaign.conversions)}</td>
                  <td className="py-3 text-right">{formatPercent(campaign.conversionRate)}</td>
                  <td className="py-3 text-right">{formatCurrency(campaign.revenue)}</td>
                  <td className={`py-3 text-right font-semibold ${getRoiColorClass(campaign.roi)}`}>
                    {formatPercent(campaign.roi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
