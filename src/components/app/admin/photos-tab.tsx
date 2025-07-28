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
import { Check, Edit2, Grip, Trash2, Upload, X } from 'lucide-react'
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
    return (photoIds: string[]) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        reorderPhotosMutation.mutate(photoIds)
      }, 300)
    }
  }, [reorderPhotosMutation])

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
  )

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
    setEditTitle(photo.originalName)
  }

  const handleEditSave = () => {
    if (editingId && editTitle.trim()) {
      updatePhotoMutation.mutate(
        { id: editingId, originalName: editTitle.trim() },
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
      debouncedReorder(photoIds)
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
          <Upload className="size-4" />
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
              <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {localPhotos.map((photo) => (
                  <SortablePhotoCard
                    editTitle={editTitle}
                    isDeleting={deletePhotoMutation.isPending}
                    isEditing={editingId === photo.id}
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
                <PhotoCardPreview photo={localPhotos.find((p) => p.id === activeId) || localPhotos[0]} />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </ScrollArea>

      <UploadsModal onOpenChange={setUploadModalOpen} open={uploadModalOpen} />
    </div>
  )
}

interface SortablePhotoCardProps extends PhotoCardProps {
  photo: Photo
}

function SortablePhotoCard(props: SortablePhotoCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.photo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className={isDragging ? 'opacity-50' : ''} ref={setNodeRef} style={style}>
      <PhotoCard {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}

interface PhotoCardProps {
  photo: Photo
  isEditing: boolean
  editTitle: string
  isDeleting: boolean
  isSaving: boolean
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
  onEditTitleChange: (title: string) => void
  onDelete: () => void
  dragHandleProps?: Record<string, unknown>
}

function PhotoCard({
  photo,
  isEditing,
  editTitle,
  isDeleting,
  isSaving,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTitleChange,
  onDelete,
  dragHandleProps,
}: PhotoCardProps) {
  return (
    <div className="group relative flex flex-col space-y-2">
      <div className="absolute top-2 left-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          className="cursor-grab active:cursor-grabbing"
          intent="admin"
          size="icon"
          variant="outline"
          {...dragHandleProps}
        >
          <Grip />
        </Button>
      </div>

      <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-400 bg-zinc-100">
        <Image
          alt={photo.originalName}
          className="size-full object-cover transition-transform group-hover:scale-105"
          fill
          src={photo.url}
        />

        <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <Button intent="default" loading={isSaving} onClick={onEditStart} size="icon" variant="solid">
            <Edit2 />
          </Button>
          <Button intent="danger" loading={isDeleting} onClick={onDelete} size="icon" variant="solid">
            <Trash2 />
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        {isEditing ? (
          <div className="flex gap-1">
            <Input
              autoFocus
              className="h-7 text-xs"
              intent="admin"
              onChange={(e) => onEditTitleChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onEditSave()
                if (e.key === 'Escape') onEditCancel()
              }}
              placeholder="Nome da foto"
              value={editTitle}
            />
            <Button className="size-7" intent="success" loading={isSaving} onClick={onEditSave} variant="solid">
              <Check />
            </Button>
            <Button className="size-7" disabled={isSaving} intent="neutral" onClick={onEditCancel} variant="solid">
              <X />
            </Button>
          </div>
        ) : (
          <button
            className="w-full cursor-pointer truncate text-left text-xs text-zinc-600 hover:text-zinc-900"
            onClick={onEditStart}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onEditStart()
              }
            }}
            title={photo.originalName}
            type="button"
          >
            {photo.originalName}
          </button>
        )}
        <p className="text-xs text-zinc-600">{(photo.size / (1024 * 1024)).toFixed(1)} MB</p>
      </div>
    </div>
  )
}

function PhotoCardPreview({ photo }: { photo: Photo }) {
  return (
    <div className="flex flex-col space-y-2">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-zinc-400 bg-zinc-100">
        <Image alt={photo.originalName} className="size-full object-cover" fill src={photo.url} />
      </div>
      <div className="space-y-1">
        <p className="truncate text-xs text-zinc-600">{photo.originalName}</p>
        <p className="text-xs text-zinc-600">{(photo.size / (1024 * 1024)).toFixed(1)} MB</p>
      </div>
    </div>
  )
}
