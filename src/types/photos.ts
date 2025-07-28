export interface Photo {
  id: string
  filename: string
  originalName: string
  url: string
  size: number
  order: number
  createdAt: Date
}

export interface CreatePhotoData {
  filename: string
  originalName: string
  url: string
  size: number
}
