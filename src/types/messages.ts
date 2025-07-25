export interface CreateMessageData {
  name: string
  message: string
}

export interface Message {
  id: string
  name: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: Date
}
