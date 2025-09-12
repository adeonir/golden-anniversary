import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock DB to use in-memory PGlite
import { testDb } from '~tests/mocks/database'
import { cleanTestDatabase, createTestUser, initializeTestDatabase } from '~tests/utils/database'

vi.mock('~/lib/database/client', () => ({
  db: testDb,
}))

// Mock verifyToken behavior per test
vi.mock('~/lib/auth/jwt', () => ({
  verifyToken: vi.fn(),
}))

import { NextResponse } from 'next/server'
import { verifyToken } from '~/lib/auth/jwt'
import { middleware } from './middleware'

function makeRequest(pathname: string, token?: string) {
  const url = new URL(`http://localhost${pathname}`)
  return {
    nextUrl: {
      pathname,
      clone: () => new URL(url.href),
    },
    cookies: {
      get: vi.fn(() => (token ? { value: token } : undefined)),
    },
  } as unknown as Parameters<typeof middleware>[0]
}

describe('Middleware', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    await initializeTestDatabase()
    await cleanTestDatabase()
  })

  it('allows non-admin routes to pass through', async () => {
    const res = await middleware(makeRequest('/public'))
    expect(res).toBeInstanceOf(NextResponse)
    expect(res.headers.get('location')).toBeNull()
    expect(res.status).toBe(200)
  })

  it('redirects when no auth token on admin route', async () => {
    const res = await middleware(makeRequest('/admin'))
    expect(res.headers.get('location')).toBe('http://localhost/')
  })

  it('redirects when token is invalid', async () => {
    ;(verifyToken as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(null)
    const res = await middleware(makeRequest('/admin', 'invalid'))
    expect(res.headers.get('location')).toBe('http://localhost/')
  })

  it('redirects when user not found in database', async () => {
    ;(verifyToken as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ userId: '999', email: 'x@y.z' })
    const res = await middleware(makeRequest('/admin', 'token'))
    expect(res.headers.get('location')).toBe('http://localhost/')
  })

  it('allows access when token is valid and user exists', async () => {
    const user = await createTestUser({ email: 'admin@test.com', password: 'hash' })
    ;(verifyToken as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      userId: String(user.id),
      email: user.email,
    })

    const res = await middleware(makeRequest('/admin', 'valid'))
    expect(res.headers.get('location')).toBeNull()
    expect(res.status).toBe(200)
  })
})
