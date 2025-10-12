export type CreateMessageData = {
  name: string
  message: string
}

export type Message = {
  id: string
  name: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}
