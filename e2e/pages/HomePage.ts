import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'
import type { SortKey } from '@/types/filter'

const SORT_LABEL: Record<SortKey, string> = {
  rating: '⭐ 평점순',
  cost: '💵 저렴한순',
  internet: '📡 인터넷빠른순',
  air: '🌤️ 공기좋은순',
}

export class HomePage extends BasePage {
  readonly searchInput: Locator
  readonly cityDetailLinks: Locator

  readonly sortByRatingButton: Locator
  readonly sortByCostButton: Locator
  readonly sortByInternetButton: Locator
  readonly sortByAirButton: Locator

  // 데스크탑 필터 패널 (lg 이상, aside 내)
  readonly filterPanel: Locator
  readonly highSpeedCheckbox: Locator
  readonly cleanAirCheckbox: Locator

  constructor(page: Page) {
    super(page)

    this.searchInput = page.getByRole('button', { name: '검색' }).locator('..')
      .locator('input[type="search"], input[placeholder]').or(
        page.locator('input[placeholder*="검색"]')
      )

    this.cityDetailLinks = page.getByRole('link', { name: /자세히/ })

    this.sortByRatingButton = page.getByRole('button', { name: SORT_LABEL.rating })
    this.sortByCostButton = page.getByRole('button', { name: SORT_LABEL.cost })
    this.sortByInternetButton = page.getByRole('button', { name: SORT_LABEL.internet })
    this.sortByAirButton = page.getByRole('button', { name: SORT_LABEL.air })

    this.filterPanel = page.locator('aside')
    this.highSpeedCheckbox = page.locator('[aria-label="초고속 인터넷만 보기"]')
    this.cleanAirCheckbox = page.locator('[aria-label="공기질 좋음 이상만 보기"]')
  }

  async goto() {
    await this.page.goto('/')
    await this.waitForLoad()
  }

  async search(query: string) {
    const input = this.page.locator('input[placeholder]').first()
    await input.fill(query)
  }

  async clearSearch() {
    const input = this.page.locator('input[placeholder]').first()
    await input.clear()
  }

  async sortBy(key: SortKey) {
    const buttons: Record<SortKey, Locator> = {
      rating: this.sortByRatingButton,
      cost: this.sortByCostButton,
      internet: this.sortByInternetButton,
      air: this.sortByAirButton,
    }
    await buttons[key].click()
  }

  async getCityCount(): Promise<number> {
    return this.cityDetailLinks.count()
  }

  async getCityNames(): Promise<string[]> {
    return this.page.getByRole('heading', { level: 3 }).allTextContents()
  }

  async getFirstCityName(): Promise<string> {
    return (await this.page.getByRole('heading', { level: 3 }).first().textContent()) ?? ''
  }

  async clickCityDetail(cityName: string) {
    await this.page
      .getByRole('heading', { level: 3, name: cityName })
      .locator('../../../..')
      .getByRole('link', { name: /자세히/ })
      .click()
  }

  async toggleTag(tag: string) {
    await this.page.getByRole('checkbox', { name: tag }).click()
  }

  async setHighSpeedFilter(on: boolean) {
    const checked = await this.highSpeedCheckbox.getAttribute('aria-checked').catch(() => null)
    const isChecked = checked === 'true'
    if (isChecked !== on) await this.highSpeedCheckbox.click()
  }

  async setCleanAirFilter(on: boolean) {
    const checked = await this.cleanAirCheckbox.getAttribute('aria-checked').catch(() => null)
    const isChecked = checked === 'true'
    if (isChecked !== on) await this.cleanAirCheckbox.click()
  }
}
