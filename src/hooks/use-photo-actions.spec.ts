import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import type { Photo } from '~/types/photos'
import { usePhotoActions } from './use-photo-actions'

const mockPhoto: Photo = {
  id: 'photo-1',
  filename: 'test.jpg',
  title: 'Test Photo',
  url: 'https://example.com/test.jpg',
  fileId: 'file-123',
  size: 1024,
  category: 'memory',
  order: 0,
  createdAt: new Date(),
}

describe('usePhotoActions', () => {
  it('should initialize with default state values', () => {
    const { result } = renderHook(() => usePhotoActions())

    expect(result.current.modalOpen).toBe(false)
    expect(result.current.editingId).toBe(null)
    expect(result.current.editTitle).toBe('')
    expect(result.current.activeId).toBe(null)
    expect(result.current.localPhotos).toEqual([])
    expect(result.current.reorderingPhotoId).toBe(null)
  })

  describe('modal state management', () => {
    it('should toggle modal state', () => {
      const { result } = renderHook(() => usePhotoActions())

      act(() => {
        result.current.setModalOpen(true)
      })

      expect(result.current.modalOpen).toBe(true)

      act(() => {
        result.current.setModalOpen(false)
      })

      expect(result.current.modalOpen).toBe(false)
    })
  })

  describe('edit state management', () => {
    it('should start editing with photo data', () => {
      const { result } = renderHook(() => usePhotoActions())

      act(() => {
        result.current.handleEditStart(mockPhoto)
      })

      expect(result.current.editingId).toBe('photo-1')
      expect(result.current.editTitle).toBe('Test Photo')
    })

    it('should handle edit start with empty title', () => {
      const photoWithoutTitle = { ...mockPhoto, title: null }
      const { result } = renderHook(() => usePhotoActions())

      act(() => {
        result.current.handleEditStart(photoWithoutTitle)
      })

      expect(result.current.editingId).toBe('photo-1')
      expect(result.current.editTitle).toBe('')
    })

    it('should cancel editing and clear state', () => {
      const { result } = renderHook(() => usePhotoActions())

      // Start editing first
      act(() => {
        result.current.handleEditStart(mockPhoto)
      })

      expect(result.current.editingId).toBe('photo-1')
      expect(result.current.editTitle).toBe('Test Photo')

      // Cancel editing
      act(() => {
        result.current.handleEditCancel()
      })

      expect(result.current.editingId).toBe(null)
      expect(result.current.editTitle).toBe('')
    })

    it('should reset edit state', () => {
      const { result } = renderHook(() => usePhotoActions())

      // Set some edit state
      act(() => {
        result.current.handleEditStart(mockPhoto)
      })

      // Reset state
      act(() => {
        result.current.resetEditState()
      })

      expect(result.current.editingId).toBe(null)
      expect(result.current.editTitle).toBe('')
    })

    it('should update edit title', () => {
      const { result } = renderHook(() => usePhotoActions())

      act(() => {
        result.current.setEditTitle('New Photo Title')
      })

      expect(result.current.editTitle).toBe('New Photo Title')
    })
  })

  describe('active state management', () => {
    it('should set and clear active photo id', () => {
      const { result } = renderHook(() => usePhotoActions())

      act(() => {
        result.current.setActiveId('photo-123')
      })

      expect(result.current.activeId).toBe('photo-123')

      act(() => {
        result.current.setActiveId(null)
      })

      expect(result.current.activeId).toBe(null)
    })
  })

  describe('local photos state management', () => {
    const mockPhotos: Photo[] = [
      mockPhoto,
      {
        ...mockPhoto,
        id: 'photo-2',
        title: 'Second Photo',
        order: 1,
      },
    ]

    it('should set local photos array', () => {
      const { result } = renderHook(() => usePhotoActions())

      act(() => {
        result.current.setLocalPhotos(mockPhotos)
      })

      expect(result.current.localPhotos).toHaveLength(2)
      expect(result.current.localPhotos[0].id).toBe('photo-1')
      expect(result.current.localPhotos[1].id).toBe('photo-2')
    })

    it('should clear local photos', () => {
      const { result } = renderHook(() => usePhotoActions())

      // Set photos first
      act(() => {
        result.current.setLocalPhotos(mockPhotos)
      })

      expect(result.current.localPhotos).toHaveLength(2)

      // Clear photos
      act(() => {
        result.current.setLocalPhotos([])
      })

      expect(result.current.localPhotos).toEqual([])
    })
  })

  describe('reordering state management', () => {
    it('should set and clear reordering photo id', () => {
      const { result } = renderHook(() => usePhotoActions())

      act(() => {
        result.current.setReorderingPhotoId('photo-456')
      })

      expect(result.current.reorderingPhotoId).toBe('photo-456')

      act(() => {
        result.current.setReorderingPhotoId(null)
      })

      expect(result.current.reorderingPhotoId).toBe(null)
    })
  })

  describe('complete workflow', () => {
    it('should handle a complete edit workflow', () => {
      const { result } = renderHook(() => usePhotoActions())

      // Start editing
      act(() => {
        result.current.handleEditStart(mockPhoto)
      })

      expect(result.current.editingId).toBe('photo-1')
      expect(result.current.editTitle).toBe('Test Photo')

      // Update title
      act(() => {
        result.current.setEditTitle('Updated Photo Title')
      })

      expect(result.current.editTitle).toBe('Updated Photo Title')

      // Reset state (simulate save completion)
      act(() => {
        result.current.resetEditState()
      })

      expect(result.current.editingId).toBe(null)
      expect(result.current.editTitle).toBe('')
    })

    it('should handle drag and drop workflow', () => {
      const { result } = renderHook(() => usePhotoActions())

      // Set active photo for dragging
      act(() => {
        result.current.setActiveId('photo-1')
      })

      // Set reordering state
      act(() => {
        result.current.setReorderingPhotoId('photo-1')
      })

      expect(result.current.activeId).toBe('photo-1')
      expect(result.current.reorderingPhotoId).toBe('photo-1')

      // Clear states after reorder
      act(() => {
        result.current.setActiveId(null)
        result.current.setReorderingPhotoId(null)
      })

      expect(result.current.activeId).toBe(null)
      expect(result.current.reorderingPhotoId).toBe(null)
    })
  })
})
