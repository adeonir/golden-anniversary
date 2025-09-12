/**
 * @vitest-environment node
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: acceptable for test mocking */

import { jwtVerify } from 'jose'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('next/headers', () => ({
  cookies: vi.fn().mockResolvedValue({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
  }),
}))
vi.mock('~/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-that-is-at-least-32-characters-long-for-jwt-signing',
  },
}))

import { cookies } from 'next/headers'
import { clearCookie, getCookie, setCookie, signToken, type TokenPayload, verifyToken } from './jwt'

describe('JWT Auth Functions', () => {
  const mockPayload: TokenPayload = {
    userId: 'test-user-123',
    email: 'test@example.com',
  }

  let mockCookieStore: {
    get: ReturnType<typeof vi.fn>
    set: ReturnType<typeof vi.fn>
    delete: ReturnType<typeof vi.fn>
  }

  beforeEach(async () => {
    vi.clearAllMocks()
    mockCookieStore = (await cookies()) as any
  })

  describe('signToken()', () => {
    it('should create a valid JWT token', async () => {
      const token = await signToken(mockPayload)

      expect(token).toBeTypeOf('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    it('should create different tokens for different payloads', async () => {
      const payload1 = { userId: 'user1', email: 'user1@test.com' }
      const payload2 = { userId: 'user2', email: 'user2@test.com' }

      const token1 = await signToken(payload1)
      const token2 = await signToken(payload2)

      expect(token1).not.toBe(token2)
    })

    it('should create tokens that can be verified', async () => {
      const token = await signToken(mockPayload)
      const secret = new TextEncoder().encode('test-secret-key-that-is-at-least-32-characters-long-for-jwt-signing')

      const { payload } = await jwtVerify(token, secret, { algorithms: ['HS256'] })

      expect(payload.userId).toBe(mockPayload.userId)
      expect(payload.email).toBe(mockPayload.email)
      expect(payload.iat).toBeTypeOf('number')
      expect(payload.exp).toBeTypeOf('number')
    })
  })

  describe('verifyToken()', () => {
    it('should verify valid tokens and return payload', async () => {
      const token = await signToken(mockPayload)
      const result = await verifyToken(token)

      expect(result).toEqual(mockPayload)
    })

    it('should return null for invalid tokens', async () => {
      const invalidToken = 'invalid.jwt.token'
      const result = await verifyToken(invalidToken)

      expect(result).toBeNull()
    })

    it('should return null for malformed tokens', async () => {
      const malformedToken = 'not-a-jwt-at-all'
      const result = await verifyToken(malformedToken)

      expect(result).toBeNull()
    })

    it('should return null for empty string', async () => {
      const result = await verifyToken('')

      expect(result).toBeNull()
    })

    it('should return null for tokens signed with different secret', async () => {
      // Create a token with a different secret
      const differentSecret = new TextEncoder().encode('different-secret-key-32-chars-min')
      const { SignJWT } = await import('jose')

      const tokenWithDifferentSecret = await new SignJWT({ ...mockPayload })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(differentSecret)

      const result = await verifyToken(tokenWithDifferentSecret)

      expect(result).toBeNull()
    })
  })

  describe('getCookie()', () => {
    it('should return token value from cookies', async () => {
      const expectedToken = 'test-jwt-token'
      mockCookieStore.get.mockReturnValue({ value: expectedToken })

      const result = await getCookie()

      expect(mockCookieStore.get).toHaveBeenCalledWith('auth-token')
      expect(result).toBe(expectedToken)
    })

    it('should return null when cookie does not exist', async () => {
      mockCookieStore.get.mockReturnValue(undefined)

      const result = await getCookie()

      expect(result).toBeNull()
    })

    it('should return null when cookie value is undefined', async () => {
      mockCookieStore.get.mockReturnValue({ value: undefined })

      const result = await getCookie()

      expect(result).toBeNull()
    })
  })

  describe('setCookie()', () => {
    it('should set cookie with correct parameters in development', async () => {
      const token = 'test-jwt-token'

      vi.stubEnv('NODE_ENV', 'development')

      await setCookie(token)

      expect(mockCookieStore.set).toHaveBeenCalledWith('auth-token', token, {
        httpOnly: true,
        secure: false, // development mode
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    })

    it('should set secure cookie in production', async () => {
      const token = 'test-jwt-token'

      vi.stubEnv('NODE_ENV', 'production')

      await setCookie(token)

      expect(mockCookieStore.set).toHaveBeenCalledWith('auth-token', token, {
        httpOnly: true,
        secure: true, // production mode
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      })
    })
  })

  describe('clearCookie()', () => {
    it('should delete the auth token cookie', async () => {
      await clearCookie()

      expect(mockCookieStore.delete).toHaveBeenCalledWith('auth-token')
    })
  })
})
