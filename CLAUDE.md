# Nomad Korea — 개발 가이드

## 프로젝트 개요

한국 노마드·디지털 워커를 위한 도시 추천 웹앱.  
Next.js 15 App Router + Supabase + Tailwind CSS.

## 기술 스택

- **프레임워크**: Next.js 15 App Router (RSC, Server Actions)
- **백엔드**: Supabase (PostgreSQL, Auth, RLS)
- **스타일**: Tailwind CSS + shadcn/ui
- **패키지 매니저**: pnpm
- **단위 테스트**: Vitest + React Testing Library
- **E2E 테스트**: Playwright

---

## 단위 테스트 (Vitest)

```bash
pnpm test        # watch 모드
pnpm test --run  # CI 1회 실행
```

- 설정: `vitest.config.ts`, `vitest.setup.ts`
- 테스트 파일: 소스 파일 옆에 co-located (`.test.ts` / `.test.tsx`)
- 공통 fixture: `tests/fixtures/city.fixture.ts`
- 총 135개 케이스, 12개 파일

---

## E2E 테스트 (Playwright)

### 실행

```bash
# 개발 서버가 실행 중이어야 함 (pnpm dev)
pnpm playwright test              # 전체 실행
pnpm playwright test --ui         # UI 모드
pnpm playwright test --list       # 테스트 목록 확인
pnpm playwright show-report e2e/report  # HTML 리포트 열기
```

### 폴더 구조

```
e2e/
├── .auth/               # storageState 저장 위치 (.gitignore에 포함)
│   └── .gitkeep
├── fixtures/
│   ├── auth.setup.ts    # 로그인 세션 생성 (setup 프로젝트에서 1회 실행)
│   └── index.ts         # POM 인스턴스를 test fixture로 주입
├── pages/               # Page Object Model (POM)
│   ├── BasePage.ts      # 헤더 공통 로케이터 + goto / waitForLoad / isLoggedIn
│   ├── HomePage.ts      # 검색 · 정렬 · 필터 로케이터 및 헬퍼 메서드
│   ├── CityDetailPage.ts# 상세 페이지 · 찜 · 리뷰 폼 로케이터 및 헬퍼 메서드
│   ├── LoginPage.ts     # 로그인 폼 로케이터 및 login() 헬퍼
│   └── RegisterPage.ts  # 회원가입 폼 로케이터 및 register() 헬퍼
└── specs/               # 테스트 스펙 파일
    ├── auth/
    │   ├── login.spec.ts     (4 케이스)
    │   └── register.spec.ts  (3 케이스)
    ├── city-list/
    │   ├── display.spec.ts   (4 케이스)
    │   └── filter.spec.ts    (8 케이스)
    ├── city-detail/
    │   ├── display.spec.ts   (6 케이스)
    │   └── review.spec.ts    (4 케이스)  ← user 프로젝트(로그인)
    └── wishlist/
        └── wishlist.spec.ts  (5 케이스)  ← user 프로젝트(로그인)
```

### Playwright 프로젝트 구성 (`playwright.config.ts`)

| 프로젝트 | 역할 | 실행 파일 |
|----------|------|-----------|
| `setup`  | 로그인 세션 생성 → `e2e/.auth/user.json` 저장 | `auth.setup.ts` |
| `guest`  | 비로그인 시나리오 | `auth.setup.ts` 제외 전체 |
| `user`   | 로그인 필요 시나리오 (`setup` 완료 후 실행) | `*.review.spec.ts`, `*.wishlist.spec.ts` |

### 인증 세션 준비

```bash
# .env.local 또는 쉘에서 환경 변수 설정
export TEST_USER_EMAIL="your@email.com"
export TEST_USER_PASSWORD="yourpassword"

# setup 프로젝트만 실행해서 세션 파일 생성
pnpm playwright test --project=setup
```

- 생성된 `e2e/.auth/user.json`은 `.gitignore`에 포함되어 있으므로 커밋되지 않음
- `user` 프로젝트는 `storageState` 옵션으로 이 파일을 자동으로 로드

### 커스텀 Fixture 사용법

`e2e/fixtures/index.ts`에서 `test`를 import하면 POM 인스턴스가 자동 주입됨:

```typescript
import { test, expect } from '../../fixtures'

test('홈 화면 표시', async ({ homePage }) => {
  await homePage.goto()
  expect(await homePage.getCityCount()).toBeGreaterThan(0)
})
```

> 현재 스펙 파일은 `test.skip` placeholder 상태. 구현 시 `@playwright/test` 대신
> `../../fixtures`에서 import하고 POM fixture를 활용할 것.

---

## 환경 변수 (`.env.local`)

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 |
| `TEST_USER_EMAIL` | E2E 테스트용 계정 이메일 |
| `TEST_USER_PASSWORD` | E2E 테스트용 계정 비밀번호 |
