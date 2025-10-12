import { vi } from 'vitest'

export const mockPostHog = {
  init: vi.fn(),
  capture: vi.fn(),
  identify: vi.fn(),
  reset: vi.fn(),
  opt_out_capturing: vi.fn(),
  opt_in_capturing: vi.fn(),
  __loaded: true,
}

vi.mock('posthog-js', () => ({
  default: mockPostHog,
}))
