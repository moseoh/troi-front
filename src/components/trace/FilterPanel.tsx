'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface FilterOptions {
  platforms: string[];
  categories: string[];
  converted?: 'all' | 'converted' | 'not_converted';
  dateRange?: {
    start: string;
    end: string;
  };
  roiRange?: {
    min: number;
    max: number;
  };
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  availablePlatforms?: string[];
  availableCategories?: string[];
}

const DEFAULT_PLATFORMS = ['Google Ads', 'Naver Shopping', 'Facebook Ads', 'Instagram Ads', 'YouTube Ads', 'Kakao Ads', 'Twitter Ads'];
const DEFAULT_CATEGORIES = ['시즌 프로모션', '신상품 출시', '일반 검색 광고', '일반 쇼핑 광고', '일반 동영상 광고', '일반 디스플레이 광고', '일반 소셜 광고'];

type DropdownType = 'platforms' | 'categories' | 'converted' | 'dateRange' | 'roiRange' | null;

export function FilterPanel({
  filters,
  onFilterChange,
  availablePlatforms = DEFAULT_PLATFORMS,
  availableCategories = DEFAULT_CATEGORIES,
}: FilterPanelProps) {
  const [openDropdown, setOpenDropdown] = useState<DropdownType>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlatformToggle = (platform: string) => {
    const newPlatforms = filters.platforms.includes(platform)
      ? filters.platforms.filter(p => p !== platform)
      : [...filters.platforms, platform];
    onFilterChange({ ...filters, platforms: newPlatforms });
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFilterChange({ ...filters, categories: newCategories });
  };

  const handleConversionChange = (converted: 'all' | 'converted' | 'not_converted') => {
    onFilterChange({ ...filters, converted });
    setOpenDropdown(null);
  };

  const handleDateRangeChange = (field: 'start' | 'end', value: string) => {
    onFilterChange({
      ...filters,
      dateRange: {
        start: field === 'start' ? value : filters.dateRange?.start || '',
        end: field === 'end' ? value : filters.dateRange?.end || '',
      },
    });
  };

  const handleRoiRangeChange = (field: 'min' | 'max', value: number) => {
    onFilterChange({
      ...filters,
      roiRange: {
        min: field === 'min' ? value : filters.roiRange?.min || 0,
        max: field === 'max' ? value : filters.roiRange?.max || 1000,
      },
    });
  };

  const handleReset = () => {
    onFilterChange({
      platforms: [],
      categories: [],
      converted: 'all',
      dateRange: undefined,
      roiRange: undefined,
    });
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown: DropdownType) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const getFilterLabel = (type: DropdownType): string => {
    switch (type) {
      case 'platforms':
        return filters.platforms.length > 0
          ? `플랫폼 (${filters.platforms.length})`
          : '플랫폼';
      case 'categories':
        return filters.categories.length > 0
          ? `카테고리 (${filters.categories.length})`
          : '카테고리';
      case 'converted':
        if (filters.converted === 'converted') return '전환 완료';
        if (filters.converted === 'not_converted') return '전환 미완료';
        return '전환 여부';
      case 'dateRange':
        if (filters.dateRange?.start || filters.dateRange?.end) {
          return `날짜: ${filters.dateRange.start || '시작'} ~ ${filters.dateRange.end || '종료'}`;
        }
        return '날짜 범위';
      case 'roiRange':
        if (filters.roiRange?.min || filters.roiRange?.max) {
          return `ROI: ${filters.roiRange.min || 0}% ~ ${filters.roiRange.max || 1000}%`;
        }
        return 'ROI 범위';
      default:
        return '';
    }
  };

  const activeFilterCount =
    filters.platforms.length +
    filters.categories.length +
    (filters.converted !== 'all' ? 1 : 0) +
    (filters.dateRange?.start || filters.dateRange?.end ? 1 : 0) +
    (filters.roiRange?.min || filters.roiRange?.max ? 1 : 0);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap items-center gap-2">
        {/* 플랫폼 필터 */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('platforms')}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              filters.platforms.length > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {getFilterLabel('platforms')}
            <ChevronDown className="h-4 w-4" />
          </button>

          {openDropdown === 'platforms' && (
            <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border bg-white shadow-lg">
              <div className="max-h-80 overflow-y-auto p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">플랫폼 선택</span>
                  {filters.platforms.length > 0 && (
                    <button
                      onClick={() => onFilterChange({ ...filters, platforms: [] })}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      모두 해제
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {availablePlatforms.map((platform) => (
                    <label key={platform} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.platforms.includes(platform)}
                        onChange={() => handlePlatformToggle(platform)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 카테고리 필터 */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('categories')}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              filters.categories.length > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {getFilterLabel('categories')}
            <ChevronDown className="h-4 w-4" />
          </button>

          {openDropdown === 'categories' && (
            <div className="absolute left-0 top-full z-50 mt-2 w-64 rounded-lg border bg-white shadow-lg">
              <div className="max-h-80 overflow-y-auto p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">카테고리 선택</span>
                  {filters.categories.length > 0 && (
                    <button
                      onClick={() => onFilterChange({ ...filters, categories: [] })}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      모두 해제
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {availableCategories.map((category) => (
                    <label key={category} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 전환 여부 필터 */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('converted')}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              filters.converted !== 'all'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {getFilterLabel('converted')}
            <ChevronDown className="h-4 w-4" />
          </button>

          {openDropdown === 'converted' && (
            <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border bg-white shadow-lg">
              <div className="p-3">
                <div className="space-y-2">
                  <button
                    onClick={() => handleConversionChange('all')}
                    className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                      filters.converted === 'all'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    전체
                  </button>
                  <button
                    onClick={() => handleConversionChange('converted')}
                    className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                      filters.converted === 'converted'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    전환 완료
                  </button>
                  <button
                    onClick={() => handleConversionChange('not_converted')}
                    className={`w-full rounded px-3 py-2 text-left text-sm transition-colors ${
                      filters.converted === 'not_converted'
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    전환 미완료
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 날짜 범위 필터 */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('dateRange')}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              filters.dateRange?.start || filters.dateRange?.end
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {getFilterLabel('dateRange')}
            <ChevronDown className="h-4 w-4" />
          </button>

          {openDropdown === 'dateRange' && (
            <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg">
              <div className="p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">날짜 범위</div>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">시작일</label>
                    <input
                      type="date"
                      value={filters.dateRange?.start || ''}
                      onChange={(e) => handleDateRangeChange('start', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-gray-600">종료일</label>
                    <input
                      type="date"
                      value={filters.dateRange?.end || ''}
                      onChange={(e) => handleDateRangeChange('end', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  {(filters.dateRange?.start || filters.dateRange?.end) && (
                    <button
                      onClick={() => onFilterChange({ ...filters, dateRange: undefined })}
                      className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ROI 범위 필터 */}
        <div className="relative">
          <button
            onClick={() => toggleDropdown('roiRange')}
            className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
              filters.roiRange?.min || filters.roiRange?.max
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {getFilterLabel('roiRange')}
            <ChevronDown className="h-4 w-4" />
          </button>

          {openDropdown === 'roiRange' && (
            <div className="absolute left-0 top-full z-50 mt-2 w-80 rounded-lg border bg-white shadow-lg">
              <div className="p-4">
                <div className="mb-3 text-sm font-medium text-gray-700">
                  ROI 범위: {filters.roiRange?.min || 0}% ~ {filters.roiRange?.max || 1000}%
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs text-gray-600">최소 ROI (%)</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.roiRange?.min || 0}
                      onChange={(e) => handleRoiRangeChange('min', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs text-gray-600">최대 ROI (%)</label>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={filters.roiRange?.max || 1000}
                      onChange={(e) => handleRoiRangeChange('max', Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  {(filters.roiRange?.min || filters.roiRange?.max) && (
                    <button
                      onClick={() => onFilterChange({ ...filters, roiRange: undefined })}
                      className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                    >
                      초기화
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 전체 초기화 버튼 */}
        {activeFilterCount > 0 && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <X className="h-4 w-4" />
            모두 초기화 ({activeFilterCount})
          </button>
        )}
      </div>
    </div>
  );
}
