import { test, expect } from '@playwright/test'

// 필터 로직 기준값 (useCityFilter.ts)
// highSpeed: internetScore >= 8 → 서울·부산·대구·인천·광주·대전·수원 = 7개
// cleanAir: airScore >= 7  → 강릉·제주·전주·경주·대전·춘천 = 6개
// 두 조건 교집합 → 대전 1개

const SEARCH_INPUT = 'input[placeholder*="검색"]'

test.describe('도시 목록 필터', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('검색창에 도시 이름을 입력하면 해당 도시 카드만 표시된다', async ({ page }) => {
    const input = page.locator(SEARCH_INPUT).first()
    await input.fill('서울')

    const cards = page.getByRole('link', { name: /자세히/ })
    await expect(cards).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(['서울'])
  })

  test('검색창에 존재하지 않는 도시 이름을 입력하면 카드가 표시되지 않는다', async ({ page }) => {
    const input = page.locator(SEARCH_INPUT).first()
    await input.fill('존재하지않는도시xyz')

    const cards = page.getByRole('link', { name: /자세히/ })
    await expect(cards).toHaveCount(0)
  })

  test('검색창을 비우면 전체 도시 카드가 다시 표시된다', async ({ page }) => {
    const input = page.locator(SEARCH_INPUT).first()
    await input.fill('서울')
    await expect(page.getByRole('link', { name: /자세히/ })).toHaveCount(1)

    await input.clear()
    const allCards = page.getByRole('link', { name: /자세히/ })
    await expect(allCards).toHaveCount(12)
  })

  test('"초고속 인터넷만 보기" 체크박스를 켜면 인터넷 점수 높은 도시만 표시된다', async ({ page }) => {
    const checkbox = page.locator('[aria-label="초고속 인터넷만 보기"]')
    await checkbox.click()

    // internetScore >= 8: 서울·부산·대구·인천·광주·대전·수원 = 7개
    await expect(page.getByRole('link', { name: /자세히/ })).toHaveCount(7)
  })

  test('"공기질 좋음 이상만 보기" 체크박스를 켜면 공기 점수 높은 도시만 표시된다', async ({ page }) => {
    const checkbox = page.locator('[aria-label="공기질 좋음 이상만 보기"]')
    await checkbox.click()

    // airScore >= 7: 강릉·제주·전주·경주·대전·춘천 = 6개
    await expect(page.getByRole('link', { name: /자세히/ })).toHaveCount(6)
  })

  test('두 필터를 동시에 켜면 두 조건을 모두 만족하는 도시만 표시된다', async ({ page }) => {
    await page.locator('[aria-label="초고속 인터넷만 보기"]').click()
    await page.locator('[aria-label="공기질 좋음 이상만 보기"]').click()

    // internet >= 8 AND air >= 7 → 대전만 해당 = 1개
    await expect(page.getByRole('link', { name: /자세히/ })).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 3 })).toHaveText(['대전'])
  })

  test('지역 태그를 클릭하면 해당 태그 도시만 표시된다', async ({ page }) => {
    // #바다 태그 → 강릉·부산 = 2개
    await page.getByRole('checkbox', { name: '#바다' }).click()

    await expect(page.getByRole('link', { name: /자세히/ })).toHaveCount(2)
    const names = await page.getByRole('heading', { level: 3 }).allTextContents()
    expect(names).toContain('강릉')
    expect(names).toContain('부산')
  })

  test('활성화된 지역 태그를 다시 클릭하면 필터가 해제된다', async ({ page }) => {
    const tag = page.getByRole('checkbox', { name: '#바다' })
    await tag.click()
    await expect(page.getByRole('link', { name: /자세히/ })).toHaveCount(2)

    // 다시 클릭해서 해제
    await tag.click()
    await expect(page.getByRole('link', { name: /자세히/ })).toHaveCount(12)
  })
})
