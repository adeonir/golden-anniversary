import { useMemo, useState } from 'react'
import type { Message } from '~/types/messages'

type MessageFilter = 'all' | 'pending' | 'approved' | 'rejected'

interface UseMessagesFilterOptions {
  messages: Message[]
}

export function useMessagesFilters({ messages }: UseMessagesFilterOptions) {
  const [filter, setFilter] = useState<MessageFilter>('all')

  const { filteredMessages, pendingCount } = useMemo(() => {
    const pendingMsgs = messages.filter((msg) => msg.status === 'pending').length

    const filtered = messages.filter((message) => {
      if (filter === 'all') return true
      return message.status === filter
    })

    return { filteredMessages: filtered, pendingCount: pendingMsgs }
  }, [messages, filter])

  return {
    filter,
    setFilter,
    filteredMessages,
    pendingCount,
  }
}
