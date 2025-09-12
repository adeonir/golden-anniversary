import { beforeEach, describe, expect, it, vi } from 'vitest'
import { signOut } from './sign-out'

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('~/lib/auth/jwt', () => ({
  clearCookie: vi.fn(),
}))

describe('Sign Out Server Action Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('signOut', () => {
    it('should clear cookie and redirect to sign-in', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      vi.mocked(clearCookie).mockResolvedValue(undefined)

      await signOut()

      expect(clearCookie).toHaveBeenCalledWith()
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })

    it('should handle cookie clearing failure', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')

      vi.mocked(clearCookie).mockRejectedValue(new Error('Cookie clearing failed'))

      await expect(signOut()).rejects.toThrow('Cookie clearing failed')

      expect(clearCookie).toHaveBeenCalledWith()

      // Redirect should not be called due to error
      const { redirect } = await import('next/navigation')
      expect(redirect).not.toHaveBeenCalled()
    })

    it('should handle redirect failure after successful cookie clear', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      vi.mocked(clearCookie).mockResolvedValue(undefined)
      vi.mocked(redirect).mockImplementation(() => {
        throw new Error('Redirect failed')
      })

      await expect(signOut()).rejects.toThrow('Redirect failed')

      expect(clearCookie).toHaveBeenCalledWith()
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })

    it('should complete sign-out flow successfully', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      vi.mocked(clearCookie).mockResolvedValue(undefined)
      vi.mocked(redirect).mockImplementation(() => {
        // Mock successful redirect without throwing
        return undefined as never
      })

      // This should not throw
      await expect(signOut()).resolves.not.toThrow()

      expect(clearCookie).toHaveBeenCalledWith()
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })

    it('should call operations in correct order', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      const callOrder: string[] = []

      vi.mocked(clearCookie).mockImplementation(() => {
        callOrder.push('clearCookie')
        return Promise.resolve()
      })

      vi.mocked(redirect).mockImplementation(() => {
        callOrder.push('redirect')
        return undefined as never
      })

      await signOut()

      expect(callOrder).toEqual(['clearCookie', 'redirect'])
    })
  })

  describe('Edge cases', () => {
    it('should handle multiple successive sign-out calls', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      vi.mocked(clearCookie).mockResolvedValue(undefined)

      // Call signOut multiple times
      await Promise.all([signOut(), signOut(), signOut()])

      expect(clearCookie).toHaveBeenCalledTimes(3)
      expect(redirect).toHaveBeenCalledTimes(3)
    })

    it('should handle concurrent sign-out operations', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')

      let clearCookieCallCount = 0
      vi.mocked(clearCookie).mockImplementation(async () => {
        clearCookieCallCount++
        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      // Start multiple concurrent sign-outs
      const promises = [signOut(), signOut(), signOut()]
      await Promise.all(promises)

      expect(clearCookieCallCount).toBe(3)
    })
  })

  describe('End-to-end sign-out workflow', () => {
    it('should complete full sign-out flow', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')
      const { redirect } = await import('next/navigation')

      // Mock successful operations
      vi.mocked(clearCookie).mockResolvedValue(undefined)

      // Perform sign-out
      await signOut()

      // Verify complete workflow
      expect(clearCookie).toHaveBeenCalledTimes(1)
      expect(redirect).toHaveBeenCalledTimes(1)
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })

    it('should maintain consistency during error recovery', async () => {
      const { clearCookie } = await import('~/lib/auth/jwt')

      // First call fails
      vi.mocked(clearCookie).mockRejectedValueOnce(new Error('Network error')).mockResolvedValueOnce(undefined) // Second call succeeds

      // First attempt should fail
      await expect(signOut()).rejects.toThrow('Network error')

      // Reset redirect mock for second attempt
      const { redirect } = await import('next/navigation')
      vi.mocked(redirect).mockClear()

      // Second attempt should succeed
      await signOut()

      expect(clearCookie).toHaveBeenCalledTimes(2)
      expect(redirect).toHaveBeenCalledTimes(1) // Only called on successful attempt
      expect(redirect).toHaveBeenCalledWith('/sign-in')
    })
  })
})
