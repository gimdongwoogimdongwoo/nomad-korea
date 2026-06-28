import { test as setup } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '../.auth/user.json')

setup('로그인 상태 저장', async ({ page }) => {
  const email = process.env.TEST_USER_EMAIL ?? ''
  const password = process.env.TEST_USER_PASSWORD ?? ''

  if (!email || !password) {
    throw new Error('TEST_USER_EMAIL / TEST_USER_PASSWORD 환경 변수를 설정해주세요.')
  }

  await page.goto('/login')
  await page.getByLabel('이메일').fill(email)
  await page.getByLabel('비밀번호').fill(password)
  await page.getByRole('button', { name: '로그인' }).click()

  // 로그인 성공 후 헤더에 로그아웃 버튼이 보일 때까지 대기
  await page.getByRole('button', { name: '로그아웃' }).waitFor()

  // 인증 쿠키/스토리지를 파일로 저장 — user 프로젝트가 재사용
  await page.context().storageState({ path: authFile })
})
