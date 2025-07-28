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
import { rectSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Check, Edit2, Grip, Trash2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useDataState } from '~/hooks/use-data-state'
import { usePhotos } from '~/hooks/use-photos'
import type { Photo } from '~/types/photos'
import { UploadsModal } from './uploads-modal'

export function PhotosTab() {
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const { data: photos = [], isLoading, error } = usePhotos()

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
    data: photos,
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
    // TODO: Implementar lógica de save
    setEditingId(null)
    setEditTitle('')
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle('')
  }

  const handleDelete = (_photoId: string) => {
    // TODO: Implementar lógica de delete
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // TODO: Implementar lógica de reordenação
      // const oldIndex = photos.findIndex((photo) => photo.id === active.id)
      // const newIndex = photos.findIndex((photo) => photo.id === over.id)
      // const newPhotos = arrayMove(photos, oldIndex, newIndex)
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
            <SortableContext items={photos.map((p) => p.id)} strategy={rectSortingStrategy}>
              <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {photos.map((photo) => (
                  <SortablePhotoGridItem
                    editTitle={editTitle}
                    isEditing={editingId === photo.id}
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
                <PhotoGridItem
                  editTitle=""
                  isEditing={false}
                  onDelete={() => {
                    /* noop for drag overlay */
                  }}
                  onEditCancel={() => {
                    /* noop for drag overlay */
                  }}
                  onEditSave={() => {
                    /* noop for drag overlay */
                  }}
                  onEditStart={() => {
                    /* noop for drag overlay */
                  }}
                  onEditTitleChange={() => {
                    /* noop for drag overlay */
                  }}
                  photo={photos.find((p) => p.id === activeId) || photos[0]}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </ScrollArea>

      <UploadsModal onOpenChange={setUploadModalOpen} open={uploadModalOpen} />
    </div>
  )
}

interface SortablePhotoGridItemProps extends PhotoGridItemProps {
  photo: Photo
}

function SortablePhotoGridItem(props: SortablePhotoGridItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.photo.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div className={isDragging ? 'opacity-50' : ''} ref={setNodeRef} style={style}>
      <PhotoGridItem {...props} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  )
}

interface PhotoGridItemProps {
  photo: Photo
  isEditing: boolean
  editTitle: string
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
  onEditTitleChange: (title: string) => void
  onDelete: () => void
  dragHandleProps?: Record<string, unknown>
}

function PhotoGridItem({
  photo,
  isEditing,
  editTitle,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditTitleChange,
  onDelete,
  dragHandleProps,
}: PhotoGridItemProps) {
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
          <Button intent="default" onClick={onEditStart} size="icon" variant="solid">
            <Edit2 />
          </Button>
          <Button intent="danger" onClick={onDelete} size="icon" variant="solid">
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
            <Button className="size-7" intent="success" onClick={onEditSave} variant="solid">
              <Check />
            </Button>
            <Button className="size-7" intent="neutral" onClick={onEditCancel} variant="solid">
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
