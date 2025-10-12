import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock environment variables for all tests
vi.stubEnv('DATABASE_URL', 'postgresql://test:test@localhost:5432/test_db')
vi.stubEnv('JWT_SECRET', 'test-jwt-secret-32-characters-minimum')
vi.stubEnv('IMAGEKIT_PRIVATE_KEY', 'test-private-key')
vi.stubEnv('IMAGEKIT_PUBLIC_KEY', 'test-public-key')
vi.stubEnv('NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY', 'test-public-key')
vi.stubEnv('NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT', 'https://ik.imagekit.io/test')
vi.stubEnv('NEXT_PUBLIC_POSTHOG_KEY', 'test-posthog-key')
vi.stubEnv('NEXT_PUBLIC_POSTHOG_HOST', 'https://test.posthog.com')
vi.stubEnv('SKIP_ENV_VALIDATION', 'true')

// Import all global mocks
import './tests/mocks/next'
import './tests/mocks/imagekit'
import './tests/mocks/posthog'
