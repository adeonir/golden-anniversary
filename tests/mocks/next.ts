/**
 * Mock implementations for Next.js functions used in server actions
 */
import { vi } from 'vitest'

// Mock Next.js cache revalidation
export const mockRevalidatePath = vi.fn()

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}))

// Mock Next.js cookies
export const mockCookies = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
}

vi.mock('next/cookies', () => ({
  cookies: vi.fn(() => mockCookies),
}))

// Reset all mocks helper
export function resetNextMocks() {
  mockRevalidatePath.mockClear()
  mockCookies.get.mockClear()
  mockCookies.set.mockClear()
  mockCookies.delete.mockClear()
}
