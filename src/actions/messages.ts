'use server'

import { count, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '~/lib/database/client'
import { messages } from '~/lib/database/schema'
import type { CreateMessageData, Message } from '~/types/messages'

export async function fetchMessages(
  page = 1,
  limit = 5,
  status?: 'approved' | 'pending' | 'rejected',
): Promise<{ messages: Message[]; total: number; totalPages: number }> {
  try {
    const offset = (page - 1) * limit

    const whereCondition = status ? eq(messages.status, status) : undefined

    const [messagesList, [{ total }]] = await Promise.all([
      db.select().from(messages).where(whereCondition).orderBy(messages.createdAt).limit(limit).offset(offset),
      db.select({ total: count() }).from(messages).where(whereCondition),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      messages: messagesList.map((msg) => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      })),
      total,
      totalPages,
    }
  } catch (error) {
    throw new Error(`Failed to fetch messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createMessage(data: CreateMessageData): Promise<Message> {
  try {
    const [newMessage] = await db.insert(messages).values(data).returning()

    if (!newMessage) {
      throw new Error('Failed to create message')
    }

    revalidatePath('/')
    return {
      ...newMessage,
      createdAt: new Date(newMessage.createdAt),
    }
  } catch (error) {
    throw new Error(`Failed to create message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function approveMessage(id: string): Promise<Message> {
  try {
    const [updatedMessage] = await db
      .update(messages)
      .set({ status: 'approved' })
      .where(eq(messages.id, id))
      .returning()

    if (!updatedMessage) {
      throw new Error('Failed to approve message')
    }

    revalidatePath('/admin?tab=messages')
    return {
      ...updatedMessage,
      createdAt: new Date(updatedMessage.createdAt),
    }
  } catch (error) {
    throw new Error(`Failed to approve message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function rejectMessage(id: string): Promise<Message> {
  try {
    const [updatedMessage] = await db
      .update(messages)
      .set({ status: 'rejected' })
      .where(eq(messages.id, id))
      .returning()

    if (!updatedMessage) {
      throw new Error('Failed to reject message')
    }

    revalidatePath('/admin?tab=messages')
    return {
      ...updatedMessage,
      createdAt: new Date(updatedMessage.createdAt),
    }
  } catch (error) {
    throw new Error(`Failed to reject message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deleteMessage(id: string): Promise<string> {
  try {
    await db.delete(messages).where(eq(messages.id, id))

    revalidatePath('/')
    return id
  } catch (error) {
    throw new Error(`Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
