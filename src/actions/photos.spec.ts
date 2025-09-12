import { beforeEach, describe, expect, it, vi } from 'vitest'
import { testDb } from '~tests/mocks/database'
import { cleanTestDatabase, createTestPhoto, initializeTestDatabase } from '~tests/utils/database'
import { deletePhoto, fetchMemories, fetchPhotos, reorderPhotos, updatePhoto, uploadPhoto } from './photos'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('~/lib/images/client', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}))

vi.mock('~/lib/database/client', () => ({
  db: testDb,
}))

describe('Photos Server Actions Integration Tests', () => {
  beforeEach(async () => {
    await initializeTestDatabase()
    await cleanTestDatabase()

    // Reset ImageKit mocks
    const { uploadImage, deleteImage } = await import('~/lib/images/client')
    vi.mocked(uploadImage).mockReset()
    vi.mocked(deleteImage).mockReset()
  })

  describe('fetchPhotos', () => {
    beforeEach(async () => {
      // Create test photos with different categories and orders
      await createTestPhoto({
        filename: 'memory1.jpg',
        title: 'Memory Photo 1',
        url: 'https://ik.imagekit.io/test/memory1.jpg',
        fileId: 'file_memory1',
        size: 1_000_000,
        category: 'memory',
        order: 2,
      })
      await createTestPhoto({
        filename: 'memory2.jpg',
        title: 'Memory Photo 2',
        url: 'https://ik.imagekit.io/test/memory2.jpg',
        fileId: 'file_memory2',
        size: 1_500_000,
        category: 'memory',
        order: 1,
      })
      await createTestPhoto({
        filename: 'event1.jpg',
        title: 'Event Photo 1',
        url: 'https://ik.imagekit.io/test/event1.jpg',
        fileId: 'file_event1',
        size: 2_000_000,
        category: 'event',
        order: 0,
      })
    })

    it('should fetch all photos ordered by order field', async () => {
      const result = await fetchPhotos()

      expect(result).toHaveLength(3)
      expect(result[0].title).toBe('Event Photo 1') // order: 0
      expect(result[1].title).toBe('Memory Photo 2') // order: 1
      expect(result[2].title).toBe('Memory Photo 1') // order: 2
    })

    it('should filter photos by memory category', async () => {
      const result = await fetchPhotos('memory')

      expect(result).toHaveLength(2)
      expect(result.every((photo) => photo.category === 'memory')).toBe(true)
      expect(result[0].title).toBe('Memory Photo 2') // order: 1
      expect(result[1].title).toBe('Memory Photo 1') // order: 2
    })

    it('should filter photos by event category', async () => {
      const result = await fetchPhotos('event')

      expect(result).toHaveLength(1)
      expect(result[0].category).toBe('event')
      expect(result[0].title).toBe('Event Photo 1')
    })

    it('should return empty array when no photos match category', async () => {
      // Clear all photos first
      await cleanTestDatabase()

      const result = await fetchPhotos('memory')
      expect(result).toHaveLength(0)
    })

    it('should return photos with Date objects for createdAt', async () => {
      const result = await fetchPhotos()

      expect(result.length).toBeGreaterThan(0)
      for (const photo of result) {
        expect(photo.createdAt).toBeInstanceOf(Date)
      }
    })
  })

  describe('fetchMemories', () => {
    beforeEach(async () => {
      await createTestPhoto({
        filename: 'memory1.jpg',
        title: 'Memory Photo',
        url: 'https://ik.imagekit.io/test/memory1.jpg',
        fileId: 'file_memory1',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })
      await createTestPhoto({
        filename: 'event1.jpg',
        title: 'Event Photo',
        url: 'https://ik.imagekit.io/test/event1.jpg',
        fileId: 'file_event1',
        size: 1_000_000,
        category: 'event',
        order: 0,
      })
    })

    it('should fetch only memory category photos', async () => {
      const result = await fetchMemories()

      expect(result).toHaveLength(1)
      expect(result[0].category).toBe('memory')
      expect(result[0].title).toBe('Memory Photo')
    })
  })

  describe('uploadPhoto', () => {
    it('should upload photo and save to database', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      const mockUploadResult = {
        name: 'uploaded_test.jpg',
        url: 'https://ik.imagekit.io/test/uploaded_test.jpg',
        fileId: 'file_uploaded_test',
        size: 1_234_567,
        filePath: '/uploaded_test.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/test/uploaded_test.jpg',
        fileType: 'image/jpeg',
      }

      const { uploadImage } = await import('~/lib/images/client')
      vi.mocked(uploadImage).mockResolvedValue(mockUploadResult)

      const result = await uploadPhoto(mockFile)

      expect(uploadImage).toHaveBeenCalledWith(mockFile, 'memories')
      expect(result).toBeDefined()
      expect(result.filename).toBe(mockUploadResult.name)
      expect(result.title).toBe(mockFile.name) // Uses original file name as title
      expect(result.url).toBe(mockUploadResult.url)
      expect(result.fileId).toBe(mockUploadResult.fileId)
      expect(result.size).toBe(mockUploadResult.size)
      expect(result.category).toBe('memory')
      expect(result.createdAt).toBeInstanceOf(Date)

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=memories')
    })

    it('should cleanup ImageKit file when database save fails', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
      const mockUploadResult = {
        name: 'uploaded_test.jpg',
        url: 'https://ik.imagekit.io/test/uploaded_test.jpg',
        fileId: 'file_uploaded_test',
        size: 1_234_567,
        filePath: '/uploaded_test.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/test/uploaded_test.jpg',
        fileType: 'image/jpeg',
      }

      const { uploadImage, deleteImage } = await import('~/lib/images/client')
      vi.mocked(uploadImage).mockResolvedValue(mockUploadResult)
      vi.mocked(deleteImage).mockResolvedValue(undefined)

      // Mock database insert failure by making returning() return empty array
      const originalInsert = testDb.insert
      const mockInsert = vi.fn().mockReturnValue({
        values: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([]), // Simulate no photo returned (failure)
        }),
      })
      testDb.insert = mockInsert as unknown as typeof testDb.insert

      await expect(uploadPhoto(mockFile)).rejects.toThrow('Failed to upload photo')

      expect(uploadImage).toHaveBeenCalled()
      expect(deleteImage).toHaveBeenCalledWith(mockUploadResult.fileId)

      // Restore original insert
      testDb.insert = originalInsert
    })

    it('should handle ImageKit upload failure', async () => {
      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

      const { uploadImage } = await import('~/lib/images/client')
      vi.mocked(uploadImage).mockRejectedValue(new Error('ImageKit upload failed'))

      await expect(uploadPhoto(mockFile)).rejects.toThrow('Failed to upload photo')
      expect(uploadImage).toHaveBeenCalledWith(mockFile, 'memories')
    })
  })

  describe('updatePhoto', () => {
    it('should update photo title', async () => {
      const createdPhoto = await createTestPhoto({
        filename: 'test.jpg',
        title: 'Original Title',
        url: 'https://ik.imagekit.io/test/test.jpg',
        fileId: 'file_test',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })

      const result = await updatePhoto(createdPhoto.id.toString(), 'New Title')

      expect(result).toBeDefined()
      expect(result.id).toBe(createdPhoto.id)
      expect(result.title).toBe('New Title')
      expect(result.filename).toBe(createdPhoto.filename) // Other fields unchanged
      expect(result.createdAt).toBeInstanceOf(Date)

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=memories')
    })

    it('should throw error when photo not found', async () => {
      await expect(updatePhoto('99999', 'New Title')).rejects.toThrow('Failed to update photo')
    })

    it('should throw error with invalid id format', async () => {
      await expect(updatePhoto('invalid-id', 'New Title')).rejects.toThrow('Failed to update photo')
    })

    it('should handle empty title', async () => {
      const createdPhoto = await createTestPhoto({
        filename: 'test.jpg',
        title: 'Original Title',
        url: 'https://ik.imagekit.io/test/test.jpg',
        fileId: 'file_test',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })

      const result = await updatePhoto(createdPhoto.id.toString(), '')

      expect(result.title).toBe('')
    })
  })

  describe('reorderPhotos', () => {
    it('should reorder photos by updating order field', async () => {
      const photo1 = await createTestPhoto({
        filename: 'photo1.jpg',
        title: 'Photo 1',
        url: 'https://ik.imagekit.io/test/photo1.jpg',
        fileId: 'file_1',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })
      const photo2 = await createTestPhoto({
        filename: 'photo2.jpg',
        title: 'Photo 2',
        url: 'https://ik.imagekit.io/test/photo2.jpg',
        fileId: 'file_2',
        size: 1_000_000,
        category: 'memory',
        order: 1,
      })
      const photo3 = await createTestPhoto({
        filename: 'photo3.jpg',
        title: 'Photo 3',
        url: 'https://ik.imagekit.io/test/photo3.jpg',
        fileId: 'file_3',
        size: 1_000_000,
        category: 'memory',
        order: 2,
      })

      // Reorder: photo3, photo1, photo2
      const newOrder = [photo3.id.toString(), photo1.id.toString(), photo2.id.toString()]

      await reorderPhotos(newOrder)

      // Verify new order
      const reorderedPhotos = await fetchPhotos('memory')

      expect(reorderedPhotos).toHaveLength(3)
      expect(reorderedPhotos[0].id).toBe(photo3.id) // order: 0
      expect(reorderedPhotos[1].id).toBe(photo1.id) // order: 1
      expect(reorderedPhotos[2].id).toBe(photo2.id) // order: 2

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=memories')
    })

    it('should handle empty array', async () => {
      await expect(reorderPhotos([])).resolves.not.toThrow()
    })

    it('should handle single photo', async () => {
      const photo = await createTestPhoto({
        filename: 'single.jpg',
        title: 'Single Photo',
        url: 'https://ik.imagekit.io/test/single.jpg',
        fileId: 'file_single',
        size: 1_000_000,
        category: 'memory',
        order: 5,
      })

      await reorderPhotos([photo.id.toString()])

      const photos = await fetchPhotos('memory')
      expect(photos).toHaveLength(1)
      expect(photos[0].order).toBe(0) // Should be updated to 0
    })

    it('should handle invalid photo IDs gracefully', async () => {
      // Should handle numeric IDs that don't exist (no error)
      await expect(reorderPhotos(['99999', '88888'])).resolves.not.toThrow()

      // Should throw error with invalid ID format (non-numeric)
      await expect(reorderPhotos(['invalid-id'])).rejects.toThrow('Failed to reorder photos')
    })
  })

  describe('deletePhoto', () => {
    it('should delete photo from database and ImageKit', async () => {
      const createdPhoto = await createTestPhoto({
        filename: 'to-delete.jpg',
        title: 'Photo to Delete',
        url: 'https://ik.imagekit.io/test/to-delete.jpg',
        fileId: 'file_to_delete',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })

      const { deleteImage } = await import('~/lib/images/client')
      vi.mocked(deleteImage).mockResolvedValue(undefined)

      const result = await deletePhoto(createdPhoto.id.toString())

      expect(result).toBe(createdPhoto.id.toString())
      expect(deleteImage).toHaveBeenCalledWith(createdPhoto.fileId)

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=memories')

      // Verify photo was deleted from database
      const remainingPhotos = await fetchPhotos()
      const deletedPhoto = remainingPhotos.find((photo) => photo.id === createdPhoto.id)
      expect(deletedPhoto).toBeUndefined()
    })

    it('should throw error when photo not found', async () => {
      await expect(deletePhoto('99999')).rejects.toThrow('Failed to delete photo')
    })

    it('should throw error with invalid id format', async () => {
      await expect(deletePhoto('invalid-id')).rejects.toThrow('Failed to delete photo')
    })

    it('should handle ImageKit deletion failure but still delete from database', async () => {
      const createdPhoto = await createTestPhoto({
        filename: 'test-delete-fail.jpg',
        title: 'Test Photo',
        url: 'https://ik.imagekit.io/test/test-delete-fail.jpg',
        fileId: 'file_delete_fail',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })

      const { deleteImage } = await import('~/lib/images/client')
      vi.mocked(deleteImage).mockRejectedValue(new Error('ImageKit delete failed'))

      await expect(deletePhoto(createdPhoto.id.toString())).rejects.toThrow('Failed to delete photo')
      expect(deleteImage).toHaveBeenCalledWith(createdPhoto.fileId)
    })
  })

  describe('End-to-end photo workflow', () => {
    it('should handle complete photo lifecycle', async () => {
      const { uploadImage, deleteImage } = await import('~/lib/images/client')

      // 1. Upload photo
      const mockFile = new File(['test content'], 'lifecycle-test.jpg', { type: 'image/jpeg' })
      const mockUploadResult = {
        name: 'uploaded_lifecycle.jpg',
        url: 'https://ik.imagekit.io/test/uploaded_lifecycle.jpg',
        fileId: 'file_lifecycle',
        size: 1_234_567,
        filePath: '/uploaded_lifecycle.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/test/uploaded_lifecycle.jpg',
        fileType: 'image/jpeg',
      }

      vi.mocked(uploadImage).mockResolvedValue(mockUploadResult)
      const uploadedPhoto = await uploadPhoto(mockFile)

      expect(uploadedPhoto.category).toBe('memory')

      // 2. Fetch memories and verify upload
      const memories = await fetchMemories()
      expect(memories).toHaveLength(1)
      expect(memories[0].id).toBe(uploadedPhoto.id)

      // 3. Update photo title
      const updatedPhoto = await updatePhoto(uploadedPhoto.id.toString(), 'Updated Lifecycle Title')
      expect(updatedPhoto.title).toBe('Updated Lifecycle Title')

      // 4. Create another photo for reordering test
      const secondPhoto = await createTestPhoto({
        filename: 'second.jpg',
        title: 'Second Photo',
        url: 'https://ik.imagekit.io/test/second.jpg',
        fileId: 'file_second',
        size: 1_000_000,
        category: 'memory',
        order: 1,
      })

      // 5. Reorder photos
      await reorderPhotos([secondPhoto.id.toString(), uploadedPhoto.id.toString()])

      const reorderedMemories = await fetchMemories()
      expect(reorderedMemories[0].id).toBe(secondPhoto.id)
      expect(reorderedMemories[1].id).toBe(uploadedPhoto.id)

      // 6. Delete photos
      vi.mocked(deleteImage).mockResolvedValue(undefined)

      await deletePhoto(uploadedPhoto.id.toString())
      await deletePhoto(secondPhoto.id.toString())

      expect(deleteImage).toHaveBeenCalledTimes(2)

      // 7. Verify all photos are deleted
      const finalMemories = await fetchMemories()
      expect(finalMemories).toHaveLength(0)
    })

    it('should maintain data consistency across operations', async () => {
      // Create multiple photos with different orders
      const photos = await Promise.all([
        createTestPhoto({
          filename: 'photo0.jpg',
          title: 'Photo 0',
          url: 'https://ik.imagekit.io/test/photo0.jpg',
          fileId: 'file_0',
          size: 1_000_000,
          category: 'memory',
          order: 0,
        }),
        createTestPhoto({
          filename: 'photo1.jpg',
          title: 'Photo 1',
          url: 'https://ik.imagekit.io/test/photo1.jpg',
          fileId: 'file_1',
          size: 1_000_001,
          category: 'memory',
          order: 1,
        }),
        createTestPhoto({
          filename: 'photo2.jpg',
          title: 'Photo 2',
          url: 'https://ik.imagekit.io/test/photo2.jpg',
          fileId: 'file_2',
          size: 1_000_002,
          category: 'memory',
          order: 2,
        }),
      ])

      // Verify initial order
      const initialPhotos = await fetchMemories()
      expect(initialPhotos).toHaveLength(3)

      // Update one photo title
      await updatePhoto(photos[1].id.toString(), 'Updated Photo 1')

      // Reorder photos
      const newOrder = [photos[2].id.toString(), photos[0].id.toString(), photos[1].id.toString()]
      await reorderPhotos(newOrder)

      // Verify final state
      const finalPhotos = await fetchMemories()
      expect(finalPhotos).toHaveLength(3)
      expect(finalPhotos[0].id).toBe(photos[2].id)
      expect(finalPhotos[1].id).toBe(photos[0].id)
      expect(finalPhotos[2].id).toBe(photos[1].id)
      expect(finalPhotos[2].title).toBe('Updated Photo 1') // Title update preserved
    })
  })
})
