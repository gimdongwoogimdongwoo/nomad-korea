import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CityCard } from '@/components/city/CityCard'
import { mockSeoul } from '@/tests/fixtures/city.fixture'

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

vi.mock('@/components/city/WishlistButton', () => ({
  WishlistButton: ({ cityId, isWishlisted }: { cityId: string; isWishlisted: boolean }) => (
    <button data-testid="wishlist-btn" data-city-id={cityId} data-wishlisted={String(isWishlisted)}>찜</button>
  ),
}))

describe('CityCard', () => {
  it('73. 도시 이름 렌더링', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByText('서울')).toBeInTheDocument()
  })

  it('74. 지역명 렌더링', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByText('서울특별시')).toBeInTheDocument()
  })

  it('75. 랭크 배지 #1 렌더링', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByText('#1')).toBeInTheDocument()
  })

  it('76. 평점 4.8 렌더링', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByText(/4\.8/)).toBeInTheDocument()
  })

  it('77. 월 생활비 ₩2,924,000 포맷', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByText('₩2,924,000')).toBeInTheDocument()
  })

  it('78. 원룸 월세 ₩850,000 포맷', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByText('₩850,000')).toBeInTheDocument()
  })

  it('79. 좋아요 aria-label에 3200 포함', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByLabelText(/좋아요 3200/)).toBeInTheDocument()
  })

  it('80. 태그 배지 전부 렌더링', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    for (const tag of mockSeoul.tags) {
      expect(screen.getByText(tag)).toBeInTheDocument()
    }
  })

  it('81. 자세히 링크 href="/cities/seoul"', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    const link = screen.getByRole('link', { name: /자세히/ })
    expect(link).toHaveAttribute('href', '/cities/seoul')
  })

  it('82. GaugeBar role="meter" 4개 렌더링', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getAllByRole('meter')).toHaveLength(4)
  })

  it('83. isWishlisted=true → data-wishlisted="true"', () => {
    render(<CityCard city={mockSeoul} isWishlisted={true} />)
    expect(screen.getByTestId('wishlist-btn')).toHaveAttribute('data-wishlisted', 'true')
  })

  it('84. isWishlisted=false → data-wishlisted="false"', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByTestId('wishlist-btn')).toHaveAttribute('data-wishlisted', 'false')
  })

  it('85. WishlistButton에 cityId 올바르게 전달', () => {
    render(<CityCard city={mockSeoul} isWishlisted={false} />)
    expect(screen.getByTestId('wishlist-btn')).toHaveAttribute('data-city-id', 'seoul')
  })
})
