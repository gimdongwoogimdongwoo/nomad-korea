# Nomad Korea — 개선 SPEC

## Phase 1: 핵심 기능 완성 (필터·정렬·검색 연결)

### 개요
UI는 구현돼 있지만 필터·정렬·검색 상태가 도시 목록에 반영되지 않음.
상태를 page.tsx로 lift-up하고 `useCityFilter` 커스텀 훅으로 로직을 캡슐화.
데이터베이스 없이 `/data/cities.ts` 하드코딩 데이터로 구현.

### 구현 항목
- [x] `types/filter.ts` — `FilterState` 인터페이스, `SortKey` 유니온 타입 생성
- [x] `hooks/useCityFilter.ts` — 필터·정렬·검색 로직 커스텀 훅 생성
- [x] `SortBar.tsx` — 내부 state 제거, controlled props 수용
- [x] `CityGrid.tsx` — `sortKey`/`onSortChange` props 추가, `"use client"` 추가
- [x] `SearchBar.tsx` — 내부 state 제거, `value`/`onChange` props 수용
- [x] `HeroSection.tsx` — `searchQuery`/`onSearchChange` props 추가 후 SearchBar에 전달
- [x] `FilterPanel.tsx` — 내부 state 4개 제거, "필터 적용" 버튼 제거, controlled props 수용
- [x] `MobileFilterSheet.tsx` — `filter`/`onFilterChange` props 추가 후 FilterPanel에 전달
- [x] `app/page.tsx` — `"use client"` 추가, `useCityFilter` 연결, 모든 자식에 state 배포

### 검증 항목
- [ ] 정렬 버튼 4개 (평점·저렴·인터넷·공기)가 실제로 순서를 바꿈
- [ ] 검색창에 "부산" 입력 시 즉시 부산 카드만 표시
- [ ] 검색창에 "강원도" 입력 시 region 매칭 (강릉, 춘천) 표시
- [ ] 빈 검색어 시 전체 도시 표시
- [ ] 예산 슬라이더 조정 시 도시 필터링
- [ ] "초고속만" 체크 시 internetScore < 8 도시 제거
- [ ] "좋음 이상" 체크 시 airScore < 7 도시 제거
- [ ] 태그 선택 시 해당 태그를 가진 도시만 표시
- [ ] 태그 2개 선택 시 둘 다 가진 도시만 표시
- [ ] 모바일 필터 Sheet가 데스크탑 FilterPanel과 동일한 state 공유
- [ ] "필터 적용" 버튼이 없음
- [ ] `pnpm lint && pnpm tsc --noEmit` 오류 없음

---

## Phase 2: 도시 상세 페이지

### 개요
각 도시 카드의 "자세히 보기" 버튼 클릭 시 이동하는 상세 페이지 구현.
가짜 데이터(리뷰 목록, 사진 플레이스홀더 등) 사용.

### 구현 항목
- [x] `app/cities/[id]/page.tsx` — 동적 라우트 생성
- [x] 도시 헤더 (이름, 이모지, 지역, 랭킹, 평점)
- [x] 전체 지표 섹션 (생활비, 월세, 인터넷, 카페, 공기, 교통 상세)
- [x] 가짜 리뷰 목록 컴포넌트 (mock 데이터)
- [x] "뒤로 가기" 네비게이션
- [x] CityCard의 "자세히 보기" 버튼에 링크 연결

### 검증 항목
- [ ] 도시 카드 "자세히 보기" 클릭 시 `/cities/seoul` 등으로 이동
- [ ] 존재하지 않는 도시 ID 접근 시 404 처리
- [ ] 모든 지표가 정확히 표시
- [ ] 뒤로 가기 동작
- [ ] `pnpm lint && pnpm tsc --noEmit` 오류 없음

---

## Phase 3: 유저 기능 (위시리스트·리뷰)

### 개요
로그인 유저가 도시를 위시리스트에 저장하고 리뷰를 작성할 수 있는 기능.
DB 없이 로컬 상태(또는 localStorage)로 구현.

### 구현 항목
- [ ] 위시리스트 상태 관리 (로컬, 세션 범위)
- [ ] CityCard 하트 버튼 기능 연결
- [ ] 위시리스트 목록 페이지 또는 섹션
- [ ] 리뷰 작성 폼 (별점, 텍스트)
- [ ] 가짜 리뷰 데이터에 사용자 리뷰 추가 (로컬 상태)
- [ ] 로그인 필요 UI (비로그인 시 안내)

### 검증 항목
- [ ] 하트 버튼 클릭 시 위시리스트 추가/제거
- [ ] 페이지 새로고침 후 위시리스트 유지 (localStorage)
- [ ] 리뷰 작성 후 목록에 즉시 반영
- [ ] 비로그인 시 리뷰/위시리스트 시도 시 로그인 유도
- [ ] `pnpm lint && pnpm tsc --noEmit` 오류 없음

---

## Phase 4: 콘텐츠 페이지 (한달살기·코워킹·밋업)

### 개요
헤더 네비게이션의 "한달살기", "코워킹", "밋업" 링크가 실제 페이지로 연결.
가짜 콘텐츠 데이터로 구현.

### 구현 항목
- [ ] `app/workation/page.tsx` — 한달살기 가이드/도시 추천
- [ ] `app/coworking/page.tsx` — 코워킹 스페이스 목록 (가짜 데이터)
- [ ] `app/meetups/page.tsx` — 밋업 이벤트 목록 (가짜 데이터)
- [ ] 각 페이지 mock 데이터 파일
- [ ] Header 네비게이션 링크 연결
- [ ] BottomBanner 링크 연결

### 검증 항목
- [ ] 헤더 "한달살기" 클릭 시 `/workation` 이동
- [ ] 헤더 "코워킹" 클릭 시 `/coworking` 이동
- [ ] 헤더 "밋업" 클릭 시 `/meetups` 이동
- [ ] 각 페이지 콘텐츠 정상 렌더링
- [ ] `pnpm lint && pnpm tsc --noEmit` 오류 없음
