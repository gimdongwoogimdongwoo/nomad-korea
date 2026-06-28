import { test, expect } from '@playwright/test'

test.describe('로그인', () => {
  test('올바른 이메일/비밀번호로 로그인하면 홈으로 이동하고 헤더에 로그아웃 버튼이 표시된다', async ({ page }) => {
    const email = process.env.TEST_USER_EMAIL
    const password = process.env.TEST_USER_PASSWORD
    if (!email || !password) {
      test.skip(true, 'TEST_USER_EMAIL / TEST_USER_PASSWORD 환경 변수가 없습니다')
      return
    }

    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.locator('#email').fill(email)
    await page.locator('#password').fill(password)
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page).toHaveURL('/', { timeout: 15000 })
    await expect(page.getByRole('button', { name: '로그아웃' })).toBeVisible()
  })

  test('잘못된 비밀번호로 로그인하면 에러 메시지가 표시된다', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.locator('#email').fill('nonexistent@test-nomad.com')
    await page.locator('#password').fill('wrongpassword123')
    await page.getByRole('button', { name: '로그인' }).click()

    await expect(page.locator('.text-destructive')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('.text-destructive')).toContainText('이메일 또는 비밀번호')
  })

  test('이메일 형식이 올바르지 않으면 페이지를 벗어나지 않는다', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.locator('#email').fill('not-an-email')
    await page.locator('#password').fill('password123')
    await page.getByRole('button', { name: '로그인' }).click()

    // HTML5 type="email" 유효성 검사로 제출이 막힌다
    await expect(page).toHaveURL('/login')
  })

  test('로그인 페이지에서 회원가입 링크를 클릭하면 회원가입 페이지로 이동한다', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: '회원가입' }).click()
    await expect(page).toHaveURL('/register')
  })
})
