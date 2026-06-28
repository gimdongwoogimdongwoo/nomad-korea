import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class RegisterPage extends BasePage {
  readonly nameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly termsCheckbox: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly loginLink: Locator

  constructor(page: Page) {
    super(page)

    this.nameInput = page.locator('#name')
    this.emailInput = page.locator('#email')
    this.passwordInput = page.locator('#password')
    this.termsCheckbox = page.locator('#terms')
    this.submitButton = page.getByRole('button', { name: '회원가입' })
    this.errorMessage = page.locator('.text-destructive')
    this.loginLink = page.getByRole('link', { name: '로그인' })
  }

  async goto() {
    await this.page.goto('/register')
    await this.waitForLoad()
  }

  async register(name: string, email: string, password: string) {
    await this.nameInput.fill(name)
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.termsCheckbox.click()
    await this.submitButton.click()
  }
}
