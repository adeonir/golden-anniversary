'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/lib/supabase/server'
import type { CreatePhotoData, Photo } from '~/types/photos'

export async function fetchPhotos(): Promise<Photo[]> {
  try {
    const supabase = await createClient()
    const { data: photosList, error } = await supabase
      .from('photos')
      .select('*')
      .order('createdAt', { ascending: false })

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

export async function uploadPhoto(file: File): Promise<Photo> {
  try {
    const supabase = await createClient()

    const filename = `${crypto.randomUUID()}.jpg`
    const filePath = `gallery/${filename}`

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
      originalName: file.name,
      url: urlData.publicUrl,
      size: file.size,
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

export async function updatePhoto(id: string, originalName: string): Promise<Photo> {
  try {
    const supabase = await createClient()

    const { data: updatedPhoto, error: updateError } = await supabase
      .from('photos')
      .update({ originalName })
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

    const updates = photoIds.map((id, index) => ({
      id,
      order: index,
    }))

    const { error } = await supabase.from('photos').upsert(updates, {
      onConflict: 'id',
    })

    if (error) {
      throw new Error(`Failed to reorder photos: ${error.message}`)
    }

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

    const { error: storageError } = await supabase.storage.from('photos').remove([`gallery/${photo.filename}`])

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
