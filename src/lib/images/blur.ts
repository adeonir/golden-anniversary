import { getPlaiceholder } from 'plaiceholder'
import { getOptimizedImageUrl } from './client'

export type BlurData = {
  blurDataURL: string
  width: number
  height: number
}

export async function generateBlurDataURL(imageUrl: string): Promise<BlurData> {
  try {
    // Get a low quality version for blur placeholder
    const lowQualityUrl = getOptimizedImageUrl(imageUrl, 40, undefined, 10)

    const buffer = await fetch(lowQualityUrl).then(async (res) => Buffer.from(await res.arrayBuffer()))

    const { base64, metadata } = await getPlaiceholder(buffer, { size: 10 })

    return {
      blurDataURL: base64,
      width: metadata.width,
      height: metadata.height,
    }
  } catch {
    // Fallback blur placeholder if generation fails
    return {
      blurDataURL:
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=',
      width: 800,
      height: 600,
    }
  }
}

export async function generateBlurFromFilePath(filePath: string): Promise<BlurData> {
  const imageUrl = getOptimizedImageUrl(filePath)
  return await generateBlurDataURL(imageUrl)
}
