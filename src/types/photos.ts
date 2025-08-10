export type Category = 'memory' | 'event'

export interface Photo {
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

export interface CreatePhotoData {
  filename: string
  title?: string
  url: string
  fileId: string
  size: number
  category?: Category
}
