import type { Page, Locator } from '@playwright/test'

export class BasePage {
  readonly page: Page

  // Header 공통 요소
  readonly header: Locator
  readonly logoLink: Locator
  readonly loginButton: Locator
  readonly registerButton: Locator
  readonly logoutButton: Locator
  readonly userLabel: Locator

  constructor(page: Page) {
    this.page = page

    this.header = page.locator('header')
    this.logoLink = page.getByRole('link', { name: '노마드코리아' })
    this.loginButton = page.getByRole('link', { name: '로그인' })
    this.registerButton = page.getByRole('link', { name: '회원가입' })
    this.logoutButton = page.getByRole('button', { name: '로그아웃' })
    this.userLabel = page.locator('header span.truncate')
  }

  async goto(path: string = '/') {
    await this.page.goto(path)
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle')
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutButton.isVisible()
  }
}
