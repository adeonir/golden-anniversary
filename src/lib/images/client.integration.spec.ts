import { beforeEach, describe, expect, it, vi } from 'vitest'

import { deleteImage, getImageUrl, imagekit, uploadImage } from '~/lib/images/client'
import { mockImageKitClient, resetImageKitMocks } from '~tests/mocks/imagekit'

const JPG_REGEX = /\.jpg$/

describe('ImageKit Client Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetImageKitMocks()

    // Ensure File.prototype.arrayBuffer exists in jsdom environment
    if (!(File.prototype as unknown as { arrayBuffer?: () => Promise<ArrayBuffer> }).arrayBuffer) {
      const proto = File.prototype as unknown as { arrayBuffer: () => Promise<ArrayBuffer> }
      proto.arrayBuffer = () => Promise.resolve(new ArrayBuffer(8))
    }
  })

  it('exposes ImageKit SDK methods via instance', () => {
    // After mocks reset, verify the instance exposes SDK methods
    expect(typeof (imagekit as unknown as { upload: unknown }).upload).toBe('function')
    expect(typeof (imagekit as unknown as { deleteFile: unknown }).deleteFile).toBe('function')
  })

  it('uploads an image and returns normalized result', async () => {
    const file = new File(['hello'], 'hello.jpg', { type: 'image/jpeg' })
    const result = await uploadImage(file, 'memories')

    expect(result).toEqual({
      fileId: expect.any(String),
      name: expect.stringMatching(JPG_REGEX),
      size: expect.any(Number),
      filePath: expect.stringContaining('/memories/'),
      url: expect.stringContaining('https://'),
      thumbnailUrl: expect.stringContaining('https://'),
      fileType: expect.any(String),
    })

    expect(mockImageKitClient.upload).toHaveBeenCalledTimes(1)
    expect(mockImageKitClient.upload).toHaveBeenCalledWith(
      expect.objectContaining({
        file: expect.any(Buffer),
        fileName: expect.stringMatching(JPG_REGEX),
        folder: '/memories',
        useUniqueFileName: false,
      }),
    )
  })

  it('deletes an image using SDK', async () => {
    await deleteImage('mock-file-id-123')
    expect(mockImageKitClient.deleteFile).toHaveBeenCalledWith('mock-file-id-123')
  })

  it('propagates SDK errors with normalized messages (upload)', async () => {
    mockImageKitClient.upload.mockRejectedValueOnce(new Error('upload failed'))

    const file = new File(['x'], 'x.jpg', { type: 'image/jpeg' })
    await expect(uploadImage(file)).rejects.toThrow('Failed to upload image: upload failed')
  })

  it('propagates SDK errors with normalized messages (delete)', async () => {
    mockImageKitClient.deleteFile.mockRejectedValueOnce(new Error('delete failed'))
    await expect(deleteImage('any')).rejects.toThrow('Failed to delete image: delete failed')
  })

  it('builds public URLs using configured endpoint', () => {
    const url = getImageUrl('/memories/pic.jpg')
    expect(url).toBe('https://ik.imagekit.io/test/memories/pic.jpg')
  })
})
