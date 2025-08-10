'use server'

import { asc, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { db } from '~/lib/database/client'
import { photos } from '~/lib/database/schema'
import { deleteImage, uploadImage } from '~/lib/images/client'
import type { Category, CreatePhotoData, Photo } from '~/types/photos'

export async function fetchPhotos(category?: Category): Promise<Photo[]> {
  try {
    const whereCondition = category ? eq(photos.category, category) : undefined

    const photosList = await db.select().from(photos).where(whereCondition).orderBy(asc(photos.order))

    return photosList.map((photo) => ({
      ...photo,
      createdAt: new Date(photo.createdAt),
    }))
  } catch (error) {
    throw new Error(`Failed to fetch photos: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function fetchMemories(): Promise<Photo[]> {
  return await fetchPhotos('memory')
}

export async function uploadPhoto(file: File): Promise<Photo> {
  try {
    const uploadResult = await uploadImage(file, 'memories')

    const photoData: CreatePhotoData = {
      filename: uploadResult.name,
      title: file.name,
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      size: uploadResult.size,
      category: 'memory',
    }

    const [newPhoto] = await db.insert(photos).values(photoData).returning()

    if (!newPhoto) {
      await deleteImage(uploadResult.fileId)
      throw new Error('Failed to save photo metadata')
    }

    revalidatePath('/admin?tab=memories')
    return {
      ...newPhoto,
      createdAt: new Date(newPhoto.createdAt),
    }
  } catch (error) {
    throw new Error(`Failed to upload photo: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function updatePhoto(id: string, title: string): Promise<Photo> {
  try {
    const [updatedPhoto] = await db.update(photos).set({ title }).where(eq(photos.id, id)).returning()

    if (!updatedPhoto) {
      throw new Error('Photo not found')
    }

    revalidatePath('/admin?tab=memories')
    return {
      ...updatedPhoto,
      createdAt: new Date(updatedPhoto.createdAt),
    }
  } catch (error) {
    throw new Error(`Failed to update photo: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function reorderPhotos(photoIds: string[]): Promise<void> {
  try {
    const updatePromises = photoIds.map((id, index) => db.update(photos).set({ order: index }).where(eq(photos.id, id)))

    await Promise.all(updatePromises)

    revalidatePath('/admin?tab=memories')
  } catch (error) {
    throw new Error(`Failed to reorder photos: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deletePhoto(id: string): Promise<string> {
  try {
    const [photo] = await db.select({ fileId: photos.fileId }).from(photos).where(eq(photos.id, id))

    if (!photo) {
      throw new Error('Photo not found')
    }

    await deleteImage(photo.fileId)

    await db.delete(photos).where(eq(photos.id, id))

    revalidatePath('/admin?tab=memories')
    return id
  } catch (error) {
    throw new Error(`Failed to delete photo: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
