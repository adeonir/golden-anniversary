import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { testDb } from '~tests/mocks/database'
import { cleanTestDatabase, createTestMessage, initializeTestDatabase } from '~tests/utils/database'
import { useApproveMessage, useCreateMessage, useDeleteMessage, useMessages, useRejectMessage } from './use-messages'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('~/lib/database/client', () => ({
  db: testDb,
}))

vi.mock('~/hooks/use-toast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

vi.mock('~/lib/config', () => ({
  config: {
    pagination: {
      defaultPage: 1,
      frontendPageSize: 10,
    },
  },
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

describe('Messages React Query Hooks Integration Tests', () => {
  beforeEach(async () => {
    await initializeTestDatabase()
    await cleanTestDatabase()

    vi.clearAllMocks()
  })

  describe('useMessages', () => {
    it('should fetch messages successfully', async () => {
      await createTestMessage({
        name: 'João Silva',
        message: 'Parabéns pelo casamento!',
        status: 'approved',
      })
      await createTestMessage({
        name: 'Maria Santos',
        message: 'Felicidades!',
        status: 'pending',
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useMessages(1, 10), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.messages).toHaveLength(2)
      expect(result.current.data?.total).toBe(2)
    })

    it('should fetch messages with status filter', async () => {
      await createTestMessage({
        name: 'User 1',
        message: 'Approved message',
        status: 'approved',
      })
      await createTestMessage({
        name: 'User 2',
        message: 'Pending message',
        status: 'pending',
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useMessages(1, 10, 'approved'), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.messages).toHaveLength(1)
      expect(result.current.data?.messages[0].status).toBe('approved')
    })

    it('should handle empty results', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useMessages(1, 10), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.messages).toHaveLength(0)
      expect(result.current.data?.total).toBe(0)
    })

    it('should handle pagination', async () => {
      await Promise.all([
        createTestMessage({ name: 'User 0', message: 'Message 0', status: 'approved' }),
        createTestMessage({ name: 'User 1', message: 'Message 1', status: 'approved' }),
        createTestMessage({ name: 'User 2', message: 'Message 2', status: 'approved' }),
      ])

      const wrapper = createWrapper()
      const { result } = renderHook(() => useMessages(1, 2), { wrapper })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.messages).toHaveLength(2)
      expect(result.current.data?.total).toBe(3)
      expect(result.current.data?.totalPages).toBe(2)
    })

    it('should handle server error', async () => {
      const originalSelect = testDb.select
      const mockSelect = vi.fn().mockImplementation(() => {
        throw new Error('Database error')
      })
      testDb.select = mockSelect as unknown as typeof testDb.select

      const wrapper = createWrapper()
      const { result } = renderHook(() => useMessages(1, 10), { wrapper })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()

      testDb.select = originalSelect
    })
  })

  describe('useCreateMessage', () => {
    it('should create message and invalidate cache', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useCreateMessage(), { wrapper })

      await act(() => {
        result.current.mutate({
          name: 'Test User',
          message: 'Test message',
        })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBeDefined()
      expect(result.current.data?.name).toBe('Test User')
      expect(result.current.data?.message).toBe('Test message')
      expect(result.current.data?.status).toBe('pending')
    })

    it('should handle creation error', async () => {
      const originalInsert = testDb.insert
      const mockInsert = vi.fn().mockImplementation(() => {
        throw new Error('Creation failed')
      })
      testDb.insert = mockInsert as unknown as typeof testDb.insert

      const wrapper = createWrapper()
      const { result } = renderHook(() => useCreateMessage(), { wrapper })

      await act(() => {
        result.current.mutate({
          name: 'Test User',
          message: 'Test message',
        })
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()

      testDb.insert = originalInsert
    })
  })

  describe('useApproveMessage', () => {
    it('should approve message and invalidate cache', async () => {
      const message = await createTestMessage({
        name: 'Test User',
        message: 'Test message',
        status: 'pending',
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useApproveMessage(), { wrapper })

      await act(() => {
        result.current.mutate(message.id.toString())
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.status).toBe('approved')
    })

    it('should handle approve error', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useApproveMessage(), { wrapper })

      await act(() => {
        result.current.mutate('999999')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('useRejectMessage', () => {
    it('should reject message and invalidate cache', async () => {
      const message = await createTestMessage({
        name: 'Test User',
        message: 'Test message',
        status: 'pending',
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useRejectMessage(), { wrapper })

      await act(() => {
        result.current.mutate(message.id.toString())
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data?.status).toBe('rejected')
    })

    it('should handle reject error', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useRejectMessage(), { wrapper })

      await act(() => {
        result.current.mutate('999999')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('useDeleteMessage', () => {
    it('should delete message and invalidate cache', async () => {
      const message = await createTestMessage({
        name: 'Test User',
        message: 'Test message to delete',
        status: 'pending',
      })

      const wrapper = createWrapper()
      const { result } = renderHook(() => useDeleteMessage(), { wrapper })

      await act(() => {
        result.current.mutate(message.id.toString())
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.data).toBe(message.id.toString())
    })

    it('should handle delete error when message not found', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useDeleteMessage(), { wrapper })

      await act(() => {
        result.current.mutate('invalid-id')
      })

      await waitFor(() => {
        expect(result.current.isError).toBe(true)
      })

      expect(result.current.error).toBeDefined()
    })
  })

  describe('React Query integration features', () => {
    it('should handle multiple concurrent mutations', async () => {
      const message1 = await createTestMessage({
        name: 'User 1',
        message: 'Message 1',
        status: 'pending',
      })
      const message2 = await createTestMessage({
        name: 'User 2',
        message: 'Message 2',
        status: 'pending',
      })

      const wrapper = createWrapper()
      const { result: approveResult } = renderHook(() => useApproveMessage(), { wrapper })
      const { result: rejectResult } = renderHook(() => useRejectMessage(), { wrapper })

      await act(() => {
        approveResult.current.mutate(message1.id.toString())
        rejectResult.current.mutate(message2.id.toString())
      })

      await waitFor(() => {
        expect(approveResult.current.isSuccess).toBe(true)
        expect(rejectResult.current.isSuccess).toBe(true)
      })

      expect(approveResult.current.data?.status).toBe('approved')
      expect(rejectResult.current.data?.status).toBe('rejected')
    })

    it('should properly handle cache invalidation', async () => {
      await createTestMessage({
        name: 'Initial User',
        message: 'Initial message',
        status: 'approved',
      })

      const wrapper = createWrapper()
      const { result: queryResult } = renderHook(() => useMessages(1, 10), { wrapper })
      const { result: createResult } = renderHook(() => useCreateMessage(), { wrapper })

      await waitFor(() => {
        expect(queryResult.current.isSuccess).toBe(true)
      })

      expect(queryResult.current.data?.messages).toHaveLength(1)

      await act(() => {
        createResult.current.mutate({
          name: 'New User',
          message: 'New message',
        })
      })

      await waitFor(() => {
        expect(createResult.current.isSuccess).toBe(true)
      })

      await waitFor(() => {
        expect(queryResult.current.data?.messages).toHaveLength(2)
      })
    })

    it('should maintain loading states correctly', async () => {
      const wrapper = createWrapper()
      const { result } = renderHook(() => useCreateMessage(), { wrapper })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
      expect(result.current.isSuccess).toBe(false)

      await act(() => {
        result.current.mutate({
          name: 'Loading Test',
          message: 'Testing loading states',
        })
      })

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(result.current.isPending).toBe(false)
      expect(result.current.isError).toBe(false)
    })

    it('should handle optimistic updates workflow', async () => {
      // Create test message
      const message = await createTestMessage({
        name: 'Test User',
        message: 'Test message',
        status: 'pending',
      })

      const wrapper = createWrapper()
      const { result: queryResult } = renderHook(() => useMessages(1, 10, 'pending'), { wrapper })
      const { result: approveResult } = renderHook(() => useApproveMessage(), { wrapper })

      // Wait for initial query
      await waitFor(() => {
        expect(queryResult.current.isSuccess).toBe(true)
      })

      expect(queryResult.current.data?.messages).toHaveLength(1)

      // Approve message
      await act(() => {
        approveResult.current.mutate(message.id.toString())
      })

      await waitFor(() => {
        expect(approveResult.current.isSuccess).toBe(true)
      })

      // Query for pending messages should now be empty after cache invalidation
      await waitFor(() => {
        expect(queryResult.current.data?.messages).toHaveLength(0)
      })
    })
  })
})
