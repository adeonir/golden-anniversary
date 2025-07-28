export interface Photo {
  id: string
  filename: string
  title?: string
  url: string
  size: number
  order: number
  createdAt: Date
}

export interface CreatePhotoData {
  filename: string
  title?: string
  url: string
  size: number
}
