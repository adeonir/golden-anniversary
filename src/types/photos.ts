export type Category = 'memory' | 'event'

export type Photo = {
  id: string
  filename: string
  title?: string | null
  url: string
  fileId: string
  size: number
  order: number
  category: Category
  createdAt: Date
}

export type CreatePhotoData = {
  filename: string
  title?: string
  url: string
  fileId: string
  size: number
  category?: Category
}
