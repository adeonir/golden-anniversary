import { Check, Edit2, GripVertical, Trash2, X } from 'lucide-react'
import NextImage from 'next/image'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { formatDate, formatSize } from '~/lib/utils'
import type { Photo } from '~/types/photos'

export type MemoryCardVariant = 'list' | 'columns' | 'grid'

export type MemoryCardProps = {
  photo: Photo
  variant?: MemoryCardVariant
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

function GridCard({ photo, isDeleting, isReordering, onDelete, dragHandleProps }: MemoryCardProps) {
  return (
    <div className="group relative flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-2">
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-zinc-100">
        <NextImage alt={photo.title || 'Foto'} className="size-full object-cover" fill src={photo.url} />
        <div className="absolute top-1 right-1">
          <Button
            className="size-7 cursor-grab bg-white/80 backdrop-blur-sm active:cursor-grabbing"
            disabled={isReordering}
            loading={isReordering}
            size="icon"
            variant="outline"
            {...dragHandleProps}
          >
            <GripVertical className="size-4" />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between gap-1">
        <p className="min-w-0 flex-1 truncate text-xs text-zinc-700" title={photo.title || 'Sem título'}>
          {photo.title || 'Sem título'}
        </p>
        <Button className="size-7 flex-shrink-0" loading={isDeleting} onClick={onDelete} size="icon" variant="outline">
          <Trash2 className="size-3" />
        </Button>
      </div>
    </div>
  )
}

function ListCard({
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
}: MemoryCardProps) {
  return (
    <div className="group relative flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        <div className="absolute top-1 right-1 flex-shrink-0 sm:static">
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

        <div className="relative size-12 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-300 bg-zinc-100">
          <NextImage alt={photo.title || 'Foto'} className="size-full object-cover" fill src={photo.url} />
        </div>
      </div>

      <div className="flex flex-1 items-center gap-4">
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
              className="h-8 w-full cursor-pointer truncate rounded-md border border-transparent px-3 py-1 text-left text-sm text-zinc-900 transition hover:border-gray-300 hover:text-zinc-700"
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
        <div className="hidden flex-shrink-0 px-4 text-sm text-zinc-600 lg:block">{formatSize(photo.size)}</div>
        <div className="hidden flex-shrink-0 px-4 text-sm text-zinc-600 md:block">{formatDate(photo.createdAt)}</div>
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
    </div>
  )
}

export function MemoryCard(props: MemoryCardProps) {
  if (props.variant === 'grid') {
    return <GridCard {...props} />
  }

  return <ListCard {...props} />
}
