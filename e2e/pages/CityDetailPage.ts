import type { Page, Locator } from '@playwright/test'
import { BasePage } from './BasePage'

export class CityDetailPage extends BasePage {
  readonly cityName: Locator
  readonly regionText: Locator
  readonly ratingText: Locator
  readonly rankBadge: Locator
  readonly gaugeMeters: Locator
  readonly wishlistButton: Locator
  readonly backButton: Locator

  // 비로그인 시 리뷰 안내
  readonly reviewLoginPrompt: Locator

  // 리뷰 작성 폼 (로그인 시)
  readonly reviewForm: Locator
  readonly reviewTextarea: Locator
  readonly reviewSubmitButton: Locator
  readonly reviewSuccessMsg: Locator
  readonly reviewErrorMsg: Locator

  // 리뷰 목록
  readonly reviewItems: Locator

  constructor(page: Page) {
    super(page)

    this.cityName = page.locator('h1')
    this.regionText = page.locator('main p.text-muted-foreground').first()
    this.ratingText = page.locator('p.text-xl.font-semibold')
    this.rankBadge = page.locator('main').getByText(/^#\d+$/)

    this.gaugeMeters = page.getByRole('meter')

    this.wishlistButton = page.getByRole('button', { name: '찜' })

    this.backButton = page.getByRole('link', { name: /목록으로/ })

    this.reviewLoginPrompt = page.getByText(/후기를 남기려면/)

    this.reviewForm = page.locator('form.rounded-xl')
    this.reviewTextarea = page.locator('textarea[name="content"]')
    this.reviewSubmitButton = page.getByRole('button', { name: '후기 등록' })
    this.reviewSuccessMsg = page.getByText('후기가 등록되었습니다!')
    this.reviewErrorMsg = page.locator('form .text-destructive')

    this.reviewItems = page.locator('section').last().locator('.rounded-xl.border.p-4')
  }

  async goto(cityId: string) {
    await this.page.goto(`/cities/${cityId}`)
    await this.waitForLoad()
  }

  async isWishlisted(): Promise<boolean> {
    const svg = this.wishlistButton.locator('svg')
    const cls = await svg.getAttribute('class') ?? ''
    return cls.includes('fill-current')
  }

  async toggleWishlist() {
    await this.wishlistButton.click()
  }

  async clickStarRating(rating: number) {
    await this.page.getByRole('button', { name: `${rating}점` }).click()
  }

  async submitReview(rating: number, content: string) {
    await this.clickStarRating(rating)
    await this.reviewTextarea.fill(content)
    await this.reviewSubmitButton.click()
  }

  async getReviewCount(): Promise<number> {
    return this.reviewItems.count()
  }
}
