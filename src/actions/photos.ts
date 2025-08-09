'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { Category, CreatePhotoData, Photo } from '~/types/photos'

export async function fetchPhotos(category?: Category): Promise<Photo[]> {
  try {
    const supabase = await createClient()
    let query = supabase.from('photos').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    const { data: photosList, error } = await query.order('order', { ascending: true })

    if (error) {
      throw new Error(error.message)
    }

    return (
      photosList?.map((photo) => ({
        ...photo,
        createdAt: new Date(photo.createdAt),
      })) || []
    )
  } catch (error) {
    throw new Error(`Failed to fetch photos: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export function fetchMemories(): Promise<Photo[]> {
  return fetchPhotos('memory')
}

export async function uploadPhoto(file: File): Promise<Photo> {
  try {
    const supabase = await createClient()

    const filename = `${crypto.randomUUID()}.jpg`
    const filePath = `memories/${filename}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from('photos').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    const { data: urlData } = supabase.storage.from('photos').getPublicUrl(uploadData.path)

    const photoData: CreatePhotoData = {
      filename,
      title: file.name,
      url: urlData.publicUrl,
      size: file.size,
      category: 'memory',
    }

    const { data: newPhoto, error: dbError } = await supabase.from('photos').insert(photoData).select().single()

    if (dbError) {
      await supabase.storage.from('photos').remove([uploadData.path])
      throw new Error(`Database error: ${dbError.message}`)
    }

    if (!newPhoto) {
      await supabase.storage.from('photos').remove([uploadData.path])
      throw new Error('Failed to save photo metadata')
    }

    revalidatePath('/admin')
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
    const supabase = await createClient()

    const { data: updatedPhoto, error: updateError } = await supabase
      .from('photos')
      .update({ title })
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      throw new Error(`Failed to update photo: ${updateError.message}`)
    }

    if (!updatedPhoto) {
      throw new Error('Photo not found')
    }

    revalidatePath('/admin')
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
    const supabase = await createClient()

    const updatePromises = photoIds.map((id, index) =>
      supabase
        .from('photos')
        .update({ order: index })
        .eq('id', id)
        .then(({ error }) => {
          if (error) {
            throw new Error(`Failed to update photo ${id}: ${error.message}`)
          }
        }),
    )

    await Promise.all(updatePromises)

    revalidatePath('/admin')
  } catch (error) {
    throw new Error(`Failed to reorder photos: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function deletePhoto(id: string): Promise<string> {
  try {
    const supabase = await createClient()

    const { data: photo, error: fetchError } = await supabase.from('photos').select('filename').eq('id', id).single()

    if (fetchError || !photo) {
      throw new Error('Photo not found')
    }

    const { error: storageError } = await supabase.storage.from('photos').remove([`memories/${photo.filename}`])

    if (storageError) {
      throw new Error(`Failed to delete file: ${storageError.message}`)
    }

    const { error: dbError } = await supabase.from('photos').delete().eq('id', id)

    if (dbError) {
      throw new Error(`Failed to delete photo record: ${dbError.message}`)
    }

    revalidatePath('/admin')
    return id
  } catch (error) {
    throw new Error(`Failed to delete photo: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
