import ImageKit from 'imagekit'
import { env } from '~/env'

export const imagekit = new ImageKit({
  privateKey: env.IMAGEKIT_PRIVATE_KEY,
  publicKey: env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
})

export interface UploadResult {
  fileId: string
  name: string
  size: number
  filePath: string
  url: string
  thumbnailUrl: string
  fileType: string
}

export async function uploadImage(file: File, folder = 'memories'): Promise<UploadResult> {
  try {
    const filename = `${crypto.randomUUID()}.jpg`

    const buffer = Buffer.from(await file.arrayBuffer())

    const result = await imagekit.upload({
      file: buffer,
      fileName: filename,
      folder: `/${folder}`,
      useUniqueFileName: false,
    })

    return {
      fileId: result.fileId,
      name: result.name,
      size: result.size,
      filePath: result.filePath,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl || result.url,
      fileType: result.fileType,
    }
  } catch (error) {
    throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function getImageUrl(filePath: string, transformations?: string[]): string {
  const baseUrl = env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
  const transformationString = transformations ? transformations.join(',') : ''

  if (transformationString) {
    return `${baseUrl}/tr:${transformationString}${filePath}`
  }

  return `${baseUrl}${filePath}`
}

export function getOptimizedImageUrl(filePath: string, width?: number, height?: number, quality = 80): string {
  const transformations: string[] = []

  if (width) transformations.push(`w-${width}`)
  if (height) transformations.push(`h-${height}`)
  transformations.push(`q-${quality}`)
  transformations.push('f-auto') // Auto format

  return getImageUrl(filePath, transformations)
}

export async function deleteImage(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId)
  } catch (error) {
    throw new Error(`Failed to delete image: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
