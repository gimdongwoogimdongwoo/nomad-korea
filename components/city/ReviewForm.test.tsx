import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useActionState } from 'react'

vi.mock('@/app/cities/actions', () => ({
  submitReview: vi.fn(),
}))

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, useActionState: vi.fn() }
})

const mockFormAction = vi.fn()

beforeEach(() => {
  vi.mocked(useActionState).mockReturnValue([null, mockFormAction, false] as any)
})

// Lazy import so vi.mock hoisting takes effect first
async function renderForm(props: { cityId: string; isLoggedIn: boolean }) {
  const { ReviewForm } = await import('@/components/city/ReviewForm')
  return render(<ReviewForm {...props} />)
}

describe('ReviewForm — 비로그인', () => {
  it('105. 로그인 안내 문구 렌더링', async () => {
    await renderForm({ cityId: 'seoul', isLoggedIn: false })
    expect(screen.getByText(/로그인/)).toBeInTheDocument()
    expect(screen.getByText(/필요/)).toBeInTheDocument()
  })

  it('106. /login 링크 존재', async () => {
    await renderForm({ cityId: 'seoul', isLoggedIn: false })
    expect(screen.getByRole('link', { name: /로그인/ })).toHaveAttribute('href', '/login')
  })

  it('107. textarea 없음', async () => {
    await renderForm({ cityId: 'seoul', isLoggedIn: false })
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })
})

describe('ReviewForm — 로그인', () => {
  it('108. 별점 버튼 5개 렌더링', async () => {
    await renderForm({ cityId: 'seoul', isLoggedIn: true })
    for (let n = 1; n <= 5; n++) {
      expect(screen.getByRole('button', { name: `${n}점` })).toBeInTheDocument()
    }
  })

  it('109. 기본 별점 hidden input value = "5"', async () => {
    const { container } = await renderForm({ cityId: 'seoul', isLoggedIn: true })
    const ratingInput = container.querySelector('input[name="rating"]') as HTMLInputElement
    expect(ratingInput.value).toBe('5')
  })

  it('110. 별점 3 클릭 → hidden rating value = "3"', async () => {
    const user = userEvent.setup()
    const { container } = await renderForm({ cityId: 'seoul', isLoggedIn: true })
    await user.click(screen.getByRole('button', { name: '3점' }))
    const ratingInput = container.querySelector('input[name="rating"]') as HTMLInputElement
    expect(ratingInput.value).toBe('3')
  })

  it('111. 별점 3 클릭 후 1~3 opacity-100, 4~5 opacity-30', async () => {
    const user = userEvent.setup()
    await renderForm({ cityId: 'seoul', isLoggedIn: true })
    await user.click(screen.getByRole('button', { name: '3점' }))
    ;[1, 2, 3].forEach((n) => {
      expect(screen.getByRole('button', { name: `${n}점` })).toHaveClass('opacity-100')
    })
    ;[4, 5].forEach((n) => {
      expect(screen.getByRole('button', { name: `${n}점` })).toHaveClass('opacity-30')
    })
  })

  it('112. textarea[name="content"] 렌더링', async () => {
    await renderForm({ cityId: 'seoul', isLoggedIn: true })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('113. hidden input[name="cityId"] 값이 prop과 일치', async () => {
    const { container } = await renderForm({ cityId: 'busan', isLoggedIn: true })
    const cityIdInput = container.querySelector('input[name="cityId"]') as HTMLInputElement
    expect(cityIdInput.value).toBe('busan')
  })

  it('114. state.error → 에러 메시지 표시', async () => {
    vi.mocked(useActionState).mockReturnValue([
      { error: '후기를 10자 이상 입력해주세요.' },
      mockFormAction,
      false,
    ] as any)
    await renderForm({ cityId: 'seoul', isLoggedIn: true })
    expect(screen.getByText('후기를 10자 이상 입력해주세요.')).toBeInTheDocument()
  })

  it('115. state.success → 성공 메시지 표시', async () => {
    vi.mocked(useActionState).mockReturnValue([{ success: true }, mockFormAction, false] as any)
    await renderForm({ cityId: 'seoul', isLoggedIn: true })
    expect(screen.getByText('후기가 등록되었습니다!')).toBeInTheDocument()
  })

  it('116. isPending=true → "등록 중..." + disabled', async () => {
    vi.mocked(useActionState).mockReturnValue([null, mockFormAction, true] as any)
    await renderForm({ cityId: 'seoul', isLoggedIn: true })
    const btn = screen.getByRole('button', { name: '등록 중...' })
    expect(btn).toBeDisabled()
  })
})
