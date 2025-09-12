/**
 * @vitest-environment node
 */
/** biome-ignore-all lint/suspicious/noExplicitAny: acceptable for test mocking */

import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('imagekit', () => ({
  default: vi.fn().mockImplementation(() => ({
    upload: vi.fn(),
    deleteFile: vi.fn(),
  })),
}))

vi.mock('~/env', () => ({
  env: {
    IMAGEKIT_PRIVATE_KEY: 'test-private-key',
    NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY: 'test-public-key',
    NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT: 'https://ik.imagekit.io/test',
  },
}))

vi.stubGlobal('crypto', {
  randomUUID: vi.fn().mockReturnValue('test-uuid-123'),
})

import { deleteImage, getImageUrl, getOptimizedImageUrl, imagekit, uploadImage } from './client'

describe('Image Client Utils', () => {
  let mockUpload: ReturnType<typeof vi.fn>
  let mockDeleteFile: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()

    mockUpload = (imagekit as any).upload
    mockDeleteFile = (imagekit as any).deleteFile
  })

  describe('getImageUrl()', () => {
    const baseUrl = 'https://ik.imagekit.io/test'
    const filePath = '/memories/photo.jpg'

    it('should return base URL with file path when no transformations', () => {
      const result = getImageUrl(filePath)

      expect(result).toBe(`${baseUrl}${filePath}`)
    })

    it('should return URL with transformations when provided', () => {
      const transformations = ['w-300', 'h-200', 'q-80']

      const result = getImageUrl(filePath, transformations)

      expect(result).toBe(`${baseUrl}/tr:w-300,h-200,q-80${filePath}`)
    })

    it('should handle empty transformations array', () => {
      const result = getImageUrl(filePath, [])

      expect(result).toBe(`${baseUrl}${filePath}`)
    })

    it('should handle single transformation', () => {
      const result = getImageUrl(filePath, ['w-500'])

      expect(result).toBe(`${baseUrl}/tr:w-500${filePath}`)
    })
  })

  describe('getOptimizedImageUrl()', () => {
    const baseUrl = 'https://ik.imagekit.io/test'
    const filePath = '/memories/photo.jpg'

    it('should return optimized URL with default quality and auto format', () => {
      const result = getOptimizedImageUrl(filePath)

      expect(result).toBe(`${baseUrl}/tr:q-80,f-auto${filePath}`)
    })

    it('should include width when provided', () => {
      const result = getOptimizedImageUrl(filePath, 300)

      expect(result).toBe(`${baseUrl}/tr:w-300,q-80,f-auto${filePath}`)
    })

    it('should include height when provided', () => {
      const result = getOptimizedImageUrl(filePath, undefined, 200)

      expect(result).toBe(`${baseUrl}/tr:h-200,q-80,f-auto${filePath}`)
    })

    it('should include width and height when both provided', () => {
      const result = getOptimizedImageUrl(filePath, 300, 200)

      expect(result).toBe(`${baseUrl}/tr:w-300,h-200,q-80,f-auto${filePath}`)
    })

    it('should use custom quality when provided', () => {
      const result = getOptimizedImageUrl(filePath, 300, 200, 90)

      expect(result).toBe(`${baseUrl}/tr:w-300,h-200,q-90,f-auto${filePath}`)
    })

    it('should handle zero quality', () => {
      const result = getOptimizedImageUrl(filePath, undefined, undefined, 0)

      expect(result).toBe(`${baseUrl}/tr:q-0,f-auto${filePath}`)
    })
  })

  describe('uploadImage()', () => {
    const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
    const mockUploadResult = {
      fileId: 'file-123',
      name: 'test-uuid-123.jpg',
      size: 1024,
      filePath: '/memories/test-uuid-123.jpg',
      url: 'https://ik.imagekit.io/test/memories/test-uuid-123.jpg',
      thumbnailUrl: 'https://ik.imagekit.io/test/memories/test-uuid-123.jpg',
      fileType: 'image',
    }

    it('should upload image successfully with default folder', async () => {
      mockUpload.mockResolvedValue(mockUploadResult)

      const result = await uploadImage(mockFile)

      expect(result).toEqual({
        fileId: 'file-123',
        name: 'test-uuid-123.jpg',
        size: 1024,
        filePath: '/memories/test-uuid-123.jpg',
        url: 'https://ik.imagekit.io/test/memories/test-uuid-123.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/test/memories/test-uuid-123.jpg',
        fileType: 'image',
      })

      expect(mockUpload).toHaveBeenCalledWith({
        file: expect.any(Buffer),
        fileName: 'test-uuid-123.jpg',
        folder: '/memories',
        useUniqueFileName: false,
      })
    })

    it('should upload image with custom folder', async () => {
      mockUpload.mockResolvedValue(mockUploadResult)

      await uploadImage(mockFile, 'events')

      expect(mockUpload).toHaveBeenCalledWith(
        expect.objectContaining({
          folder: '/events',
        }),
      )
    })

    it('should use thumbnailUrl fallback when not provided', async () => {
      const resultWithoutThumbnail = { ...mockUploadResult, thumbnailUrl: undefined }
      mockUpload.mockResolvedValue(resultWithoutThumbnail)

      const result = await uploadImage(mockFile)

      expect(result.thumbnailUrl).toBe(mockUploadResult.url)
    })

    it('should throw error when upload fails', async () => {
      const uploadError = new Error('ImageKit upload failed')
      mockUpload.mockRejectedValue(uploadError)

      await expect(uploadImage(mockFile)).rejects.toThrow('Failed to upload image: ImageKit upload failed')
    })

    it('should throw error with generic message for unknown errors', async () => {
      mockUpload.mockRejectedValue('Unknown error type')

      await expect(uploadImage(mockFile)).rejects.toThrow('Failed to upload image: Unknown error')
    })
  })

  describe('deleteImage()', () => {
    it('should delete image successfully', async () => {
      mockDeleteFile.mockResolvedValue(undefined)

      await deleteImage('file-123')

      expect(mockDeleteFile).toHaveBeenCalledWith('file-123')
    })

    it('should throw error when deletion fails', async () => {
      const deleteError = new Error('ImageKit deletion failed')
      mockDeleteFile.mockRejectedValue(deleteError)

      await expect(deleteImage('file-123')).rejects.toThrow('Failed to delete image: ImageKit deletion failed')
    })

    it('should throw error with generic message for unknown errors', async () => {
      mockDeleteFile.mockRejectedValue('Unknown error type')

      await expect(deleteImage('file-123')).rejects.toThrow('Failed to delete image: Unknown error')
    })
  })
})
