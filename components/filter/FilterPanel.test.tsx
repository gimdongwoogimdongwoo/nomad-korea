import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterPanel } from '@/components/filter/FilterPanel'
import { ALL_TAGS } from '@/data/cities'
import type { FilterState } from '@/types/filter'

vi.mock('@/components/ui/slider', () => ({
  Slider: ({ value, onValueChange }: { value: number[]; onValueChange: (v: number[]) => void }) => (
    <input
      type="range"
      value={value[0]}
      onChange={(e) => onValueChange([Number(e.target.value)])}
      aria-label="월 예산 필터"
    />
  ),
}))

const defaultFilter: FilterState = {
  budget: 300,
  highSpeed: false,
  cleanAir: false,
  selectedTags: [],
}

describe('FilterPanel', () => {
  it('60. filter prop 없이 렌더링해도 크래시 없음', () => {
    expect(() => render(<FilterPanel />)).not.toThrow()
  })

  it('61. budget=300 → ₩3,000,000 텍스트 표시', () => {
    render(<FilterPanel filter={defaultFilter} />)
    expect(screen.getByText('₩3,000,000')).toBeInTheDocument()
  })

  it('62. highSpeed=false → 초고속만 체크박스 미체크', () => {
    render(<FilterPanel filter={defaultFilter} />)
    const checkbox = screen.getByRole('checkbox', { name: /초고속만/i })
    expect(checkbox).not.toBeChecked()
  })

  it('63. highSpeed=true → 초고속만 체크박스 체크됨', () => {
    render(<FilterPanel filter={{ ...defaultFilter, highSpeed: true }} />)
    const checkbox = screen.getByRole('checkbox', { name: /초고속만/i })
    expect(checkbox).toBeChecked()
  })

  it('64. cleanAir=false → 좋음 이상 체크박스 미체크', () => {
    render(<FilterPanel filter={defaultFilter} />)
    const checkbox = screen.getByRole('checkbox', { name: /좋음 이상/i })
    expect(checkbox).not.toBeChecked()
  })

  it('65. ALL_TAGS 전체가 배지로 렌더링됨', () => {
    render(<FilterPanel filter={defaultFilter} />)
    for (const tag of ALL_TAGS) {
      expect(screen.getByText(tag)).toBeInTheDocument()
    }
  })

  it('66. 선택된 태그의 aria-checked="true"', () => {
    const tag = ALL_TAGS[0]
    render(<FilterPanel filter={{ ...defaultFilter, selectedTags: [tag] }} />)
    const badge = screen.getByRole('checkbox', { name: tag })
    expect(badge).toHaveAttribute('aria-checked', 'true')
  })

  it('67. 선택 안 된 태그의 aria-checked="false"', () => {
    render(<FilterPanel filter={defaultFilter} />)
    const badge = screen.getByRole('checkbox', { name: ALL_TAGS[0] })
    expect(badge).toHaveAttribute('aria-checked', 'false')
  })

  it('68. 미선택 태그 클릭 → onFilterChange({ selectedTags: [tag] }) 호출', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const tag = ALL_TAGS[0]
    render(<FilterPanel filter={defaultFilter} onFilterChange={onFilterChange} />)
    await user.click(screen.getByRole('checkbox', { name: tag }))
    expect(onFilterChange).toHaveBeenCalledWith({ selectedTags: [tag] })
  })

  it('69. 선택된 태그 클릭 → 해당 태그 제거된 배열로 호출', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const tag = ALL_TAGS[0]
    render(
      <FilterPanel
        filter={{ ...defaultFilter, selectedTags: [tag] }}
        onFilterChange={onFilterChange}
      />,
    )
    await user.click(screen.getByRole('checkbox', { name: tag }))
    expect(onFilterChange).toHaveBeenCalledWith({ selectedTags: [] })
  })

  it('70. 태그 2개 선택 중 하나 클릭 → 나머지 하나만 남은 배열로 호출', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    const [tag1, tag2] = ALL_TAGS
    render(
      <FilterPanel
        filter={{ ...defaultFilter, selectedTags: [tag1, tag2] }}
        onFilterChange={onFilterChange}
      />,
    )
    await user.click(screen.getByRole('checkbox', { name: tag1 }))
    expect(onFilterChange).toHaveBeenCalledWith({ selectedTags: [tag2] })
  })

  it('71. 초고속만 체크박스 클릭 → onFilterChange({ highSpeed: true }) 호출', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    render(<FilterPanel filter={defaultFilter} onFilterChange={onFilterChange} />)
    await user.click(screen.getByRole('checkbox', { name: /초고속만/i }))
    expect(onFilterChange).toHaveBeenCalledWith({ highSpeed: true })
  })

  it('72. 좋음 이상 체크박스 클릭 → onFilterChange({ cleanAir: true }) 호출', async () => {
    const user = userEvent.setup()
    const onFilterChange = vi.fn()
    render(<FilterPanel filter={defaultFilter} onFilterChange={onFilterChange} />)
    await user.click(screen.getByRole('checkbox', { name: /좋음 이상/i }))
    expect(onFilterChange).toHaveBeenCalledWith({ cleanAir: true })
  })
})
