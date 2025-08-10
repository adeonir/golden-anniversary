/**
 * @vitest-environment node
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: acceptable for test mocking */

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('drizzle-orm')
vi.mock('next/navigation')
vi.mock('~/env', () => ({
  env: {
    JWT_SECRET: 'test-jwt-secret-32-chars-minimum',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
  },
}))
vi.mock('~/lib/database/client')
vi.mock('./jwt')

import { redirect } from 'next/navigation'
import { db } from '~/lib/database/client'
import { getCookie, verifyToken } from './jwt'
import { getCurrentUser, isAuthenticated, requireAuth } from './utils'

describe('Auth Utils', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
  }

  const mockTokenPayload = {
    userId: 'user-123',
    email: 'test@example.com',
  }

  let mockDbQuery: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    // Setup shared DB mock chain
    mockDbQuery = vi.fn()
    vi.mocked(db).select = vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockReturnValue({
          limit: mockDbQuery,
        }),
      }),
    })
  })

  // Helper for common auth setup scenarios
  function setupAuth(hasToken = true, tokenValid = true, userExists = true) {
    vi.mocked(getCookie).mockResolvedValue(hasToken ? 'valid-token' : null)
    vi.mocked(verifyToken).mockResolvedValue(tokenValid ? mockTokenPayload : null)
    mockDbQuery.mockResolvedValue(userExists ? [mockUser] : [])
  }

  describe('isAuthenticated()', () => {
    it('should return false for unauthenticated scenarios', async () => {
      // No token
      setupAuth(false)
      expect(await isAuthenticated()).toBe(false)

      // Invalid token
      setupAuth(true, false)
      expect(await isAuthenticated()).toBe(false)

      // Valid token but user does not exist
      setupAuth(true, true, false)
      expect(await isAuthenticated()).toBe(false)
    })

    it('should return true when fully authenticated', async () => {
      setupAuth() // all defaults to true

      const result = await isAuthenticated()

      expect(result).toBe(true)
      expect(getCookie).toHaveBeenCalledWith()
      expect(verifyToken).toHaveBeenCalledWith('valid-token')
      expect(mockDbQuery).toHaveBeenCalledWith(1)
    })

    it('should handle errors gracefully', async () => {
      vi.mocked(getCookie).mockRejectedValue(new Error('Cookie error'))
      expect(await isAuthenticated()).toBe(false)

      setupAuth()
      mockDbQuery.mockRejectedValue(new Error('Database error'))
      expect(await isAuthenticated()).toBe(false)
    })
  })

  describe('requireAuth()', () => {
    it('should redirect when not authenticated', async () => {
      setupAuth(false) // no token
      await requireAuth()
      expect(redirect).toHaveBeenCalledWith('/sign-in')

      setupAuth(true, false) // invalid token
      await requireAuth()
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })

    it('should not redirect when authenticated', async () => {
      setupAuth() // fully authenticated

      await requireAuth()

      expect(redirect).not.toHaveBeenCalled()
    })

    it('should redirect on authentication errors', async () => {
      setupAuth()
      mockDbQuery.mockRejectedValue(new Error('Database error'))

      await requireAuth()

      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })
  })

  describe('getCurrentUser()', () => {
    it('should return null for invalid scenarios', async () => {
      // No token
      setupAuth(false)
      expect(await getCurrentUser()).toBeNull()

      // Invalid token
      setupAuth(true, false)
      expect(await getCurrentUser()).toBeNull()

      // User does not exist
      setupAuth(true, true, false)
      expect(await getCurrentUser()).toBeNull()
    })

    it('should return user when fully authenticated', async () => {
      setupAuth() // fully authenticated

      const result = await getCurrentUser()

      expect(result).toEqual(mockUser)
      expect(getCookie).toHaveBeenCalledWith()
      expect(verifyToken).toHaveBeenCalledWith('valid-token')
      expect(mockDbQuery).toHaveBeenCalledWith(1)
    })

    it('should return first user from multiple results', async () => {
      const secondUser = { ...mockUser, id: 'user-456' }
      setupAuth()
      mockDbQuery.mockResolvedValue([mockUser, secondUser])

      const result = await getCurrentUser()

      expect(result).toEqual(mockUser)
    })

    it('should throw on database errors', async () => {
      setupAuth()
      mockDbQuery.mockRejectedValue(new Error('Database error'))

      await expect(getCurrentUser()).rejects.toThrow('Database error')
    })
  })
})
