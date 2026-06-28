import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CityGrid } from '@/components/city/CityGrid'
import { mockCities } from '@/tests/fixtures/city.fixture'

vi.mock('@/components/city/CityCard', () => ({
  CityCard: ({ city, isWishlisted }: { city: { id: string; name: string }; isWishlisted: boolean }) => (
    <div data-testid={`city-card-${city.id}`} data-wishlisted={String(isWishlisted)}>
      {city.name}
    </div>
  ),
}))

describe('CityGrid', () => {
  it('86. 도시 수만큼 CityCard 렌더링', () => {
    render(<CityGrid cities={mockCities} />)
    expect(screen.getAllByTestId(/^city-card-/)).toHaveLength(mockCities.length)
  })

  it('87. 빈 배열 → CityCard 0개', () => {
    render(<CityGrid cities={[]} />)
    expect(screen.queryAllByTestId(/^city-card-/)).toHaveLength(0)
  })

  it('88. wishlistedIds=["seoul"] → 서울 카드 data-wishlisted="true"', () => {
    render(<CityGrid cities={mockCities} wishlistedIds={['seoul']} />)
    expect(screen.getByTestId('city-card-seoul')).toHaveAttribute('data-wishlisted', 'true')
  })

  it('89. wishlistedIds=["seoul"] → 다른 카드들 data-wishlisted="false"', () => {
    render(<CityGrid cities={mockCities} wishlistedIds={['seoul']} />)
    expect(screen.getByTestId('city-card-gangneung')).toHaveAttribute('data-wishlisted', 'false')
    expect(screen.getByTestId('city-card-jeju')).toHaveAttribute('data-wishlisted', 'false')
    expect(screen.getByTestId('city-card-chuncheon')).toHaveAttribute('data-wishlisted', 'false')
  })

  it('90. wishlistedIds 기본값(미전달) → 전체 data-wishlisted="false"', () => {
    render(<CityGrid cities={mockCities} />)
    for (const city of mockCities) {
      expect(screen.getByTestId(`city-card-${city.id}`)).toHaveAttribute('data-wishlisted', 'false')
    }
  })

  it('91. sortKey="cost" → 저렴한순 버튼 aria-pressed="true"', () => {
    render(<CityGrid cities={mockCities} sortKey="cost" onSortChange={vi.fn()} />)
    const btn = screen.getByRole('button', { name: /저렴한순/i })
    expect(btn).toHaveAttribute('aria-pressed', 'true')
  })

  it('92. 정렬 버튼 클릭 → onSortChange에 해당 SortKey 전달', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(<CityGrid cities={mockCities} sortKey="rating" onSortChange={onSortChange} />)
    await user.click(screen.getByRole('button', { name: /인터넷빠른순/i }))
    expect(onSortChange).toHaveBeenCalledWith('internet')
  })
})
