'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BarChart3, LayoutDashboard, List, Megaphone } from 'lucide-react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: '대시보드',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: '추적 로그',
    href: '/traces',
    icon: List,
  },
  {
    title: '캠페인',
    href: '/campaigns',
    icon: Megaphone,
  },
]

interface SidebarProps {
  isExpanded: boolean
  onToggle: () => void
}

export function Sidebar({ isExpanded, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-30 h-full border-r bg-white transition-all duration-300',
        isExpanded ? 'w-64' : 'w-16'
      )}
    >
      {/* 로고 - 클릭하면 토글 */}
      <button
        onClick={onToggle}
        className="flex h-16 w-full items-center overflow-hidden border-b px-4 hover:bg-gray-50"
      >
        <BarChart3 className="h-6 w-6 flex-shrink-0 text-blue-600" />
        <span
          className={cn(
            'ml-2 whitespace-nowrap text-xl font-semibold text-gray-900 transition-all duration-300',
            isExpanded ? 'opacity-100' : 'opacity-0 w-0 ml-0'
          )}
        >
          Troi
        </span>
      </button>

      {/* 네비게이션 메뉴 */}
      <nav className="flex flex-col gap-1 p-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center overflow-hidden rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              )}
              title={!isExpanded ? item.title : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  'ml-3 whitespace-nowrap transition-all duration-300',
                  isExpanded ? 'opacity-100' : 'opacity-0 w-0 ml-0'
                )}
              >
                {item.title}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* 하단 정보 */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden border-t bg-gray-50 p-4">
        <div
          className={cn('text-xs text-gray-600 transition-all duration-300', isExpanded ? 'opacity-100' : 'opacity-0')}
        >
          <div className="whitespace-nowrap font-medium">Troi v1.0.0</div>
          <div className="mt-1 whitespace-nowrap">마케팅 분석 도구</div>
        </div>
      </div>
    </aside>
  )
}
