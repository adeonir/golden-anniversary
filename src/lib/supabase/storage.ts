import { env } from '~/env'
import { config } from '~/lib/config'
import { createClient } from './server'

export function getPhotoUrl(filename: string): string {
  const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL
  return `${baseUrl}/storage/v1/object/public/${config.storage.bucketName}/${filename}`
}

export async function getUploadUrl(filename: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from(config.storage.bucketName).createSignedUploadUrl(filename)

  if (error) {
    throw new Error(`Failed to create upload URL: ${error.message}`)
  }

  return data
}

export async function listPhotos() {
  const supabase = await createClient()

  const { data, error } = await supabase.storage.from(config.storage.bucketName).list('', {
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

  const { error } = await supabase.storage.from(config.storage.bucketName).remove([filename])

  if (error) {
    throw new Error(`Failed to delete photo: ${error.message}`)
  }

  return { success: true }
}

export function validatePhotoFile(file: File): { valid: boolean; error?: string } {
  if (!config.storage.allowedTypes.includes(file.type as 'image/jpeg')) {
    return {
      valid: false,
      error: 'Apenas arquivos JPG são permitidos',
    }
  }

  if (file.size > config.storage.maxFileSize) {
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
