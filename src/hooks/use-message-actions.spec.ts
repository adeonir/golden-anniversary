/** biome-ignore-all lint/suspicious/noExplicitAny: acceptable for test mocking */

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useMessageActions } from './use-message-actions'

// Mock confirm dialog
const mockConfirm = vi.fn()
vi.stubGlobal('confirm', mockConfirm)

describe('useMessageActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockConfirm.mockReturnValue(true)
  })

  it('should initialize with empty pending actions', () => {
    const { result } = renderHook(() => useMessageActions())

    expect(result.current.pendingActions).toEqual({})
  })

  describe('createHandler', () => {
    it('should create handler function that tracks pending state', () => {
      const mockMutation = {
        mutate: vi.fn(),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const handler = result.current.createHandler('approve', mockMutation)

      expect(typeof handler).toBe('function')
    })

    it('should execute mutation and track pending state', () => {
      const mockMutation = {
        mutate: vi.fn(),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const handler = result.current.createHandler('approve', mockMutation)

      act(() => {
        handler('message-1')
      })

      expect(mockMutation.mutate).toHaveBeenCalledWith('message-1', {
        onSettled: expect.any(Function),
      })
      expect(result.current.pendingActions).toEqual({
        'message-1': 'approve',
      })
    })

    it('should clear pending state onSettled', () => {
      const mockMutation = {
        mutate: vi.fn((_id, callbacks) => {
          // Simulate mutation settling
          callbacks.onSettled()
        }),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const handler = result.current.createHandler('reject', mockMutation)

      act(() => {
        handler('message-1')
      })

      expect(result.current.pendingActions).toEqual({})
    })

    it('should handle multiple pending actions simultaneously', () => {
      const mockMutation = {
        mutate: vi.fn(),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const approveHandler = result.current.createHandler('approve', mockMutation)
      const rejectHandler = result.current.createHandler('reject', mockMutation)

      act(() => {
        approveHandler('message-1')
        rejectHandler('message-2')
      })

      expect(result.current.pendingActions).toEqual({
        'message-1': 'approve',
        'message-2': 'reject',
      })
    })

    it('should show confirm dialog when confirmMessage is provided', () => {
      const mockMutation = {
        mutate: vi.fn(),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const handler = result.current.createHandler(
        'delete',
        mockMutation,
        'Are you sure you want to delete this message?',
      )

      act(() => {
        handler('message-1')
      })

      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this message?')
      expect(mockMutation.mutate).toHaveBeenCalled()
    })

    it('should not execute mutation when confirm dialog is cancelled', () => {
      mockConfirm.mockReturnValue(false)

      const mockMutation = {
        mutate: vi.fn(),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const handler = result.current.createHandler('delete', mockMutation, 'Are you sure?')

      act(() => {
        handler('message-1')
      })

      expect(mockConfirm).toHaveBeenCalledWith('Are you sure?')
      expect(mockMutation.mutate).not.toHaveBeenCalled()
      expect(result.current.pendingActions).toEqual({})
    })

    it('should execute mutation without confirm dialog when no confirmMessage', () => {
      const mockMutation = {
        mutate: vi.fn(),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const handler = result.current.createHandler('approve', mockMutation)

      act(() => {
        handler('message-1')
      })

      expect(mockConfirm).not.toHaveBeenCalled()
      expect(mockMutation.mutate).toHaveBeenCalled()
    })

    it('should handle different action types correctly', () => {
      const mockMutation = {
        mutate: vi.fn(),
      } as any

      const { result } = renderHook(() => useMessageActions())

      const deleteHandler = result.current.createHandler('delete', mockMutation)

      act(() => {
        deleteHandler('message-1')
      })

      expect(result.current.pendingActions).toEqual({
        'message-1': 'delete',
      })
    })

    it('should properly clear individual pending actions', () => {
      const mockMutations = {
        approve: { mutate: vi.fn() },
        reject: { mutate: vi.fn() },
      } as any

      const { result } = renderHook(() => useMessageActions())

      const approveHandler = result.current.createHandler('approve', mockMutations.approve)
      const rejectHandler = result.current.createHandler('reject', mockMutations.reject)

      // Add two pending actions
      act(() => {
        approveHandler('message-1')
        rejectHandler('message-2')
      })

      expect(result.current.pendingActions).toEqual({
        'message-1': 'approve',
        'message-2': 'reject',
      })

      // Simulate first mutation settling
      act(() => {
        const approveCall = mockMutations.approve.mutate.mock.calls[0]
        approveCall[1].onSettled()
      })

      expect(result.current.pendingActions).toEqual({
        'message-2': 'reject',
      })
    })
  })
})
