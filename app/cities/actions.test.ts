import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitReview } from '@/app/cities/actions'
import { revalidatePath } from 'next/cache'

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

const mockGetUser = vi.fn()
const mockInsert = vi.fn()
const mockFrom = vi.fn(() => ({ insert: mockInsert }))

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: { getUser: mockGetUser },
    from: mockFrom,
  }),
}))

function makeFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData()
  fd.append('cityId', overrides.cityId ?? 'seoul')
  fd.append('rating', overrides.rating ?? '5')
  fd.append('content', overrides.content ?? '이 도시는 정말 좋습니다. 테스트용 긴 리뷰.')
  return fd
}

const defaultUser = {
  id: 'uid-1',
  email: 'test@example.com',
  user_metadata: {} as Record<string, unknown>,
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetUser.mockResolvedValue({ data: { user: defaultUser } })
  mockInsert.mockResolvedValue({ error: null })
})

describe('submitReview', () => {
  it('117. user=null → 로그인 에러', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } })
    const result = await submitReview(null, makeFormData())
    expect(result).toEqual({ error: '로그인이 필요합니다.' })
  })

  it('118. content="" → 길이 에러', async () => {
    const result = await submitReview(null, makeFormData({ content: '' }))
    expect(result).toEqual({ error: '후기를 10자 이상 입력해주세요.' })
  })

  it('119. content 9자 → 길이 에러', async () => {
    const result = await submitReview(null, makeFormData({ content: '123456789' }))
    expect(result).toEqual({ error: '후기를 10자 이상 입력해주세요.' })
  })

  it('120. content 공백만 → trim 후 에러', async () => {
    const result = await submitReview(null, makeFormData({ content: '   짧   ' }))
    expect(result).toEqual({ error: '후기를 10자 이상 입력해주세요.' })
  })

  it('121. 정상 제출 → from("reviews").insert() 호출', async () => {
    await submitReview(null, makeFormData())
    expect(mockFrom).toHaveBeenCalledWith('reviews')
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        city_id: 'seoul',
        user_id: 'uid-1',
        rating: 5,
        content: expect.any(String),
      })
    )
  })

  it('122. insert 성공 → {success:true}', async () => {
    const result = await submitReview(null, makeFormData())
    expect(result).toEqual({ success: true })
  })

  it('123. insert 실패 → 등록 실패 에러', async () => {
    mockInsert.mockResolvedValue({ error: { message: 'db error' } })
    const result = await submitReview(null, makeFormData())
    expect(result).toEqual({ error: '후기 등록에 실패했습니다.' })
  })

  it('124. 성공 시 revalidatePath("/cities/seoul") 호출', async () => {
    await submitReview(null, makeFormData({ cityId: 'seoul' }))
    expect(revalidatePath).toHaveBeenCalledWith('/cities/seoul')
  })

  it('125. author: user_metadata.name 우선', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { ...defaultUser, user_metadata: { name: '김철수' } } },
    })
    await submitReview(null, makeFormData())
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ author: '김철수' }))
  })

  it('126. author: name 없으면 email', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { ...defaultUser, email: 'user@test.com', user_metadata: {} } },
    })
    await submitReview(null, makeFormData())
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ author: 'user@test.com' }))
  })

  it('127. author: name·email 모두 없으면 "익명"', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { ...defaultUser, email: undefined, user_metadata: {} } },
    })
    await submitReview(null, makeFormData())
    expect(mockInsert).toHaveBeenCalledWith(expect.objectContaining({ author: '익명' }))
  })
})
