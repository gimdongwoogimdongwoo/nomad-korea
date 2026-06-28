import { test, expect } from '@playwright/test'

test.describe('도시 목록 표시', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('홈 페이지 접속 시 도시 카드가 1개 이상 표시된다', async ({ page }) => {
    const cityLinks = page.getByRole('link', { name: /자세히/ })
    await expect(cityLinks.first()).toBeVisible()
    const count = await cityLinks.count()
    expect(count).toBeGreaterThan(0)
  })

  test('각 도시 카드에 도시 이름·지역·비용·평점이 표시된다', async ({ page }) => {
    // 도시 이름 h3
    await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible()

    // 비용 (₩) — 페이지 어딘가에 존재
    await expect(page.getByText(/₩/).first()).toBeVisible()

    // 평점 (⭐) — 페이지 어딘가에 존재
    await expect(page.getByText(/⭐ \d/).first()).toBeVisible()

    // 지역 — muted 텍스트
    await expect(page.locator('p.text-xs.text-muted-foreground').first()).toBeVisible()
  })

  test('평점순 정렬 버튼을 클릭하면 카드가 평점 내림차순으로 재정렬된다', async ({ page }) => {
    // 저렴한순으로 바꿨다가 다시 평점순으로 돌아오면 서울이 첫 번째여야 함
    await page.getByRole('button', { name: '💵 저렴한순' }).click()
    const costFirstCity = await page.getByRole('heading', { level: 3 }).first().textContent()

    await page.getByRole('button', { name: '⭐ 평점순' }).click()
    const ratingFirstCity = await page.getByRole('heading', { level: 3 }).first().textContent()

    // 평점 1위는 서울, 저렴한 순 1위는 다른 도시
    expect(ratingFirstCity).toBe('서울')
    expect(costFirstCity).not.toBe('서울')
  })

  test('저렴한순 정렬 버튼을 클릭하면 카드가 비용 오름차순으로 재정렬된다', async ({ page }) => {
    // 기본(평점순) 첫 번째 도시
    const defaultFirst = await page.getByRole('heading', { level: 3 }).first().textContent()

    await page.getByRole('button', { name: '💵 저렴한순' }).click()

    const costFirst = await page.getByRole('heading', { level: 3 }).first().textContent()
    // 저렴한순으로 정렬하면 첫 번째 도시가 바뀐다 (서울은 비싸므로 1등이 아님)
    expect(costFirst).not.toBe(defaultFirst)
    expect(defaultFirst).toBe('서울') // 평점 1위는 서울
  })
})
