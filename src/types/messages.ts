import type { Message as DbMessage } from '~/lib/database/schema'

export type CreateMessageData = {
  name: string
  message: string
}

export type Message = Omit<DbMessage, 'createdAt' | 'approvedAt' | 'rejectedAt'> & {
  createdAt: Date
  approvedAt: Date | null
  rejectedAt: Date | null
}
