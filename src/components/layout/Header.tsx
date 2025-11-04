'use client'

import { RefreshCw } from 'lucide-react'
import { useRefresh } from '@/hooks/useRefresh'
import { cn } from '@/lib/utils'

export function Header() {
  const { lastRefreshTime, canManualRefresh, cooldownRemaining, manualRefresh } = useRefresh({
    autoRefreshInterval: 60 * 60 * 1000, // 1시간
    manualRefreshCooldown: 5 * 60 * 1000, // 5분
    onRefresh: () => {
      console.log('데이터 갱신됨')
      // TODO: 실제 데이터 갱신 로직
    },
  })

  const formatCooldown = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-6">
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-gray-600">
            마지막 업데이트: <span suppressHydrationWarning>{lastRefreshTime.toLocaleTimeString('ko-KR')}</span>
          </div>

          <button
            onClick={manualRefresh}
            disabled={!canManualRefresh}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              canManualRefresh
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'cursor-not-allowed bg-gray-200 text-gray-500'
            )}
            title={canManualRefresh ? '데이터 새로고침' : `${formatCooldown(cooldownRemaining)} 후 사용 가능`}
          >
            <RefreshCw className={cn('h-4 w-4', !canManualRefresh && 'opacity-50')} />
            {!canManualRefresh && <span className="text-xs">{formatCooldown(cooldownRemaining)}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
