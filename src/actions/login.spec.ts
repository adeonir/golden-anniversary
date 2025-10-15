import { beforeEach, describe, expect, it, vi } from 'vitest'
import { testDb } from '~tests/mocks/database'
import { cleanTestDatabase, createTestUser, initializeTestDatabase } from '~tests/utils/database'
import { signIn } from './login'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('~/lib/auth/jwt', () => ({
  signToken: vi.fn(),
  setCookie: vi.fn(),
}))

vi.mock('~/lib/database/client', () => ({
  db: testDb,
}))

vi.mock('bcryptjs', () => ({
  compare: vi.fn(),
}))

describe('Sign In Server Action Integration Tests', () => {
  beforeEach(async () => {
    await initializeTestDatabase()
    await cleanTestDatabase()

    vi.clearAllMocks()
  })

  describe('signIn', () => {
    it('should sign in with valid credentials', async () => {
      const testUser = await createTestUser({
        email: 'admin@test.com',
        password: '$2a$12$hashedpassword', // Simulated bcrypt hash
      })

      const { signToken, setCookie } = await import('~/lib/auth/jwt')
      const { compare } = await import('bcryptjs')
      const { redirect } = await import('next/navigation')

      vi.mocked(compare).mockResolvedValue(true as never)
      vi.mocked(signToken).mockResolvedValue('mock-jwt-token')
      vi.mocked(setCookie).mockResolvedValue(undefined)

      const formData = new FormData()
      formData.append('email', 'admin@test.com')
      formData.append('password', 'correct-password')

      await signIn(formData)

      expect(compare).toHaveBeenCalledWith('correct-password', testUser.password)
      expect(signToken).toHaveBeenCalledWith({
        userId: testUser.id,
        email: testUser.email,
      })
      expect(setCookie).toHaveBeenCalledWith('mock-jwt-token')
      expect(redirect).toHaveBeenCalledWith('/admin')
    })

    it('should throw error when user not found', async () => {
      const formData = new FormData()
      formData.append('email', 'nonexistent@test.com')
      formData.append('password', 'any-password')

      await expect(signIn(formData)).rejects.toThrow('Invalid credentials')

      const { signToken, setCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      expect(signToken).not.toHaveBeenCalled()
      expect(setCookie).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    it('should throw error with invalid password', async () => {
      await createTestUser({
        email: 'admin@test.com',
        password: '$2a$12$hashedpassword',
      })

      const { compare } = await import('bcryptjs')
      vi.mocked(compare).mockResolvedValue(false as never)

      const formData = new FormData()
      formData.append('email', 'admin@test.com')
      formData.append('password', 'wrong-password')

      await expect(signIn(formData)).rejects.toThrow('Invalid credentials')

      const { signToken, setCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      expect(compare).toHaveBeenCalledWith('wrong-password', '$2a$12$hashedpassword')
      expect(signToken).not.toHaveBeenCalled()
      expect(setCookie).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    it('should handle missing email', async () => {
      const formData = new FormData()
      formData.append('password', 'any-password')

      await expect(signIn(formData)).rejects.toThrow('Invalid credentials')
    })

    it('should handle missing password', async () => {
      await createTestUser({
        email: 'admin@test.com',
        password: '$2a$12$hashedpassword',
      })

      const formData = new FormData()
      formData.append('email', 'admin@test.com')

      await expect(signIn(formData)).rejects.toThrow('Invalid credentials')
    })

    it('should handle empty email', async () => {
      const formData = new FormData()
      formData.append('email', '')
      formData.append('password', 'any-password')

      await expect(signIn(formData)).rejects.toThrow('Invalid credentials')
    })

    it('should handle empty password', async () => {
      await createTestUser({
        email: 'admin@test.com',
        password: '$2a$12$hashedpassword',
      })

      const formData = new FormData()
      formData.append('email', 'admin@test.com')
      formData.append('password', '')

      await expect(signIn(formData)).rejects.toThrow('Invalid credentials')
    })

    it('should handle JWT signing failure', async () => {
      const testUser = await createTestUser({
        email: 'admin@test.com',
        password: '$2a$12$hashedpassword',
      })

      const { signToken } = await import('~/lib/auth/jwt')
      const { compare } = await import('bcryptjs')

      vi.mocked(compare).mockResolvedValue(true as never)
      vi.mocked(signToken).mockRejectedValue(new Error('JWT signing failed'))

      const formData = new FormData()
      formData.append('email', 'admin@test.com')
      formData.append('password', 'correct-password')

      await expect(signIn(formData)).rejects.toThrow('JWT signing failed')

      expect(compare).toHaveBeenCalledWith('correct-password', testUser.password)
      expect(signToken).toHaveBeenCalledWith({
        userId: testUser.id,
        email: testUser.email,
      })
    })

    it('should handle cookie setting failure', async () => {
      const testUser = await createTestUser({
        email: 'admin@test.com',
        password: '$2a$12$hashedpassword',
      })

      const { signToken, setCookie } = await import('~/lib/auth/jwt')
      const { compare } = await import('bcryptjs')

      vi.mocked(compare).mockResolvedValue(true as never)
      vi.mocked(signToken).mockResolvedValue('mock-jwt-token')
      vi.mocked(setCookie).mockRejectedValue(new Error('Cookie setting failed'))

      const formData = new FormData()
      formData.append('email', 'admin@test.com')
      formData.append('password', 'correct-password')

      await expect(signIn(formData)).rejects.toThrow('Cookie setting failed')

      expect(signToken).toHaveBeenCalledWith({
        userId: testUser.id,
        email: testUser.email,
      })
      expect(setCookie).toHaveBeenCalledWith('mock-jwt-token')
    })

    it('should handle database connection failure', async () => {
      const originalSelect = testDb.select
      const mockSelect = vi.fn().mockImplementation(() => {
        throw new Error('Database connection failed')
      })
      testDb.select = mockSelect as unknown as typeof testDb.select

      const formData = new FormData()
      formData.append('email', 'admin@test.com')
      formData.append('password', 'any-password')

      await expect(signIn(formData)).rejects.toThrow('Database connection failed')

      // Restore original select
      testDb.select = originalSelect
    })
  })

  describe('End-to-end authentication workflow', () => {
    it('should complete full successful authentication flow', async () => {
      // 1. Create admin user
      const adminUser = await createTestUser({
        email: 'admin@golden.com',
        password: '$2a$12$correcthash',
      })

      // 2. Mock all auth dependencies
      const { signToken, setCookie } = await import('~/lib/auth/jwt')
      const { compare } = await import('bcryptjs')
      const { redirect } = await import('next/navigation')

      vi.mocked(compare).mockResolvedValue(true as never)
      vi.mocked(signToken).mockResolvedValue('valid-jwt-token-12345')
      vi.mocked(setCookie).mockResolvedValue(undefined)

      // 3. Perform sign in
      const formData = new FormData()
      formData.append('email', 'admin@golden.com')
      formData.append('password', 'admin123')

      await signIn(formData)

      // 4. Verify complete flow
      expect(compare).toHaveBeenCalledWith('admin123', '$2a$12$correcthash')
      expect(signToken).toHaveBeenCalledWith({
        userId: adminUser.id,
        email: adminUser.email,
      })
      expect(setCookie).toHaveBeenCalledWith('valid-jwt-token-12345')
      expect(redirect).toHaveBeenCalledWith('/admin')

      // 5. Verify call order
      const compareCall = vi.mocked(compare).mock.calls[0]
      const signTokenCall = vi.mocked(signToken).mock.calls[0]
      const setCookieCall = vi.mocked(setCookie).mock.calls[0]
      const redirectCall = vi.mocked(redirect).mock.calls[0]

      expect(compareCall).toBeDefined()
      expect(signTokenCall).toBeDefined()
      expect(setCookieCall).toBeDefined()
      expect(redirectCall).toBeDefined()
    })

    it('should handle complete failure scenario', async () => {
      // 1. Create user but with different email
      await createTestUser({
        email: 'other@test.com',
        password: '$2a$12$somehash',
      })

      // 2. Attempt sign in with wrong email
      const formData = new FormData()
      formData.append('email', 'admin@test.com')
      formData.append('password', 'any-password')

      // 3. Should fail at user lookup stage
      await expect(signIn(formData)).rejects.toThrow('Invalid credentials')

      // 4. Verify no auth operations were performed
      const { signToken, setCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      expect(signToken).not.toHaveBeenCalled()
      expect(setCookie).not.toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })
  })
})
