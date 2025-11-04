import { Card, CardContent } from '@/components/ui/Card'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MetricsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function MetricsCard({ title, value, icon: Icon, trend, className }: MetricsCardProps) {
  return (
    <Card className={className}>
      <CardContent className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-bold">{value}</p>
          {trend && (
            <p className={cn('mt-2 text-sm font-medium', trend.isPositive ? 'text-green-600' : 'text-red-600')}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className="rounded-full bg-blue-100 p-3">
          <Icon className="h-8 w-8 text-blue-600" />
        </div>
      </CardContent>
    </Card>
  )
}
