import { describe, it, expect, vi, beforeEach } from 'vitest'
import { redirect } from 'next/navigation'
import { login, signup, logout } from '@/app/auth/actions'

vi.mock('next/navigation', () => ({ redirect: vi.fn() }))

const mockSignIn = vi.fn()
const mockSignUp = vi.fn()
const mockSignOut = vi.fn()

vi.mock('@/lib/supabase/server', () => ({
  createClient: async () => ({
    auth: {
      signInWithPassword: mockSignIn,
      signUp: mockSignUp,
      signOut: mockSignOut,
    },
  }),
}))

function loginForm(email = 'a@b.com', password = 'password123') {
  const fd = new FormData()
  fd.append('email', email)
  fd.append('password', password)
  return fd
}

function signupForm(name = '홍길동', email = 'a@b.com', password = 'password123') {
  const fd = new FormData()
  fd.append('name', name)
  fd.append('email', email)
  fd.append('password', password)
  return fd
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('login()', () => {
  it('128. 성공: signInWithPassword에 email·password 전달', async () => {
    mockSignIn.mockResolvedValue({ error: null })
    await login(null, loginForm('a@b.com', 'password123'))
    expect(mockSignIn).toHaveBeenCalledWith({ email: 'a@b.com', password: 'password123' })
  })

  it('129. 성공: redirect("/") 호출', async () => {
    mockSignIn.mockResolvedValue({ error: null })
    await login(null, loginForm())
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('130. 실패: 로그인 에러 메시지 반환', async () => {
    mockSignIn.mockResolvedValue({ error: { message: 'Invalid credentials' } })
    const result = await login(null, loginForm())
    expect(result).toEqual({ error: '이메일 또는 비밀번호가 올바르지 않습니다.' })
  })
})

describe('signup()', () => {
  it('131. signUp에 email·password·name 전달', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    await signup(null, signupForm('홍길동', 'a@b.com', 'password123'))
    expect(mockSignUp).toHaveBeenCalledWith({
      email: 'a@b.com',
      password: 'password123',
      options: { data: { name: '홍길동' } },
    })
  })

  it('132. 성공: redirect("/auth/verify-email") 호출', async () => {
    mockSignUp.mockResolvedValue({ error: null })
    await signup(null, signupForm())
    expect(redirect).toHaveBeenCalledWith('/auth/verify-email')
  })

  it('133. 실패: error.message 반환', async () => {
    mockSignUp.mockResolvedValue({ error: { message: 'Email taken' } })
    const result = await signup(null, signupForm())
    expect(result).toEqual({ error: 'Email taken' })
  })
})

describe('logout()', () => {
  it('134. signOut() 호출', async () => {
    mockSignOut.mockResolvedValue({})
    await logout()
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('135. redirect("/login") 호출', async () => {
    mockSignOut.mockResolvedValue({})
    await logout()
    expect(redirect).toHaveBeenCalledWith('/login')
  })
})
