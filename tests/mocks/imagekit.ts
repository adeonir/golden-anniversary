/**
 * Mock implementation for ImageKit SDK used in integration tests
 */
import { vi } from 'vitest'

// Mock upload result
export const mockUploadResult = {
  fileId: 'mock-file-id-123',
  name: 'test-image.jpg',
  url: 'https://mock-imagekit.com/test-image.jpg',
  size: 1_024_000,
  width: 1920,
  height: 1080,
}

// Mock ImageKit client methods
export const mockImageKitClient = {
  upload: vi.fn().mockResolvedValue(mockUploadResult),
  deleteFile: vi.fn().mockResolvedValue(undefined),
  getFileDetails: vi.fn().mockResolvedValue(mockUploadResult),
}

// Mock ImageKit constructor
export const MockImageKit = vi.fn(() => mockImageKitClient)

// Mock the imagekit module
vi.mock('imagekit', () => ({
  default: MockImageKit,
}))

// Helper to reset ImageKit mocks
export function resetImageKitMocks() {
  mockImageKitClient.upload.mockClear()
  mockImageKitClient.deleteFile.mockClear()
  mockImageKitClient.getFileDetails.mockClear()
  MockImageKit.mockClear()

  // Reset to default behavior
  mockImageKitClient.upload.mockResolvedValue(mockUploadResult)
  mockImageKitClient.deleteFile.mockResolvedValue(undefined)
}
