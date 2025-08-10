/**
 * @vitest-environment node
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: acceptable for test mocking */

import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock plaiceholder
vi.mock('plaiceholder', () => ({
  getPlaiceholder: vi.fn(),
}))

// Mock the client module
vi.mock('./client', () => ({
  getOptimizedImageUrl: vi.fn(),
}))

// Mock global fetch
global.fetch = vi.fn()

import { getPlaiceholder } from 'plaiceholder'
import { generateBlurDataURL, generateBlurFromFilePath } from './blur'
import { getOptimizedImageUrl } from './client'

describe('Blur Image Utils', () => {
  const mockImageUrl = 'https://example.com/image.jpg'
  const mockFilePath = '/memories/photo.jpg'
  const mockLowQualityUrl = 'https://example.com/image-low.jpg'
  const mockBase64 = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...'

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('generateBlurDataURL()', () => {
    it('should generate blur data successfully', async () => {
      vi.mocked(getOptimizedImageUrl).mockReturnValue(mockLowQualityUrl)
      vi.mocked(global.fetch).mockResolvedValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as any)
      vi.mocked(getPlaiceholder).mockResolvedValue({
        base64: mockBase64,
        metadata: {
          width: 1920,
          height: 1080,
        },
      } as any)

      const result = await generateBlurDataURL(mockImageUrl)

      expect(result).toEqual({
        blurDataURL: mockBase64,
        width: 1920,
        height: 1080,
      })

      expect(getOptimizedImageUrl).toHaveBeenCalledWith(mockImageUrl, 40, undefined, 10)
      expect(global.fetch).toHaveBeenCalledWith(mockLowQualityUrl)
      expect(getPlaiceholder).toHaveBeenCalledWith(expect.any(Buffer), { size: 10 })
    })

    it('should use correct parameters for low quality URL', async () => {
      vi.mocked(getOptimizedImageUrl).mockReturnValue(mockLowQualityUrl)
      vi.mocked(global.fetch).mockResolvedValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as any)
      vi.mocked(getPlaiceholder).mockResolvedValue({
        base64: mockBase64,
        metadata: { width: 800, height: 600 },
      } as any)

      await generateBlurDataURL(mockImageUrl)

      // Should request 40px width with 10% quality for blur
      expect(getOptimizedImageUrl).toHaveBeenCalledWith(mockImageUrl, 40, undefined, 10)
    })

    it('should return fallback blur data on fetch error', async () => {
      vi.mocked(getOptimizedImageUrl).mockReturnValue(mockLowQualityUrl)
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

      const result = await generateBlurDataURL(mockImageUrl)

      expect(result).toEqual({
        blurDataURL:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=',
        width: 800,
        height: 600,
      })
    })

    it('should return fallback blur data on plaiceholder error', async () => {
      vi.mocked(getOptimizedImageUrl).mockReturnValue(mockLowQualityUrl)
      vi.mocked(global.fetch).mockResolvedValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as any)
      vi.mocked(getPlaiceholder).mockRejectedValue(new Error('Plaiceholder processing failed'))

      const result = await generateBlurDataURL(mockImageUrl)

      expect(result).toEqual({
        blurDataURL:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=',
        width: 800,
        height: 600,
      })
    })

    it('should handle arrayBuffer conversion correctly', async () => {
      const mockArrayBuffer = new ArrayBuffer(16)
      const mockUint8Array = new Uint8Array(mockArrayBuffer)
      mockUint8Array[0] = 255

      vi.mocked(getOptimizedImageUrl).mockReturnValue(mockLowQualityUrl)
      vi.mocked(global.fetch).mockResolvedValue({
        arrayBuffer: vi.fn().mockResolvedValue(mockArrayBuffer),
      } as any)
      vi.mocked(getPlaiceholder).mockResolvedValue({
        base64: mockBase64,
        metadata: { width: 100, height: 100 },
      } as any)

      await generateBlurDataURL(mockImageUrl)

      // Verify that getPlaiceholder receives a Buffer
      expect(getPlaiceholder).toHaveBeenCalledWith(expect.any(Buffer), { size: 10 })
      const calledBuffer = vi.mocked(getPlaiceholder).mock.calls[0][0]
      expect(calledBuffer).toBeInstanceOf(Buffer)
    })
  })

  describe('generateBlurFromFilePath()', () => {
    it('should generate blur from file path', async () => {
      const optimizedUrl = 'https://cdn.example.com/optimized.jpg'
      vi.mocked(getOptimizedImageUrl).mockReturnValueOnce(optimizedUrl)
      vi.mocked(getOptimizedImageUrl).mockReturnValueOnce(mockLowQualityUrl)

      vi.mocked(global.fetch).mockResolvedValue({
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      } as any)
      vi.mocked(getPlaiceholder).mockResolvedValue({
        base64: mockBase64,
        metadata: { width: 1024, height: 768 },
      } as any)

      const result = await generateBlurFromFilePath(mockFilePath)

      expect(result).toEqual({
        blurDataURL: mockBase64,
        width: 1024,
        height: 768,
      })

      // First call to get the base URL
      expect(getOptimizedImageUrl).toHaveBeenNthCalledWith(1, mockFilePath)
      // Second call inside generateBlurDataURL for low quality
      expect(getOptimizedImageUrl).toHaveBeenNthCalledWith(2, optimizedUrl, 40, undefined, 10)
    })

    it('should handle errors and return fallback', async () => {
      vi.mocked(getOptimizedImageUrl).mockReturnValue(mockLowQualityUrl)
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

      const result = await generateBlurFromFilePath(mockFilePath)

      expect(result).toEqual({
        blurDataURL:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=',
        width: 800,
        height: 600,
      })
    })
  })
})
