import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { testDb } from '~tests/mocks/database'
import { cleanTestDatabase, createTestPhoto, initializeTestDatabase } from '~tests/utils/database'
import { useDeletePhoto, useMemories, usePhotos, useReorderPhotos, useUpdatePhoto, useUploadPhoto } from './use-photos'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('~/lib/database/client', () => ({
  db: testDb,
}))

vi.mock('~/lib/images/client', () => ({
  uploadImage: vi.fn(),
  deleteImage: vi.fn(),
}))

vi.mock('~/hooks/use-toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))
function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for predictable test behavior
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false, // Disable retries for predictable test behavior
      },
    },
  })

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Photos React Query Hooks Integration Tests', () => {
  beforeEach(async () => {
    await initializeTestDatabase()
    await cleanTestDatabase()

    vi.clearAllMocks()
    const { uploadImage, deleteImage } = await import('~/lib/images/client')
    vi.mocked(uploadImage).mockReset()
    vi.mocked(deleteImage).mockReset()
  })

  describe('usePhotos', () => {
    it('should fetch all photos successfully', async () => {
      await createTestPhoto({
        filename: 'photo1.jpg',
        title: 'Photo 1',
        url: 'https://ik.imagekit.io/test/photo1.jpg',
        fileId: 'file_1',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })
      await createTestPhoto({
        filename: 'photo2.jpg',
        title: 'Photo 2',
        url: 'https://ik.imagekit.io/test/photo2.jpg',
        fileId: 'file_2',
        size: 1_500_000,
        category: 'event',
        order: 1,
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => usePhotos(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data).toHaveLength(2)
      expect(result.current.data?.[0].title).toBe('Photo 1')
    })

    it('should handle empty photos list', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => usePhotos(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(0)
    })

    it('should handle server error', async () => {
      const originalSelect = testDb.select
      const mockSelect = vi.fn().mockImplementation(() => {
        throw new Error('Database error')
      })
      testDb.select = mockSelect as unknown as typeof testDb.select

      const wrapper = createWrapper()
      const { result } = renderHook(() => usePhotos(), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()

      testDb.select = originalSelect
    })
  })

  describe('useMemories', () => {
    it('should fetch only memory category photos', async () => {
      await createTestPhoto({
        filename: 'memory.jpg',
        title: 'Memory Photo',
        url: 'https://ik.imagekit.io/test/memory.jpg',
        fileId: 'memory_file',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })
      await createTestPhoto({
        filename: 'event.jpg',
        title: 'Event Photo',
        url: 'https://ik.imagekit.io/test/event.jpg',
        fileId: 'event_file',
        size: 1_000_000,
        category: 'event',
        order: 0,
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useMemories(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(1)
      expect(result.current.data?.[0].category).toBe('memory')
      expect(result.current.data?.[0].title).toBe('Memory Photo')
    })

    it('should handle empty memories', async () => {
      await createTestPhoto({
        filename: 'event.jpg',
        title: 'Event Photo',
        url: 'https://ik.imagekit.io/test/event.jpg',
        fileId: 'event_file',
        size: 1_000_000,
        category: 'event',
        order: 0,
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useMemories(), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toHaveLength(0)
    })
  })

  describe('useUploadPhoto', () => {
    it('should upload photo and invalidate cache', async () => {
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

      const wrapper = createWrapper()
      const { result } = renderHook(() => useUploadPhoto(), { wrapper })

      await act(() => {
        result.current.mutate(mockFile)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.filename).toBe(mockUploadResult.name)
      expect(result.current.data?.category).toBe('memory')
    })

    it('should handle upload error', async () => {
      const { uploadImage } = await import('~/lib/images/client')
      vi.mocked(uploadImage).mockRejectedValue(new Error('Upload failed'))

      const mockFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useUploadPhoto(), { wrapper })

      await act(() => {
        result.current.mutate(mockFile)
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('useUpdatePhoto', () => {
    it('should update photo title and invalidate cache', async () => {
      const photo = await createTestPhoto({
        filename: 'test.jpg',
        title: 'Original Title',
        url: 'https://ik.imagekit.io/test/test.jpg',
        fileId: 'file_test',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useUpdatePhoto(), { wrapper })

      await act(() => {
        result.current.mutate({
          id: photo.id.toString(),
          title: 'New Title',
        })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.title).toBe('New Title')
      expect(result.current.data?.id).toBe(photo.id)
    })

    it('should handle update error when photo not found', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useUpdatePhoto(), { wrapper })

      await act(() => {
        result.current.mutate({
          id: '999999',
          title: 'New Title',
        })
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('useDeletePhoto', () => {
    it('should delete photo and invalidate cache', async () => {
      const photo = await createTestPhoto({
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

      const wrapper = createWrapper()
      const { result } = renderHook(() => useDeletePhoto(), { wrapper })

      await act(() => {
        result.current.mutate(photo.id.toString())
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(photo.id.toString())
      expect(deleteImage).toHaveBeenCalledWith(photo.fileId)
    })

    it('should handle delete error when photo not found', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useDeletePhoto(), { wrapper })

      await act(() => {
        result.current.mutate('999999')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('useReorderPhotos', () => {
    it('should reorder photos and invalidate cache', async () => {
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

      const wrapper = createWrapper()
      const { result } = renderHook(() => useReorderPhotos(), { wrapper })

      const newOrder = [photo2.id.toString(), photo1.id.toString()]

      await act(() => {
        result.current.mutate(newOrder)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeUndefined()
    })

    it('should handle reorder error with invalid IDs', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useReorderPhotos(), { wrapper })

      await act(() => {
        result.current.mutate(['invalid-id'])
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('React Query integration features', () => {
    it('should handle multiple concurrent mutations', async () => {
      const photo1 = await createTestPhoto({
        filename: 'photo1.jpg',
        title: 'Original Title 1',
        url: 'https://ik.imagekit.io/test/photo1.jpg',
        fileId: 'file_1',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })
      const photo2 = await createTestPhoto({
        filename: 'photo2.jpg',
        title: 'Original Title 2',
        url: 'https://ik.imagekit.io/test/photo2.jpg',
        fileId: 'file_2',
        size: 1_000_000,
        category: 'memory',
        order: 1,
      })

      const { deleteImage } = await import('~/lib/images/client')
      vi.mocked(deleteImage).mockResolvedValue(undefined)

      const wrapper = createWrapper()
      const { result: updateResult } = renderHook(() => useUpdatePhoto(), { wrapper })
      const { result: deleteResult } = renderHook(() => useDeletePhoto(), { wrapper })

      await act(() => {
        updateResult.current.mutate({
          id: photo1.id.toString(),
          title: 'Updated Title',
        })
        deleteResult.current.mutate(photo2.id.toString())
      })

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
        expect(deleteResult.current.isSuccess).toBe(true)
      })

      expect(updateResult.current.data?.title).toBe('Updated Title')
      expect(deleteResult.current.data).toBe(photo2.id.toString())
    })

    it('should properly handle cache invalidation with upload', async () => {
      await createTestPhoto({
        filename: 'initial.jpg',
        title: 'Initial Photo',
        url: 'https://ik.imagekit.io/test/initial.jpg',
        fileId: 'initial_file',
        size: 1_000_000,
        category: 'memory',
        order: 0,
      })

      const mockFile = new File(['test'], 'new.jpg', { type: 'image/jpeg' })
      const mockUploadResult = {
        name: 'new.jpg',
        url: 'https://ik.imagekit.io/test/new.jpg',
        fileId: 'new_file',
        size: 500_000,
        filePath: '/new.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/test/new.jpg',
        fileType: 'image/jpeg',
      }

      const { uploadImage } = await import('~/lib/images/client')
      vi.mocked(uploadImage).mockResolvedValue(mockUploadResult)

      const wrapper = createWrapper()
      const { result: queryResult } = renderHook(() => useMemories(), { wrapper })
      const { result: uploadResult } = renderHook(() => useUploadPhoto(), { wrapper })

      await waitFor(() => {
        expect(queryResult.current.isSuccess).toBe(true)
      })

      expect(queryResult.current.data).toHaveLength(1)

      await act(() => {
        uploadResult.current.mutate(mockFile)
      })

      await waitFor(() => {
        expect(uploadResult.current.isSuccess).toBe(true)
      })

      // Query should be invalidated and refetch
      await waitFor(() => {
        expect(queryResult.current.data).toHaveLength(2)
      })
    })

    it('should maintain loading states correctly', async () => {
      const { uploadImage } = await import('~/lib/images/client')
      vi.mocked(uploadImage).mockResolvedValue({
        name: 'test.jpg',
        url: 'https://ik.imagekit.io/test/test.jpg',
        fileId: 'test_file',
        size: 1_000_000,
        filePath: '/test.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/test/test.jpg',
        fileType: 'image/jpeg',
      })

      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useUploadPhoto(), { wrapper })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.isSuccess).toBe(false)

      await act(() => {
        result.current.mutate(mockFile)
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should handle complete photo workflow', async () => {
      const mockFile = new File(['test'], 'workflow.jpg', { type: 'image/jpeg' })
      const mockUploadResult = {
        name: 'workflow.jpg',
        url: 'https://ik.imagekit.io/test/workflow.jpg',
        fileId: 'workflow_file',
        size: 1_000_000,
        filePath: '/workflow.jpg',
        thumbnailUrl: 'https://ik.imagekit.io/test/workflow.jpg',
        fileType: 'image/jpeg',
      }

      const { uploadImage, deleteImage } = await import('~/lib/images/client')
      vi.mocked(uploadImage).mockResolvedValue(mockUploadResult)
      vi.mocked(deleteImage).mockResolvedValue(undefined)

      const wrapper = createWrapper()
      const { result: uploadResult } = renderHook(() => useUploadPhoto(), { wrapper })
      const { result: updateResult } = renderHook(() => useUpdatePhoto(), { wrapper })
      const { result: deleteResult } = renderHook(() => useDeletePhoto(), { wrapper })

      await act(() => {
        uploadResult.current.mutate(mockFile)
      })

      await waitFor(() => {
        expect(uploadResult.current.isSuccess).toBe(true)
      })

      const uploadedPhoto = uploadResult.current.data
      if (!uploadedPhoto) throw new Error('Upload result is undefined')

      await act(() => {
        updateResult.current.mutate({
          id: uploadedPhoto.id.toString(),
          title: 'Updated Workflow Title',
        })
      })

      await waitFor(() => {
        expect(updateResult.current.isSuccess).toBe(true)
      })

      expect(updateResult.current.data?.title).toBe('Updated Workflow Title')

      await act(() => {
        deleteResult.current.mutate(uploadedPhoto.id.toString())
      })

      await waitFor(() => {
        expect(deleteResult.current.isSuccess).toBe(true)
      })

      expect(deleteResult.current.data).toBe(uploadedPhoto.id.toString())
      expect(deleteImage).toHaveBeenCalledWith(uploadedPhoto.fileId)
    })
  })
})
