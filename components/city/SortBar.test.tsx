import { describe, it, expect, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SortBar } from './SortBar'
import type { SortKey } from '@/types/filter'

const sortOptions: { key: SortKey; label: string }[] = [
  { key: 'rating', label: '⭐ 평점순' },
  { key: 'cost', label: '💵 저렴한순' },
  { key: 'internet', label: '📡 인터넷빠른순' },
  { key: 'air', label: '🌤️ 공기좋은순' },
]

describe('SortBar', () => {
  it('50. renders all 4 sort buttons', () => {
    render(<SortBar activeSort="rating" onSortChange={() => {}} />)
    for (const { label } of sortOptions) {
      expect(screen.getByText(label)).toBeInTheDocument()
    }
  })

  it('51. activeSort="rating" → rating button aria-pressed="true"', () => {
    render(<SortBar activeSort="rating" onSortChange={() => {}} />)
    const ratingBtn = screen.getByText('⭐ 평점순').closest('button')!
    expect(ratingBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('52. other 3 buttons have aria-pressed="false" when activeSort="rating"', () => {
    render(<SortBar activeSort="rating" onSortChange={() => {}} />)
    const others = ['💵 저렴한순', '📡 인터넷빠른순', '🌤️ 공기좋은순']
    for (const label of others) {
      const btn = screen.getByText(label).closest('button')!
      expect(btn).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('53. activeSort="cost" → cost button aria-pressed="true", others false', () => {
    render(<SortBar activeSort="cost" onSortChange={() => {}} />)
    const costBtn = screen.getByText('💵 저렴한순').closest('button')!
    expect(costBtn).toHaveAttribute('aria-pressed', 'true')
    for (const { key, label } of sortOptions) {
      if (key === 'cost') continue
      expect(screen.getByText(label).closest('button')).toHaveAttribute('aria-pressed', 'false')
    }
  })

  it('54. clicking 저렴한순 calls onSortChange with "cost"', async () => {
    const user = userEvent.setup()
    const onSortChange = vi.fn()
    render(<SortBar activeSort="rating" onSortChange={onSortChange} />)
    await user.click(screen.getByText('💵 저렴한순'))
    expect(onSortChange).toHaveBeenCalledWith('cost')
  })

  it('55. each button calls onSortChange with its SortKey', async () => {
    const user = userEvent.setup()
    for (const { key, label } of sortOptions) {
      const onSortChange = vi.fn()
      render(<SortBar activeSort="rating" onSortChange={onSortChange} />)
      await user.click(screen.getAllByText(label)[0])
      expect(onSortChange).toHaveBeenCalledWith(key)
      cleanup()
    }
  })
})
