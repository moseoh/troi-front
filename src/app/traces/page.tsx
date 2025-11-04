'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/Card'
import { FilterPanel, FilterOptions } from '@/components/trace/FilterPanel'
import { TraceFlowDiagram } from '@/components/trace/TraceFlowDiagram'
import { mockTraces } from '@/data'
import { formatDuration, getDeviceLabel, getSourceLabel } from '@/lib/utils'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { CheckCircle2, XCircle, List, Workflow } from 'lucide-react'

export default function TracesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // URL에서 초기 필터 상태 읽기
  const initialFilters = useMemo<FilterOptions>(() => {
    const platforms = searchParams.get('platforms')?.split(',').filter(Boolean) || []
    const categories = searchParams.get('categories')?.split(',').filter(Boolean) || []
    const converted = (searchParams.get('converted') as FilterOptions['converted']) || 'all'
    const dateStart = searchParams.get('dateStart') || undefined
    const dateEnd = searchParams.get('dateEnd') || undefined
    const roiMin = searchParams.get('roiMin')
    const roiMax = searchParams.get('roiMax')

    return {
      platforms,
      categories,
      converted,
      dateRange: dateStart || dateEnd ? { start: dateStart || '', end: dateEnd || '' } : undefined,
      roiRange: roiMin || roiMax ? { min: Number(roiMin) || 0, max: Number(roiMax) || 1000 } : undefined,
    }
  }, [searchParams])

  const [filters, setFilters] = useState<FilterOptions>(initialFilters)
  const [viewMode, setViewMode] = useState<'list' | 'flow'>('list')

  // 필터 변경 시 URL 업데이트
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.platforms.length > 0) {
      params.set('platforms', filters.platforms.join(','))
    }
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    }
    if (filters.converted && filters.converted !== 'all') {
      params.set('converted', filters.converted)
    }
    if (filters.dateRange?.start) {
      params.set('dateStart', filters.dateRange.start)
    }
    if (filters.dateRange?.end) {
      params.set('dateEnd', filters.dateRange.end)
    }
    if (filters.roiRange?.min) {
      params.set('roiMin', filters.roiRange.min.toString())
    }
    if (filters.roiRange?.max && filters.roiRange.max !== 1000) {
      params.set('roiMax', filters.roiRange.max.toString())
    }

    const queryString = params.toString()
    const newUrl = queryString ? `/traces?${queryString}` : '/traces'

    // 현재 URL과 다를 때만 업데이트 (무한 루프 방지)
    if (window.location.pathname + window.location.search !== newUrl) {
      router.push(newUrl, { scroll: false })
    }
  }, [filters, router])

  // 필터링된 traces
  const traces = useMemo(() => {
    let filtered = mockTraces

    // 플랫폼 필터
    if (filters.platforms.length > 0) {
      filtered = filtered.filter((trace) => filters.platforms.includes(trace.campaign.platform || ''))
    }

    // 카테고리 필터
    if (filters.categories.length > 0) {
      filtered = filtered.filter((trace) => filters.categories.includes(trace.campaign.category || ''))
    }

    // 전환 여부 필터
    if (filters.converted === 'converted') {
      filtered = filtered.filter((trace) => trace.conversion.converted)
    } else if (filters.converted === 'not_converted') {
      filtered = filtered.filter((trace) => !trace.conversion.converted)
    }

    // 날짜 범위 필터
    if (filters.dateRange?.start) {
      const startDate = new Date(filters.dateRange.start).getTime()
      filtered = filtered.filter((trace) => trace.startTime >= startDate)
    }
    if (filters.dateRange?.end) {
      const endDate = new Date(filters.dateRange.end).getTime()
      filtered = filtered.filter((trace) => trace.startTime <= endDate)
    }

    // ROI 범위 필터
    if (filters.roiRange) {
      filtered = filtered.filter((trace) => {
        const roi = trace.conversion.roi || 0
        return roi >= (filters.roiRange?.min || 0) && roi <= (filters.roiRange?.max || 1000)
      })
    }

    return filtered
  }, [filters])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">추적 로그</h1>
        <p className="mt-1 text-gray-600">사용자 행동과 전환 경로를 추적합니다</p>
      </div>

      {/* 필터 패널 */}
      <FilterPanel filters={filters} onFilterChange={setFilters} />

      {/* 뷰 모드 전환 탭 */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setViewMode('list')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'list' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <List className="h-4 w-4" />
          목록 보기
        </button>
        <button
          onClick={() => setViewMode('flow')}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            viewMode === 'flow' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Workflow className="h-4 w-4" />
          흐름 보기
        </button>
      </div>

      {viewMode === 'list' ? (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 text-sm text-gray-600">총 {traces.length}개의 추적 로그</div>
            <div className="space-y-4">
              {traces.length === 0 ? (
                <div className="py-12 text-center text-gray-500">필터 조건에 맞는 추적 로그가 없습니다.</div>
              ) : (
                traces.map((trace) => (
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
                ))
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium">유입 흐름 다이어그램</h3>
              <p className="mt-1 text-sm text-gray-600">
                사용자가 어떤 경로로 유입되고 전환했는지 시각적으로 확인할 수 있습니다.
              </p>
            </div>
            <TraceFlowDiagram traces={traces} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
