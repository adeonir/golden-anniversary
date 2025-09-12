import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CreateMessageData } from '~/types/messages'
import { testDb } from '~tests/mocks/database'
import { cleanTestDatabase, createTestMessage, initializeTestDatabase } from '~tests/utils/database'
import { approveMessage, createMessage, deleteMessage, fetchMessages, rejectMessage } from './messages'

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('~/lib/database/client', () => ({
  db: testDb,
}))

describe('Messages Server Actions Integration Tests', () => {
  beforeEach(async () => {
    await initializeTestDatabase()
    await cleanTestDatabase()
  })

  describe('createMessage', () => {
    it('should create a new message with pending status', async () => {
      const messageData: CreateMessageData = {
        name: 'João Silva',
        message: 'Parabéns pelo casamento!',
      }

      const result = await createMessage(messageData)

      expect(result).toBeDefined()
      expect(result.id).toBeDefined()
      expect(result.name).toBe(messageData.name)
      expect(result.message).toBe(messageData.message)
      expect(result.status).toBe('pending')
      expect(result.createdAt).toBeInstanceOf(Date)

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/')
    })

    it('should throw error when name is empty', async () => {
      const messageData = {
        name: '',
        message: 'Test message',
      } as CreateMessageData

      await expect(createMessage(messageData)).rejects.toThrow('Failed to create message')
    })

    it('should throw error when message is empty', async () => {
      const messageData = {
        name: 'Test User',
        message: '',
      } as CreateMessageData

      await expect(createMessage(messageData)).rejects.toThrow('Failed to create message')
    })
  })

  describe('fetchMessages', () => {
    beforeEach(async () => {
      // Create test messages with different statuses
      await createTestMessage({
        name: 'User 1',
        message: 'Message 1',
        status: 'approved',
      })
      await createTestMessage({
        name: 'User 2',
        message: 'Message 2',
        status: 'pending',
      })
      await createTestMessage({
        name: 'User 3',
        message: 'Message 3',
        status: 'rejected',
      })
      await createTestMessage({
        name: 'User 4',
        message: 'Message 4',
        status: 'approved',
      })
    })

    it('should fetch all messages with pagination', async () => {
      const result = await fetchMessages(1, 5)

      expect(result).toBeDefined()
      expect(result.messages).toHaveLength(4)
      expect(result.total).toBe(4)
      expect(result.totalPages).toBe(1)
    })

    it('should filter messages by approved status', async () => {
      const result = await fetchMessages(1, 5, 'approved')

      expect(result.messages).toHaveLength(2)
      expect(result.messages.every((msg) => msg.status === 'approved')).toBe(true)
      expect(result.total).toBe(2)
    })

    it('should filter messages by pending status', async () => {
      const result = await fetchMessages(1, 5, 'pending')

      expect(result.messages).toHaveLength(1)
      expect(result.messages[0].status).toBe('pending')
      expect(result.total).toBe(1)
    })

    it('should filter messages by rejected status', async () => {
      const result = await fetchMessages(1, 5, 'rejected')

      expect(result.messages).toHaveLength(1)
      expect(result.messages[0].status).toBe('rejected')
      expect(result.total).toBe(1)
    })

    it('should handle pagination correctly', async () => {
      const result = await fetchMessages(1, 2)

      expect(result.messages).toHaveLength(2)
      expect(result.total).toBe(4)
      expect(result.totalPages).toBe(2)
    })

    it('should return empty results for non-existent page', async () => {
      const result = await fetchMessages(10, 5)

      expect(result.messages).toHaveLength(0)
      expect(result.total).toBe(4)
      expect(result.totalPages).toBe(1)
    })

    it('should return messages with Date objects for createdAt', async () => {
      const result = await fetchMessages(1, 5)

      expect(result.messages.length).toBeGreaterThan(0)
      for (const message of result.messages) {
        expect(message.createdAt).toBeInstanceOf(Date)
      }
    })
  })

  describe('approveMessage', () => {
    it('should approve a pending message', async () => {
      const createdMessage = await createTestMessage({
        name: 'Test User',
        message: 'Test message',
        status: 'pending',
      })

      const result = await approveMessage(createdMessage.id.toString())

      expect(result).toBeDefined()
      expect(result.id).toBe(createdMessage.id)
      expect(result.status).toBe('approved')
      expect(result.createdAt).toBeInstanceOf(Date)

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=messages')
    })

    it('should approve a rejected message', async () => {
      const createdMessage = await createTestMessage({
        name: 'Test User',
        message: 'Test message',
        status: 'rejected',
      })

      const result = await approveMessage(createdMessage.id.toString())

      expect(result.status).toBe('approved')

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=messages')
    })

    it('should throw error when message not found', async () => {
      await expect(approveMessage('99999')).rejects.toThrow('Failed to approve message')
    })

    it('should throw error with invalid id format', async () => {
      await expect(approveMessage('invalid-id')).rejects.toThrow('Failed to approve message')
    })
  })

  describe('rejectMessage', () => {
    it('should reject a pending message', async () => {
      const createdMessage = await createTestMessage({
        name: 'Test User',
        message: 'Test message',
        status: 'pending',
      })

      const result = await rejectMessage(createdMessage.id.toString())

      expect(result).toBeDefined()
      expect(result.id).toBe(createdMessage.id)
      expect(result.status).toBe('rejected')
      expect(result.createdAt).toBeInstanceOf(Date)

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=messages')
    })

    it('should reject an approved message', async () => {
      const createdMessage = await createTestMessage({
        name: 'Test User',
        message: 'Test message',
        status: 'approved',
      })

      const result = await rejectMessage(createdMessage.id.toString())

      expect(result.status).toBe('rejected')

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/admin?tab=messages')
    })

    it('should throw error when message not found', async () => {
      await expect(rejectMessage('99999')).rejects.toThrow('Failed to reject message')
    })

    it('should throw error with invalid id format', async () => {
      await expect(rejectMessage('invalid-id')).rejects.toThrow('Failed to reject message')
    })
  })

  describe('deleteMessage', () => {
    it('should delete an existing message', async () => {
      const createdMessage = await createTestMessage({
        name: 'Test User',
        message: 'Test message to delete',
        status: 'pending',
      })

      const result = await deleteMessage(createdMessage.id.toString())

      expect(result).toBe(createdMessage.id.toString())

      const { revalidatePath } = await import('next/cache')
      expect(revalidatePath).toHaveBeenCalledWith('/')

      // Verify message was deleted by trying to fetch it
      const allMessages = await fetchMessages(1, 10)
      const deletedMessage = allMessages.messages.find((msg) => msg.id === createdMessage.id)
      expect(deletedMessage).toBeUndefined()
    })

    it('should handle deletion of non-existent message gracefully', async () => {
      // This should not throw an error, just return the id
      const result = await deleteMessage('99999')
      expect(result).toBe('99999')
    })

    it('should throw error with invalid id format', async () => {
      // PGlite will throw error when trying to delete with invalid id format
      await expect(deleteMessage('invalid-id')).rejects.toThrow('Failed to delete message')
    })
  })

  describe('End-to-end message workflow', () => {
    it('should handle complete message lifecycle', async () => {
      // 1. Create message
      const messageData: CreateMessageData = {
        name: 'Integration Test User',
        message: 'Complete workflow test message',
      }

      const createdMessage = await createMessage(messageData)
      expect(createdMessage.status).toBe('pending')

      // 2. Fetch pending messages
      const pendingMessages = await fetchMessages(1, 5, 'pending')
      expect(pendingMessages.messages).toHaveLength(1)
      expect(pendingMessages.messages[0].id).toBe(createdMessage.id)

      // 3. Approve message
      const approvedMessage = await approveMessage(createdMessage.id.toString())
      expect(approvedMessage.status).toBe('approved')

      // 4. Fetch approved messages
      const approvedMessages = await fetchMessages(1, 5, 'approved')
      expect(approvedMessages.messages).toHaveLength(1)
      expect(approvedMessages.messages[0].status).toBe('approved')

      // 5. Reject message (change from approved to rejected)
      const rejectedMessage = await rejectMessage(createdMessage.id.toString())
      expect(rejectedMessage.status).toBe('rejected')

      // 6. Fetch rejected messages
      const rejectedMessages = await fetchMessages(1, 5, 'rejected')
      expect(rejectedMessages.messages).toHaveLength(1)

      // 7. Delete message
      await deleteMessage(createdMessage.id.toString())

      // 8. Verify message is deleted
      const allMessages = await fetchMessages(1, 5)
      expect(allMessages.messages).toHaveLength(0)
    })

    it('should maintain data consistency across operations', async () => {
      // Create multiple messages
      const message1 = await createMessage({ name: 'User 1', message: 'Message 1' })
      const message2 = await createMessage({ name: 'User 2', message: 'Message 2' })
      const _message3 = await createMessage({ name: 'User 3', message: 'Message 3' })

      // All should be pending
      const pendingMessages = await fetchMessages(1, 10, 'pending')
      expect(pendingMessages.messages).toHaveLength(3)

      // Approve one
      await approveMessage(message1.id.toString())

      // Reject one
      await rejectMessage(message2.id.toString())

      // Verify counts
      const finalPending = await fetchMessages(1, 10, 'pending')
      const finalApproved = await fetchMessages(1, 10, 'approved')
      const finalRejected = await fetchMessages(1, 10, 'rejected')

      expect(finalPending.messages).toHaveLength(1)
      expect(finalApproved.messages).toHaveLength(1)
      expect(finalRejected.messages).toHaveLength(1)

      // Verify all messages still exist
      const allMessages = await fetchMessages(1, 10)
      expect(allMessages.messages).toHaveLength(3)
    })
  })
})
