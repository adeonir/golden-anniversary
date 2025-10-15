'use server'

import { count, desc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '~/lib/database/client'
import type { Message as DbMessage } from '~/lib/database/schema'
import { messages } from '~/lib/database/schema'
import type { CreateMessageData } from '~/schemas/messages'
import { createMessageSchema } from '~/schemas/messages'
import type { Message } from '~/types/messages'

function mapMessageDates(msg: DbMessage): Message {
  return {
    ...msg,
    createdAt: new Date(msg.createdAt),
    approvedAt: msg.approvedAt ? new Date(msg.approvedAt) : null,
    rejectedAt: msg.rejectedAt ? new Date(msg.rejectedAt) : null,
  }
}

export async function fetchMessages(
  page = 1,
  limit = 5,
  status?: 'approved' | 'pending' | 'rejected',
): Promise<{ messages: Message[]; total: number; totalPages: number }> {
  try {
    const offset = (page - 1) * limit

    const whereCondition = status ? eq(messages.status, status) : undefined

    const [messagesList, [{ total }]] = await Promise.all([
      db.select().from(messages).where(whereCondition).orderBy(desc(messages.createdAt)).limit(limit).offset(offset),
      db.select({ total: count() }).from(messages).where(whereCondition),
    ])

    const totalPages = Math.ceil(total / limit)

    return {
      messages: messagesList.map(mapMessageDates),
      total,
      totalPages,
    }
  } catch (error) {
    throw new Error(`Failed to fetch messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createMessage(data: CreateMessageData): Promise<Message> {
  try {
    const validatedData = createMessageSchema.parse(data)

    const [newMessage] = await db.insert(messages).values(validatedData).returning()

    if (!newMessage) {
      throw new Error('Failed to create message')
    }

    revalidatePath('/')
    return mapMessageDates(newMessage)
  } catch (error) {
    throw new Error(`Failed to create message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function approveMessage(id: string): Promise<Message> {
  try {
    const [updatedMessage] = await db
      .update(messages)
      .set({ status: 'approved', approvedAt: new Date(), rejectedAt: null })
      .where(eq(messages.id, id))
      .returning()

    if (!updatedMessage) {
      throw new Error('Failed to approve message')
    }

    revalidatePath('/admin?tab=messages')
    return mapMessageDates(updatedMessage)
  } catch (error) {
    throw new Error(`Failed to approve message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function rejectMessage(id: string): Promise<Message> {
  try {
    const [updatedMessage] = await db
      .update(messages)
      .set({ status: 'rejected', rejectedAt: new Date(), approvedAt: null })
      .where(eq(messages.id, id))
      .returning()

    if (!updatedMessage) {
      throw new Error('Failed to reject message')
    }

    revalidatePath('/admin?tab=messages')
    return mapMessageDates(updatedMessage)
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

export async function batchApproveMessages(ids: string[]): Promise<Message[]> {
  try {
    const results = await Promise.allSettled(ids.map((id) => approveMessage(id)))

    const successfulMessages = results
      .filter((result): result is PromiseFulfilledResult<Message> => result.status === 'fulfilled')
      .map((result) => result.value)

    return successfulMessages
  } catch (error) {
    throw new Error(`Failed to batch approve messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function batchRejectMessages(ids: string[]): Promise<Message[]> {
  try {
    const results = await Promise.allSettled(ids.map((id) => rejectMessage(id)))

    const successfulMessages = results
      .filter((result): result is PromiseFulfilledResult<Message> => result.status === 'fulfilled')
      .map((result) => result.value)

    return successfulMessages
  } catch (error) {
    throw new Error(`Failed to batch reject messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function batchDeleteMessages(ids: string[]): Promise<string[]> {
  try {
    const results = await Promise.allSettled(ids.map((id) => deleteMessage(id)))

    const successfulIds = results
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map((result) => result.value)

    return successfulIds
  } catch (error) {
    throw new Error(`Failed to batch delete messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
