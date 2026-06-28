import { test as base } from '@playwright/test'
import { HomePage } from '../pages/HomePage'
import { CityDetailPage } from '../pages/CityDetailPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

type Fixtures = {
  homePage: HomePage
  cityDetailPage: CityDetailPage
  loginPage: LoginPage
  registerPage: RegisterPage
}

export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page))
  },
  cityDetailPage: async ({ page }, use) => {
    await use(new CityDetailPage(page))
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page))
  },
})

export { expect } from '@playwright/test'
