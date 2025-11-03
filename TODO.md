# Troi - 추적 로그 화면 고도화 TODO

## 개요
현재 기본적인 추적 로그 기능을 고도화하여 다음을 구현:
1. **대분류 체계**: 플랫폼별(구글, 네이버 등) + 이벤트 기반(프로모션, 시즌 이벤트)
2. **그래프 시각화**: 유입 흐름을 다이어그램으로 표현 (Sankey/Network Graph)

---

## Phase 1: 데이터 구조 개선 ⏳

### 1.1 캠페인 계층 구조 추가
- [ ] Campaign 타입 확장 (`src/types/campaign.ts`)
  - [ ] `category: string` 추가 - 이벤트 분류 (예: "여름 프로모션", "신규 가입 이벤트")
  - [ ] `platform: string` 추가 - 플랫폼 분류 (source를 더 명확히)
  - [ ] `hierarchyLevel: 'campaign' | 'adSet' | 'ad'` 추가
  - [ ] `parentId?: string` 추가 - 상위 캠페인 참조
  - [ ] `objective?: string` 추가 - 캠페인 목적 (인지도, 전환, 리타겟팅)
  - [ ] `targetAudience?: string` 추가 - 타겟 오디언스 정보

### 1.2 유입 흐름 데이터 구조 추가
- [ ] ReferrerFlow 타입 생성 (`src/types/trace.ts`)
  ```typescript
  interface ReferrerFlow {
    sourceUrl: string;           // 이전 페이지 URL
    destinationUrl: string;      // 현재 페이지 URL
    utmParams?: UTMParams;       // UTM 파라미터
    flowType: 'external' | 'internal' | 'direct';
    timestamp: number;
  }
  ```
- [ ] AdTrace에 `referrerFlows: ReferrerFlow[]` 추가
- [ ] PageView 이벤트 타입 추가하여 페이지 전환 추적

**예상 시간**: 2-3시간

---

## Phase 2: 필터링 시스템 구현 🎯

### 2.1 TracesPage 필터 UI 추가
- [ ] FilterPanel 컴포넌트 생성 (`src/components/traces/FilterPanel.tsx`)
  - [ ] **플랫폼 필터**: 체크박스 그룹 (Google, Naver, Facebook, Instagram 등)
  - [ ] **카테고리 필터**: 드롭다운 (프로모션, 이벤트, 일반 등)
  - [ ] **전환 여부**: 라디오 버튼 (전체/전환 완료/미완료)
  - [ ] **날짜 범위**: date picker (시작일~종료일)
  - [ ] **ROI 범위**: 슬라이더 (최소~최대)
  - [ ] **필터 초기화** 버튼
  - [ ] **필터 프리셋 저장** 기능

- [ ] TracesPage에 FilterPanel 통합
  - [ ] 상단에 필터 영역 배치
  - [ ] 접기/펴기 토글 기능
  - [ ] 활성 필터 개수 표시 (예: "5개 필터 적용 중")

### 2.2 실시간 필터링 로직
- [ ] useTraceFilters 커스텀 훅 생성 (`src/hooks/useTraceFilters.ts`)
  - [ ] 필터 상태 관리 (useState)
  - [ ] 필터링 로직 구현 (useMemo로 최적화)
  - [ ] URL 쿼리 파라미터 동기화 (useSearchParams)

- [ ] getFilteredTraces 함수 확장 (`src/data/mockTraces.ts`)
  - [ ] 플랫폼, 카테고리, 전환, 날짜, ROI 범위 필터 지원
  - [ ] 복합 필터 조건 처리

- [ ] 필터 카운터 표시
  - [ ] 각 필터 옵션 옆에 매칭되는 항목 수 표시
  - [ ] 예: "구글 광고 (23건)", "전환 완료 (12건)"

**예상 시간**: 3-4시간

---

## Phase 3: 그래프 다이어그램 시각화 📊 (핵심)

### 3.1 유입 흐름 그래프 컴포넌트 (Sankey Diagram)
- [ ] 라이브러리 선택 및 설치
  - [ ] Option 1: `react-flow` + custom sankey nodes
  - [ ] Option 2: `recharts` (기존 사용 중이면)
  - [ ] Option 3: `visx` (고급 커스터마이징)

- [ ] TraceFlowDiagram 컴포넌트 생성 (`src/components/traces/TraceFlowDiagram.tsx`)
  - [ ] **노드 구성**:
    - 유입 소스 노드 (Referrer)
    - 랜딩 페이지 노드
    - 중간 페이지 노드들
    - 전환 페이지 노드 / 이탈 노드
  - [ ] **엣지 구성**:
    - 각 단계 간 사용자 흐름
    - 굵기 = 사용자 수
    - 색상 = 전환 여부 (녹색=전환, 회색=이탈)
  - [ ] **인터랙션**:
    - 노드 클릭 시 해당 페이지의 상세 정보 표시
    - 엣지 호버 시 전환율 툴팁
    - 드롭오프율 표시 (각 단계별)

- [ ] TracesPage에 FlowDiagram 뷰 추가
  - [ ] 탭 구조: "목록 보기" / "흐름 보기"
  - [ ] 필터 적용된 데이터로 흐름 그래프 생성

### 3.2 이벤트 흐름 그래프 (Network Graph)
- [ ] TraceEventFlow 컴포넌트 생성 (`src/components/trace/TraceEventFlow.tsx`)
  - [ ] **노드**: 각 이벤트 타입을 노드로 표현
    - 크기: 발생 빈도
    - 색상: 이벤트 타입별 색상 코딩
    - 라벨: 이벤트 이름 + 발생 횟수
  - [ ] **엣지**: 이벤트 간 순차 관계
    - 방향: 화살표로 방향 표시
    - 굵기: 해당 경로를 거친 사용자 수
  - [ ] **레이아웃**:
    - Force-directed layout 또는 Hierarchical layout
    - 줌/팬 컨트롤

- [ ] Trace 상세 페이지에 통합
  - [ ] 기존 타임라인 뷰와 함께 탭으로 제공
  - [ ] "타임라인" / "이벤트 네트워크" 탭

### 3.3 시각화 라이브러리 선택 및 설정
- [ ] 패키지 설치
  ```bash
  # Option 1: React Flow (추천 - 유연하고 강력)
  npm install reactflow

  # Option 2: Recharts (이미 있다면)
  npm install recharts

  # Option 3: visx (D3 기반, 고급)
  npm install @visx/visx
  ```

- [ ] 공통 차트 유틸리티 작성
  - [ ] 색상 팔레트 정의 (`src/lib/chartColors.ts`)
  - [ ] 데이터 변환 함수 (`src/lib/chartUtils.ts`)
  - [ ] 반응형 차트 래퍼 컴포넌트

**예상 시간**: 5-6시간 (가장 핵심적이고 시간 소요가 큰 부분)

---

## Phase 4: 상세 페이지 개선 🎨

### 4.1 Trace 상세 페이지 레이아웃 변경
- [ ] 2컬럼 레이아웃으로 변경 (`src/app/trace/[id]/page.tsx`)
  - [ ] 좌측 (60%): 시각화 영역
  - [ ] 우측 (40%): 상세 정보 패널

- [ ] 탭 네비게이션 추가
  - [ ] "타임라인" 탭: 기존 TraceTimeline
  - [ ] "유입 흐름" 탭: 이 추적의 유입 경로
  - [ ] "이벤트 분석" 탭: 이벤트 네트워크 그래프

- [ ] 비교 모드 구현
  - [ ] URL 파라미터로 여러 traceId 전달 지원
  - [ ] 예: `/trace/trace-001?compare=trace-002,trace-003`
  - [ ] 최대 3개까지 나란히 비교

### 4.2 추가 메트릭 표시
- [ ] 메트릭 카드 추가
  - [ ] **페이지 체류 시간**: 각 페이지에서 머문 평균 시간
  - [ ] **스크롤 깊이**: 페이지 스크롤 비율 (메타데이터에서)
  - [ ] **이탈률**: 특정 단계에서의 이탈 비율
  - [ ] **평균 전환 시간**: 비슷한 추적과 비교

- [ ] 이탈 지점 강조
  - [ ] 타임라인에서 이탈 이벤트를 빨간색으로 강조
  - [ ] 이탈 원인 추정 표시 (예: "긴 로딩 시간", "에러 발생")

**예상 시간**: 2-3시간

---

## Phase 5: 목 데이터 확장 📦

### 5.1 다양한 시나리오 데이터 추가
- [ ] 플랫폼별 데이터 확장 (`src/data/mockTraces.ts`)
  - [ ] 구글 광고 (검색, 디스플레이, 유튜브)
  - [ ] 네이버 광고 (검색, 쇼핑, 블로그)
  - [ ] 페이스북/인스타그램 (피드, 스토리, 릴스)
  - [ ] 카카오 (톡 광고, 디스플레이)
  - [ ] 트위터, 틱톡 추가

- [ ] 카테고리별 데이터
  - [ ] 시즌 프로모션: "여름 세일", "블랙프라이데이"
  - [ ] 신상품 출시: "신제품 런칭 캠페인"
  - [ ] 리타겟팅: "장바구니 이탈 광고"
  - [ ] 브랜딩: "브랜드 인지도 캠페인"

- [ ] 복잡한 유입 경로 시나리오
  - [ ] 검색 → 블로그 리뷰 → 상품 페이지 → 구매
  - [ ] 광고 → 랜딩 페이지 → 이탈 (로딩 시간 문제)
  - [ ] 이메일 → 프로모션 페이지 → 쿠폰 다운 → 구매
  - [ ] SNS → 브랜드 페이지 → 제품 비교 → 장바구니 → 이탈
  - [ ] 재방문: 광고 → 이탈 → 검색 → 재방문 → 구매

- [ ] 실패 케이스 포함
  - [ ] 중간 이탈 (특정 페이지에서 높은 이탈률)
  - [ ] 오류 이벤트 (결제 오류, 페이지 로드 실패)
  - [ ] 느린 응답 (각 이벤트의 duration을 다양하게)

- [ ] 최소 50-100개의 다양한 추적 데이터 생성

**예상 시간**: 1-2시간

---

## 우선순위 및 로드맵 🗓️

### Sprint 1 (필수 - 4-5일)
1. ✅ Phase 1.1: 캠페인 계층 구조
2. ✅ Phase 2.1: 필터 UI
3. ✅ Phase 3.1: Sankey 유입 흐름 그래프 (핵심!)

### Sprint 2 (중요 - 3-4일)
4. ✅ Phase 2.2: 실시간 필터링
5. ✅ Phase 4.1: 상세 페이지 레이아웃
6. ✅ Phase 5.1: 목 데이터 확장

### Sprint 3 (향상 - 2-3일)
7. ✅ Phase 1.2: 유입 흐름 구조
8. ✅ Phase 3.2: 이벤트 네트워크 그래프
9. ✅ Phase 4.2: 추가 메트릭

---

## 기술 스택 결정 사항 🛠️

### 시각화 라이브러리
- **추천**: `react-flow` (https://reactflow.dev/)
  - 이유: 노드/엣지 기반 다이어그램에 최적화, 커스터마이징 용이
  - 대안: `visx` (더 로우레벨, 세밀한 제어 필요 시)

### 상태 관리
- 현재: React hooks (useState, useMemo)
- 향후 고려: Zustand (전역 필터 상태 필요 시)

### 스타일링
- 현재: Tailwind CSS 유지
- 차트 커스텀 스타일: CSS-in-JS 또는 Tailwind 클래스

---

## 주의사항 ⚠️

1. **성능**: 많은 데이터 렌더링 시 가상 스크롤링 고려
2. **접근성**: 그래프에 키보드 네비게이션 및 스크린 리더 지원
3. **반응형**: 모바일에서는 심플한 뷰로 폴백
4. **데이터 로딩**: 추후 API 연동 시 Suspense/Error Boundary 적용

---

## 참고 자료 📚

- React Flow Docs: https://reactflow.dev/learn
- Sankey Diagram Examples: https://observablehq.com/@d3/sankey
- GA4 User Flow Report (참고용)
- Mixpanel Flows (참고용)

---

## 진행 상황 추적

- [ ] Sprint 1 시작
- [ ] Sprint 1 완료
- [ ] Sprint 2 시작
- [ ] Sprint 2 완료
- [ ] Sprint 3 시작
- [ ] Sprint 3 완료
- [ ] 최종 리뷰 및 테스트
