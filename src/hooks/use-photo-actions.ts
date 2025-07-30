import { useState } from 'react'
import type { Photo } from '~/types/photos'

export function usePhotoActions() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [localPhotos, setLocalPhotos] = useState<Photo[]>([])
  const [reorderingPhotoId, setReorderingPhotoId] = useState<string | null>(null)

  const handleEditStart = (photo: Photo) => {
    setEditingId(photo.id)
    setEditTitle(photo.title || '')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const resetEditState = () => {
    setEditingId(null)
    setEditTitle('')
  }

  return {
    // States
    modalOpen,
    editingId,
    editTitle,
    activeId,
    localPhotos,
    reorderingPhotoId,

    // Setters
    setModalOpen,
    setEditTitle,
    setActiveId,
    setLocalPhotos,
    setReorderingPhotoId,

    // Handlers
    handleEditStart,
    handleEditCancel,
    resetEditState,
  }
}
