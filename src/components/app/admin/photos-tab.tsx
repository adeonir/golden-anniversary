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
import { Check, Edit2, GripVertical, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useDataState } from '~/hooks/use-data-state'
import { useDeletePhoto, usePhotos, useReorderPhotos, useUpdatePhoto } from '~/hooks/use-photos'
import type { Photo } from '~/types/photos'
import { UploadsModal } from './uploads-modal'

export function PhotosTab() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [localPhotos, setLocalPhotos] = useState<Photo[]>([])
  const [reorderingPhotoId, setReorderingPhotoId] = useState<string | null>(null)
  const { data: photos = [], isLoading, error } = usePhotos()
  const updatePhotoMutation = useUpdatePhoto()
  const deletePhotoMutation = useDeletePhoto()
  const reorderPhotosMutation = useReorderPhotos()

  useEffect(() => {
    if (photos.length > 0) {
      setLocalPhotos(photos)
    }
  }, [photos])

  // Debounced reorder function to avoid excessive API calls during drag operations
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
  }, [reorderPhotosMutation])

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

  const dataStateAlert = useDataState({
    data: localPhotos,
    isLoading,
    error,
    loadingText: 'Carregando fotos...',
    errorText: 'Erro ao carregar fotos. Tente novamente.',
    emptyText: 'Nenhuma foto encontrada.',
  })

  const handleEditStart = (photo: Photo) => {
    setEditingId(photo.id)
    setEditTitle(photo.title || '')
  }

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      updatePhotoMutation.mutate(
        { id: editingId, title: editTitle.trim() },
        {
          onSuccess: () => {
            setEditingId(null)
            setEditTitle('')
          },
        },
      )
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
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
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl text-zinc-900">Galeria</h2>
          <p className="text-zinc-600">Gerencie as fotos da galeria de aniversário</p>
        </div>
        <Button className="flex items-center gap-2" intent="admin" onClick={() => setUploadModalOpen(true)}>
          <Upload />
          Fazer Upload
        </Button>
      </div>

      <ScrollArea className="flex-1">
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
                  <SortablePhotoRow
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
      </ScrollArea>

      <UploadsModal onOpenChange={setUploadModalOpen} open={uploadModalOpen} />
    </div>
  )
}

interface SortablePhotoRowProps extends PhotoRowProps {
  photo: Photo
}

function SortablePhotoRow(props: SortablePhotoRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.photo.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className={isDragging ? 'opacity-50' : ''} ref={setNodeRef} style={style}>
      <PhotoRow {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}

interface PhotoRowProps {
  photo: Photo
  isEditing: boolean
  editTitle: string
  isDeleting: boolean
  isReordering: boolean
  isSaving: boolean
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
  onEditTitleChange: (title: string) => void
  onDelete: () => void
  dragHandleProps?: Record<string, unknown>
}

function PhotoRow({
  photo,
  isEditing,
  editTitle,
  isDeleting,
  isReordering,
  isSaving,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTitleChange,
  onDelete,
  dragHandleProps,
}: PhotoRowProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatSize = (bytes: number) => {
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  return (
    <div className="group flex items-center gap-4 rounded-lg border border-zinc-200 p-4 hover:bg-zinc-50">
      <div className="flex-shrink-0">
        <Button
          className="cursor-grab active:cursor-grabbing"
          disabled={isReordering}
          loading={isReordering}
          size="icon"
          variant="outline"
          {...dragHandleProps}
        >
          <GripVertical />
        </Button>
      </div>

      <div className="relative size-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100">
        <Image alt={photo.title || 'Foto'} className="size-full object-cover" fill src={photo.url} />
      </div>

      <div className="min-w-0 flex-1">
        {isEditing ? (
          <Input
            autoFocus
            className="h-8 text-sm"
            intent="admin"
            onChange={(e) => onEditTitleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onEditSave()
              if (e.key === 'Escape') onEditCancel()
            }}
            placeholder="Nome da foto"
            value={editTitle}
          />
        ) : (
          <button
            className="w-full cursor-pointer truncate text-left text-sm text-zinc-900 hover:text-zinc-700"
            onClick={onEditStart}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onEditStart()
              }
            }}
            title={photo.title || 'Sem título'}
            type="button"
          >
            {photo.title || 'Sem título'}
          </button>
        )}
      </div>
      <div className="flex-shrink-0 px-4 text-sm text-zinc-600">{formatSize(photo.size)}</div>
      <div className="flex-shrink-0 px-4 text-sm text-zinc-600">{formatDate(photo.createdAt)}</div>
      <div className="flex flex-shrink-0 gap-2">
        {!isEditing && (
          <>
            <Button loading={isSaving} onClick={onEditStart} size="icon" variant="outline">
              <Edit2 />
            </Button>
            <Button loading={isDeleting} onClick={onDelete} size="icon" variant="outline">
              <Trash2 />
            </Button>
          </>
        )}
        {isEditing && (
          <>
            <Button loading={isSaving} onClick={onEditSave} size="icon" variant="outline">
              <Check />
            </Button>
            <Button disabled={isSaving} onClick={onEditCancel} size="icon" variant="outline">
              <X />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
