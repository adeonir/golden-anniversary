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
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Columns2, Grid2x2, TextAlignJustify, Upload } from 'lucide-react'
import NextImage from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { useDataState } from '~/hooks/use-data-state'
import { usePhotoActions } from '~/hooks/use-photo-actions'
import { useDeletePhoto, useMemories, useReorderPhotos, useUpdatePhoto } from '~/hooks/use-photos'
import type { Photo } from '~/types/photos'
import { MemoryCard, type MemoryCardProps } from './memory-card'
import { UploadsModal } from './uploads-modal'

type LayoutType = 'list' | 'columns' | 'grid'

const containerStyles: Record<LayoutType, string> = {
  list: 'grid grid-cols-1 gap-4',
  columns: 'grid grid-cols-2 gap-4',
  grid: 'grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
}

export function MemoriesTab() {
  const [layout, setLayout] = useState<LayoutType>('list')
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
      <div className="flex flex-shrink-0 items-center justify-between gap-6">
        <div>
          <h2 className="font-semibold text-2xl text-zinc-900">Memórias</h2>
          <p className="text-zinc-600">Gerencie as fotos das memórias do casal</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Button
              className="rounded-r-none"
              intent="admin"
              onClick={() => setLayout('list')}
              size="icon"
              variant={layout === 'list' ? 'solid' : 'outline'}
            >
              <TextAlignJustify />
            </Button>
            <Button
              className="-ml-px rounded-none"
              intent="admin"
              onClick={() => setLayout('columns')}
              size="icon"
              variant={layout === 'columns' ? 'solid' : 'outline'}
            >
              <Columns2 />
            </Button>
            <Button
              className="-ml-px rounded-l-none"
              intent="admin"
              onClick={() => setLayout('grid')}
              size="icon"
              variant={layout === 'grid' ? 'solid' : 'outline'}
            >
              <Grid2x2 />
            </Button>
          </div>
          <Button className="flex items-center gap-2" intent="admin" onClick={() => setModalOpen(true)}>
            <Upload />
            <span className="hidden sm:block">Fazer Upload</span>
          </Button>
        </div>
      </div>

      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-400 min-h-0 flex-1 overflow-y-auto pr-2">
        {dataStateAlert && <div className="flex items-center justify-center py-8">{dataStateAlert}</div>}

        {!dataStateAlert && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
          >
            <SortableContext
              items={localPhotos.map((p) => p.id)}
              strategy={layout === 'list' ? verticalListSortingStrategy : rectSortingStrategy}
            >
              <div className={containerStyles[layout]}>
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
                    variant={layout}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                layout === 'grid' ? (
                  <div className="flex w-[calc((100vw-9.5rem)/3)] flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg sm:w-[calc((100vw-10.25rem)/4)] lg:w-[calc((100vw-11rem)/5)] xl:w-[calc((100vw-11.75rem)/6)]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-md bg-zinc-100">
                      <NextImage
                        alt="Foto"
                        className="size-full object-cover"
                        fill
                        src={localPhotos.find((p) => p.id === activeId)?.url || ''}
                      />
                    </div>
                    <p className="truncate text-xs text-zinc-700">
                      {localPhotos.find((p) => p.id === activeId)?.title || 'Sem título'}
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-7 rounded-lg border border-zinc-200 bg-white p-4 pl-17 shadow-lg">
                    <div className="relative size-12 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100">
                      <NextImage
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
                )
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
