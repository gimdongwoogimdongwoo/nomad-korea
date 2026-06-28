import { test, expect } from '@playwright/test'

// 찜 버튼의 Heart SVG fill-current 클래스로 상태를 판별
async function isHearted(page: import('@playwright/test').Page, nth = 0) {
  const svg = page.getByRole('button', { name: '찜' }).nth(nth).locator('svg')
  const cls = await svg.getAttribute('class') ?? ''
  return cls.includes('fill-current')
}

test.describe('위시리스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('로그인 상태에서 도시 카드의 하트 버튼을 클릭하면 찜 상태가 변경된다', async ({ page }) => {
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능합니다')
      return
    }

    const before = await isHearted(page, 0)
    await page.getByRole('button', { name: '찜' }).first().click()
    await page.waitForTimeout(1000)
    const after = await isHearted(page, 0)

    expect(after).not.toBe(before)
  })

  test('찜이 추가되면 하트 아이콘이 채워진 상태로 표시된다', async ({ page }) => {
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능합니다')
      return
    }

    // 찜이 되지 않은 상태로 초기화
    if (await isHearted(page, 0)) {
      await page.getByRole('button', { name: '찜' }).first().click()
      await page.waitForTimeout(800)
    }

    // 찜 추가
    await page.getByRole('button', { name: '찜' }).first().click()
    await page.waitForTimeout(1000)

    expect(await isHearted(page, 0)).toBe(true)
  })

  test('채워진 하트 버튼을 다시 클릭하면 찜이 해제된다', async ({ page }) => {
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능합니다')
      return
    }

    // 찜 상태로 만들기
    if (!(await isHearted(page, 0))) {
      await page.getByRole('button', { name: '찜' }).first().click()
      await page.waitForTimeout(800)
    }

    // 찜 해제
    await page.getByRole('button', { name: '찜' }).first().click()
    await page.waitForTimeout(1000)

    expect(await isHearted(page, 0)).toBe(false)
  })

  test('비로그인 상태에서 하트 버튼을 클릭하면 로그인 페이지로 이동한다', async ({ page }) => {
    // 이 테스트는 로그인 상태면 의미 없으므로 skip
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (isLoggedIn) {
      test.skip(true, '비로그인 상태에서만 실행 가능합니다')
      return
    }

    await page.getByRole('button', { name: '찜' }).first().click()
    await expect(page).toHaveURL('/login', { timeout: 10000 })
  })

  test('페이지를 새로고침해도 찜 상태가 유지된다', async ({ page }) => {
    const isLoggedIn = await page.getByRole('button', { name: '로그아웃' }).isVisible()
    if (!isLoggedIn) {
      test.skip(true, '로그인 상태에서만 실행 가능합니다')
      return
    }

    // 찜 추가
    if (!(await isHearted(page, 0))) {
      await page.getByRole('button', { name: '찜' }).first().click()
      await page.waitForTimeout(1000)
    }

    // 새로고침
    await page.reload()
    await page.waitForLoadState('networkidle')

    // 찜 상태 유지 확인
    expect(await isHearted(page, 0)).toBe(true)

    // 정리: 찜 해제
    await page.getByRole('button', { name: '찜' }).first().click()
    await page.waitForTimeout(500)
  })
})
