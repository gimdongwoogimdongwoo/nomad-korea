import { test, expect } from '@playwright/test'

// 강릉(gangneung): rank #2, rating 4.6, region "강원도 · 동해안", monthlyCost ₩1,850,000
const TEST_CITY_ID = 'gangneung'
const TEST_CITY_NAME = '강릉'

test.describe('도시 상세 표시', () => {
  test('도시 카드의 "자세히" 링크를 클릭하면 해당 도시 상세 페이지로 이동한다', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const firstLink = page.getByRole('link', { name: /자세히/ }).first()
    await firstLink.click()

    await expect(page).toHaveURL(/\/cities\//)
    await expect(page.locator('h1')).toBeVisible()
  })

  test('상세 페이지에 도시 이름·지역·순위·평점이 표시된다', async ({ page }) => {
    await page.goto(`/cities/${TEST_CITY_ID}`)
    await page.waitForLoadState('networkidle')

    // 도시 이름
    await expect(page.locator('h1')).toHaveText(TEST_CITY_NAME)

    // 순위 배지 (#2)
    await expect(page.locator('main').getByText(/^#\d+$/)).toBeVisible()

    // 평점 (⭐ 4.6)
    await expect(page.locator('p.text-xl.font-semibold')).toContainText('⭐')

    // 지역
    await expect(page.locator('main').getByText('강원도')).toBeVisible()
  })

  test('인터넷·카페·공기·교통 4개의 게이지 바가 표시된다', async ({ page }) => {
    await page.goto(`/cities/${TEST_CITY_ID}`)
    await page.waitForLoadState('networkidle')

    await expect(page.getByRole('meter')).toHaveCount(4)
  })

  test('월 예상 비용이 표시된다', async ({ page }) => {
    await page.goto(`/cities/${TEST_CITY_ID}`)
    await page.waitForLoadState('networkidle')

    // 생활비 섹션에 ₩ 표시 확인
    const costSection = page.locator('section').filter({ hasText: '생활비' })
    await expect(costSection.getByText(/₩/).first()).toBeVisible()
  })

  test('"목록으로" 링크를 클릭하면 홈 페이지로 돌아간다', async ({ page }) => {
    await page.goto(`/cities/${TEST_CITY_ID}`)
    await page.waitForLoadState('networkidle')

    await page.getByRole('link', { name: /목록으로/ }).click()
    await expect(page).toHaveURL('/')
  })

  test('비로그인 상태에서 리뷰 폼 대신 로그인 안내 메시지가 표시된다', async ({ page }) => {
    await page.goto(`/cities/${TEST_CITY_ID}`)
    await page.waitForLoadState('networkidle')

    // 로그인 안내 텍스트 확인
    await expect(page.getByText(/후기를 남기려면/)).toBeVisible()

    // 리뷰 textarea 없음
    await expect(page.locator('textarea')).not.toBeVisible()
  })
})
