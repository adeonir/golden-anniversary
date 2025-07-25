'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { CreateMessageData, Message } from '~/types/messages'

export async function fetchMessages(
  page = 1,
  limit = 5,
  status?: 'approved' | 'pending' | 'rejected',
): Promise<{ messages: Message[]; total: number; totalPages: number }> {
  try {
    const supabase = await createClient()
    const offset = (page - 1) * limit

    let query = supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .order('createdAt', { ascending: true })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: messagesList, count, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    const total = count || 0
    const totalPages = Math.ceil(total / limit)

    return {
      messages:
        messagesList?.map((msg) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        })) || [],
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
    const supabase = await createClient()
    const { data, error } = await supabase.from('messages').select('*').eq('id', id).single()

    if (error) {
      throw new Error(error.message)
    }

    if (!data) return null

    return {
      ...data,
      createdAt: new Date(data.createdAt),
    }
  } catch (error) {
    throw new Error(`Failed to fetch message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function createMessage(data: CreateMessageData): Promise<Message> {
  try {
    const supabase = await createClient()
    const { data: newMessage, error } = await supabase.from('messages').insert(data).select().single()

    if (error) {
      throw new Error(error.message)
    }

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

export async function deleteMessage(id: string): Promise<string> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('messages').delete().eq('id', id)

    if (error) {
      throw new Error(error.message)
    }

    revalidatePath('/')
    return id
  } catch (error) {
    throw new Error(`Failed to delete message: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
