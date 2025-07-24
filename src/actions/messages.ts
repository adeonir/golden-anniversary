'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '~/database'
import { messages } from '~/database/schema'
import type { CreateMessageData, Message } from '~/types/messages'

export async function getMessages(): Promise<Message[]> {
  try {
    return await db.select().from(messages).orderBy(messages.createdAt)
  } catch (error) {
    throw new Error(`Failed to fetch messages: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function getMessage(id: string): Promise<Message | null> {
  if (!id) return null

  try {
    const result = await db.select().from(messages).where(eq(messages.id, id))
    return result[0] || null
  } catch (error) {
    throw new Error(`Failed to fetch message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createMessage(data: CreateMessageData): Promise<Message> {
  try {
    const result = await db.insert(messages).values(data).returning()
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
    await db.delete(messages).where(eq(messages.id, id))
    revalidatePath('/')
    return id
  } catch (error) {
    throw new Error(`Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
