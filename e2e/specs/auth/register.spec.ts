import { test, expect } from '@playwright/test'

test.describe('회원가입', () => {
  test('이름·이메일·비밀번호를 입력하고 가입하면 이메일 확인 페이지로 이동한다', async ({ page }) => {
    const uniqueEmail = `playwright+${Date.now()}@test-nomad.com`

    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await page.locator('#name').fill('플레이라이트 테스터')
    await page.locator('#email').fill(uniqueEmail)
    await page.locator('#password').fill('Password123!')
    // shadcn Checkbox는 button[role=checkbox]로 렌더링됨
    await page.getByRole('checkbox').click()
    await page.getByRole('button', { name: '회원가입' }).click()

    await expect(page).toHaveURL('/auth/verify-email', { timeout: 15000 })
    await expect(page.getByText('이메일을 확인해주세요')).toBeVisible()
  })

  test('약관 동의 없이 제출하면 폼 유효성 오류로 페이지가 유지된다', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await page.locator('#name').fill('테스터')
    await page.locator('#email').fill('test@example.com')
    await page.locator('#password').fill('Password123!')
    // terms 체크 안 함 — 브라우저 required 검증으로 제출 막힘
    await page.getByRole('button', { name: '회원가입' }).click({ force: true })

    // terms에 required가 있으므로 제출이 막혀 페이지 이동 없음
    await expect(page).toHaveURL('/register')
  })

  test('회원가입 페이지에서 로그인 링크를 클릭하면 로그인 페이지로 이동한다', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await page.getByRole('link', { name: '로그인' }).click()
    await expect(page).toHaveURL('/login')
  })
})
