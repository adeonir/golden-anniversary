import { Check, Edit2, GripVertical, Trash2, X } from 'lucide-react'
import Image from 'next/image'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { formatDate, formatSize } from '~/lib/utils'
import type { Photo } from '~/types/photos'

export type MemoryRowProps = {
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

export function MemoryRow({
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
}: MemoryRowProps) {
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
