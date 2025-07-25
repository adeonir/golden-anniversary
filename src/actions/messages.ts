'use server'

import { count, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { database } from '~/database'
import { messages } from '~/database/schema'
import type { CreateMessageData, Message } from '~/types/messages'

export async function getMessages(options?: {
  status?: 'pending' | 'approved' | 'rejected'
  page?: number
  limit?: number
}): Promise<{ messages: Message[]; total: number; totalPages: number }> {
  try {
    const { status, page = 1, limit = 5 } = options || {}
    const offset = (page - 1) * limit

    let messagesList: Message[]
    let totalResult: { count: number }[]

    if (status) {
      // Separate queries when status is provided
      messagesList = await database
        .select()
        .from(messages)
        .where(eq(messages.status, status))
        .orderBy(desc(messages.createdAt))
        .limit(limit)
        .offset(offset)

      totalResult = await database
        .select({ count: count() })
        .from(messages)
        .where(eq(messages.status, status))
    } else {
      // Separate queries when no status filter
      messagesList = await database
        .select()
        .from(messages)
        .orderBy(desc(messages.createdAt))
        .limit(limit)
        .offset(offset)

      totalResult = await database
        .select({ count: count() })
        .from(messages)
    }

    const total = totalResult[0]?.count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      messages: messagesList,
      total,
      totalPages,
    }
  } catch (error) {
    throw new Error(`Failed to fetch messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getMessage(id: string): Promise<Message | null> {
  if (!id) return null

  try {
    const result = await database.select().from(messages).where(eq(messages.id, id))
    return result[0] || null
  } catch (error) {
    throw new Error(`Failed to fetch message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createMessage(data: CreateMessageData): Promise<Message> {
  try {
    const result = await database.insert(messages).values(data).returning()
    const newMessage = result[0]

    if (!newMessage) {
      throw new Error('Failed to create message')
    }

    revalidatePath('/')
    return newMessage
  } catch (error) {
    throw new Error(`Failed to create message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteMessage(id: string): Promise<string> {
  try {
    await database.delete(messages).where(eq(messages.id, id))
    revalidatePath('/')
    return id
  } catch (error) {
    throw new Error(`Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
