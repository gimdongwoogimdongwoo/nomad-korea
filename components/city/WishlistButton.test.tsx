import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { WishlistButton } from '@/components/city/WishlistButton'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockGetUser = vi.fn()
const mockInsert = vi.fn()
const mockEq2 = vi.fn()
const mockEq1 = vi.fn().mockReturnValue({ eq: mockEq2 })
const mockDelete = vi.fn().mockReturnValue({ eq: mockEq1 })
const mockFrom = vi.fn().mockReturnValue({ insert: mockInsert, delete: mockDelete })

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  // restore mockEq1 return after clearAllMocks
  mockEq1.mockReturnValue({ eq: mockEq2 })
  mockDelete.mockReturnValue({ eq: mockEq1 })
  mockFrom.mockReturnValue({ insert: mockInsert, delete: mockDelete })
})

describe('WishlistButton', () => {
  it('93. isWishlisted=false → Heart에 fill-current 없음', () => {
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg?.classList.contains('fill-current')).toBe(false)
  })

  it('94. isWishlisted=true → Heart에 fill-current 있음', () => {
    render(<WishlistButton cityId="seoul" isWishlisted={true} />)
    const svg = screen.getByRole('button').querySelector('svg')
    expect(svg?.classList.contains('fill-current')).toBe(true)
  })

  it('95. isWishlisted=true → 버튼에 text-red-500 토큰 있음', () => {
    render(<WishlistButton cityId="seoul" isWishlisted={true} />)
    const tokens = screen.getByRole('button').className.split(' ')
    expect(tokens).toContain('text-red-500')
  })

  it('96. isWishlisted=false → text-red-500 토큰 없음 (hover:text-red-500만 있음)', () => {
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    const tokens = screen.getByRole('button').className.split(' ')
    expect(tokens).not.toContain('text-red-500')
  })

  it('97. 비로그인 클릭 → router.push("/login")', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    await user.click(screen.getByRole('button'))
    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('98. 비로그인 클릭 → insert 미호출', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    await user.click(screen.getByRole('button'))
    expect(mockInsert).not.toHaveBeenCalled()
  })

  it('99. 로그인 + 미찜 클릭 → insert 호출', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockInsert.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    await user.click(screen.getByRole('button'))
    expect(mockFrom).toHaveBeenCalledWith('wishlists')
    expect(mockInsert).toHaveBeenCalledWith({ user_id: 'user-1', city_id: 'seoul' })
  })

  it('100. insert 후 찜 상태로 UI 변경', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockInsert.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    const btn = screen.getByRole('button')
    await user.click(btn)
    expect(btn.querySelector('svg')?.classList.contains('fill-current')).toBe(true)
  })

  it('101. 로그인 + 이미찜 클릭 → delete 체인 호출', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockEq2.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={true} />)
    await user.click(screen.getByRole('button'))
    expect(mockDelete).toHaveBeenCalled()
    expect(mockEq1).toHaveBeenCalledWith('user_id', 'user-1')
    expect(mockEq2).toHaveBeenCalledWith('city_id', 'seoul')
  })

  it('102. delete 후 미찜 상태로 UI 변경', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockEq2.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={true} />)
    const btn = screen.getByRole('button')
    await user.click(btn)
    expect(btn.querySelector('svg')?.classList.contains('fill-current')).toBe(false)
  })

  it('103. 로딩 중 버튼 disabled', async () => {
    mockGetUser.mockReturnValue(new Promise(() => {}))
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    const btn = screen.getByRole('button')
    user.click(btn)
    await waitFor(() => expect(btn).toBeDisabled())
  })

  it('104. 완료 후 버튼 enabled', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    mockInsert.mockResolvedValue({ error: null })
    const user = userEvent.setup()
    render(<WishlistButton cityId="seoul" isWishlisted={false} />)
    const btn = screen.getByRole('button')
    await user.click(btn)
    expect(btn).not.toBeDisabled()
  })
})
