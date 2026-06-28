import { test, expect } from '@playwright/test'

// user 프로젝트(로그인 상태)에서만 의미 있는 테스트
const TEST_CITY_ID = 'chuncheon' // 춘천 - 테스트 리뷰 전용

test.describe('리뷰 작성', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/cities/${TEST_CITY_ID}`)
    await page.waitForLoadState('networkidle')
  })

  test('로그인 상태에서 별점·내용을 입력하고 등록하면 성공 메시지가 표시된다', async ({ page }) => {
    // 로그인 여부 확인 (storageState 없으면 skip)
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능한 테스트입니다')
      return
    }

    const content = `E2E 테스트 리뷰 - ${Date.now()}`
    await page.getByRole('button', { name: '5점' }).click()
    await page.locator('textarea[name="content"]').fill(content)
    await page.getByRole('button', { name: '후기 등록' }).click()

    await expect(page.getByText('후기가 등록되었습니다!')).toBeVisible({ timeout: 10000 })
  })

  test('리뷰 내용이 10자 미만이면 에러 메시지가 표시된다', async ({ page }) => {
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능한 테스트입니다')
      return
    }

    await page.getByRole('button', { name: '3점' }).click()
    await page.locator('textarea[name="content"]').fill('짧음')  // 3자 (10자 미만)
    await page.getByRole('button', { name: '후기 등록' }).click()

    await expect(page.locator('form .text-destructive')).toBeVisible({ timeout: 10000 })
  })

  test('리뷰 등록 성공 후 성공 메시지가 표시된다', async ({ page }) => {
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능한 테스트입니다')
      return
    }

    const content = `성공 메시지 테스트 - ${Date.now()}`
    await page.getByRole('button', { name: '4점' }).click()
    await page.locator('textarea[name="content"]').fill(content)
    await page.getByRole('button', { name: '후기 등록' }).click()

    await expect(page.getByText('후기가 등록되었습니다!')).toBeVisible({ timeout: 10000 })
  })

  test('등록된 리뷰에 별점이 표시된다', async ({ page }) => {
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능한 테스트입니다')
      return
    }

    const content = `별점 확인 테스트 - ${Date.now()}`
    await page.getByRole('button', { name: '5점' }).click()
    await page.locator('textarea[name="content"]').fill(content)
    await page.getByRole('button', { name: '후기 등록' }).click()
    await expect(page.getByText('후기가 등록되었습니다!')).toBeVisible({ timeout: 10000 })

    // 페이지 새로고침 후 리뷰 목록에서 별점 확인
    await page.reload()
    await page.waitForLoadState('networkidle')

    const reviewItems = page.locator('section').last().locator('.rounded-xl.border.p-4')
    const firstReview = reviewItems.first()
    await expect(firstReview.getByText(/⭐/)).toBeVisible()
  })
})
