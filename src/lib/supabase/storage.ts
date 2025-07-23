import { env } from '~/env'
import { createClient } from './server'

export const STORAGE_CONFIG = {
  BUCKET_NAME: 'photos',
  MAX_FILE_SIZE: 1_048_576, // 1MB
  ALLOWED_TYPES: ['image/jpeg'],
  MAX_DIMENSION: 1000, // pixels
} as const

export function getPhotoUrl(filename: string): string {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  return `${baseUrl}/storage/v1/object/public/${STORAGE_CONFIG.BUCKET_NAME}/${filename}`
}

export async function getUploadUrl(filename: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from(STORAGE_CONFIG.BUCKET_NAME).createSignedUploadUrl(filename)

  if (error) {
    throw new Error(`Failed to create upload URL: ${error.message}`)
  }

  return data
}

export async function listPhotos() {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from(STORAGE_CONFIG.BUCKET_NAME).list('', {
    limit: 100,
    sortBy: { column: 'name', order: 'asc' },
  })

  if (error) {
    throw new Error(`Failed to list photos: ${error.message}`)
  }

  return data
}

export async function deletePhoto(filename: string) {
  const supabase = await createClient()

  const { error } = await supabase.storage.from(STORAGE_CONFIG.BUCKET_NAME).remove([filename])

  if (error) {
    throw new Error(`Failed to delete photo: ${error.message}`)
  }

  return { success: true }
}

export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  if (!STORAGE_CONFIG.ALLOWED_TYPES.includes(file.type as 'image/jpeg')) {
    return {
      valid: false,
      error: 'Apenas arquivos JPG são permitidos',
    }
  }

  if (file.size > STORAGE_CONFIG.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'Arquivo deve ter no máximo 1MB',
    }
  }

  return { valid: true }
}

export function generatePhotoFilename(originalName: string): string {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
  const baseName = originalName
    .split('.')[0]
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .substring(0, 20)

  return `${timestamp}-${baseName}.${extension}`
}
