'use client'

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Upload } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { Button } from '~/components/ui/button'
import { useDataState } from '~/hooks/use-data-state'
import { usePhotoActions } from '~/hooks/use-photo-actions'
import { useDeletePhoto, useMemories, useReorderPhotos, useUpdatePhoto } from '~/hooks/use-photos'
import type { Photo } from '~/types/photos'
import { MemoryCard, type MemoryCardProps } from './memory-card'
import { UploadsModal } from './uploads-modal'

export function MemoriesTab() {
  const { data: photos = [], isLoading, error } = useMemories()

  const updatePhotoMutation = useUpdatePhoto()
  const deletePhotoMutation = useDeletePhoto()
  const reorderPhotosMutation = useReorderPhotos()

  const {
    modalOpen,
    editingId,
    editTitle,
    activeId,
    localPhotos,
    reorderingPhotoId,
    setModalOpen,
    setEditTitle,
    setActiveId,
    setLocalPhotos,
    setReorderingPhotoId,
    handleEditStart,
    handleEditCancel,
    resetEditState,
  } = usePhotoActions()

  useEffect(() => {
    if (photos.length > 0) {
      setLocalPhotos(photos)
    }
  }, [photos, setLocalPhotos])

  const debouncedReorder = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (photoIds: string[], movedPhotoId: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        setReorderingPhotoId(movedPhotoId)
        reorderPhotosMutation.mutate(photoIds, {
          onSuccess: () => setReorderingPhotoId(null),
          onError: () => setReorderingPhotoId(null),
        })
      }, 300)
    }
  }, [reorderPhotosMutation, setReorderingPhotoId])

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const dataStateAlert = useDataState({
    data: localPhotos,
    isLoading,
    error,
    loadingText: 'Carregando fotos...',
    errorText: 'Erro ao carregar fotos. Tente novamente.',
    emptyText: 'Nenhuma foto encontrada.',
  })

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      updatePhotoMutation.mutate(
        { id: editingId, title: editTitle.trim() },
        {
          onSuccess: resetEditState,
        },
      )
    }
  }

  const handleDelete = (photoId: string) => {
    deletePhotoMutation.mutate(photoId)
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const newPhotos = [...localPhotos]
      const oldIndex = newPhotos.findIndex((photo) => photo.id === active.id)
      const newIndex = newPhotos.findIndex((photo) => photo.id === over.id)

      const reorderedPhotos = arrayMove(newPhotos, oldIndex, newIndex)
      setLocalPhotos(reorderedPhotos)

      const photoIds = reorderedPhotos.map((photo) => photo.id)
      debouncedReorder(photoIds, active.id as string)
    }

    setActiveId(null)
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex flex-shrink-0 items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl text-zinc-900">Memórias</h2>
          <p className="text-zinc-600">Gerencie as fotos das memórias do casal</p>
        </div>
        <Button className="flex items-center gap-2" intent="admin" onClick={() => setModalOpen(true)}>
          <Upload />
          Fazer Upload
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pr-2">
        {dataStateAlert && <div className="flex items-center justify-center py-8">{dataStateAlert}</div>}

        {!dataStateAlert && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
          >
            <SortableContext items={localPhotos.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="space-y-2">
                {localPhotos.map((photo) => (
                  <SortableMemoryCard
                    editTitle={editTitle}
                    isDeleting={deletePhotoMutation.isPending && deletePhotoMutation.variables === photo.id}
                    isEditing={editingId === photo.id}
                    isReordering={reorderingPhotoId === photo.id}
                    isSaving={updatePhotoMutation.isPending && editingId === photo.id}
                    key={photo.id}
                    onDelete={() => handleDelete(photo.id)}
                    onEditCancel={handleEditCancel}
                    onEditSave={handleEditSave}
                    onEditStart={() => handleEditStart(photo)}
                    onEditTitleChange={setEditTitle}
                    photo={photo}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="flex items-center gap-4 rounded-lg border border-zinc-200 bg-white p-4 shadow-lg">
                  <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100">
                    <Image
                      alt="Foto"
                      className="size-full object-cover"
                      fill
                      src={localPhotos.find((p) => p.id === activeId)?.url || ''}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-zinc-900">
                      {localPhotos.find((p) => p.id === activeId)?.title || 'Sem título'}
                    </p>
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>

      <UploadsModal onOpenChange={setModalOpen} open={modalOpen} />
    </div>
  )
}

interface SortableMemoryCardProps extends MemoryCardProps {
  photo: Photo
}

function SortableMemoryCard(props: SortableMemoryCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.photo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className={isDragging ? 'opacity-50' : ''} ref={setNodeRef} style={style}>
      <MemoryCard {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}
