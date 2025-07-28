'use client'

import { AlertCircle, CheckCircle, Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Progress } from '~/components/ui/progress'
import { ScrollArea } from '~/components/ui/scroll-area'
import { useUploadPhoto } from '~/hooks/use-photos'
import { cn, validateFile } from '~/lib/utils'

interface UploadFile {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

interface UploadsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadsModal({ open, onOpenChange }: UploadsModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [viewportHeight, setViewportHeight] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  const uploadMutation = useUploadPhoto()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      const newFiles: UploadFile[] = acceptedFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        preview: URL.createObjectURL(file),
        status: 'pending',
        progress: 0,
      }))
      setFiles((prev) => [...prev, ...newFiles])
    },
  })

  const removeFile = (id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((file) => file.id !== id)
    })
  }

  const clearAllFiles = () => {
    for (const file of files) {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    }
    setFiles([])
  }

  const updateFileStatus = useCallback(
    (id: string, status: UploadFile['status'], progress?: number, error?: string) => {
      setFiles((prev) =>
        prev.map((file) => (file.id === id ? { ...file, status, progress: progress ?? file.progress, error } : file)),
      )
    },
    [],
  )

  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')

    for (const file of pendingFiles) {
      const validation = validateFile(file.file)
      if (validation) {
        updateFileStatus(file.id, 'error', 0, validation)
        continue
      }

      updateFileStatus(file.id, 'uploading', 0)

      try {
        // biome-ignore lint/nursery/noAwaitInLoop: Sequential upload is intentional for better UX and server performance
        await uploadMutation.mutateAsync(file.file)
        updateFileStatus(file.id, 'success', 100)
      } catch (_error) {
        updateFileStatus(file.id, 'error', 0, 'Erro no upload')
      }
    }
  }, [files, uploadMutation, updateFileStatus])

  const handleClose = () => {
    clearAllFiles()
    onOpenChange(false)
  }

  useEffect(() => {
    const updateViewportHeight = () => {
      setViewportHeight(window.innerHeight)
    }

    updateViewportHeight()
    window.addEventListener('resize', updateViewportHeight)

    return () => window.removeEventListener('resize', updateViewportHeight)
  }, [])

  const { scrollAreaHeight } = useMemo(() => {
    const minHeight = 76
    const itemHeight = 76
    const gap = 12

    const maxViewportHeight = viewportHeight * 0.9
    const headerHeight = 120
    const dragDropHeight = 172
    const titleHeight = 32
    const footerHeight = 72
    const spacing = 48

    const availableHeight = maxViewportHeight - headerHeight - dragDropHeight - titleHeight - footerHeight - spacing
    const maxHeight = Math.max(availableHeight, minHeight)

    if (files.length === 0) return { scrollAreaHeight: minHeight }

    const contentHeight = files.length * itemHeight + (files.length - 1) * gap
    const finalHeight = Math.min(Math.max(contentHeight, minHeight), maxHeight)

    return { scrollAreaHeight: finalHeight }
  }, [files.length, viewportHeight])

  return (
    <Dialog onOpenChange={handleClose} open={open}>
      <DialogContent
        className={cn('flex max-h-[90vh] max-w-4xl flex-col', files.length > 0 && 'min-h-[518px]')}
        ref={modalRef}
      >
        <DialogHeader>
          <DialogTitle>Upload de Fotos</DialogTitle>
          <DialogDescription>
            Arraste e solte múltiplas fotos JPEG (máximo 1MB cada) para fazer upload
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4 size-12 text-muted-foreground" />
            <p className="mb-2 font-medium text-lg">
              {isDragActive ? 'Solte as fotos aqui...' : 'Arraste fotos aqui ou clique para selecionar'}
            </p>
            <p className="text-muted-foreground text-sm">Apenas arquivos JPEG, máximo 1MB por arquivo</p>
          </div>

          {files.length > 0 && (
            <div className="flex min-h-0 flex-1 flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Arquivos Selecionados ({files.length})</h3>
                <Button intent="admin" onClick={clearAllFiles} size="sm">
                  Limpar Tudo
                </Button>
              </div>

              <ScrollArea style={{ height: `${scrollAreaHeight}px`, scrollbarGutter: 'stable' }}>
                <div className="space-y-3">
                  {files.map((uploadFile) => (
                    <FileListItem file={uploadFile} key={uploadFile.id} onRemove={() => removeFile(uploadFile.id)} />
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <DialogFooter>
            <Button intent="admin" onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              disabled={uploadMutation.isPending || files.every((f) => f.status !== 'pending')}
              intent="admin"
              onClick={handleUpload}
            >
              {uploadMutation.isPending ? <Loader2 className="size-5 animate-spin" /> : 'Fazer Upload'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface FileListItemProps {
  file: UploadFile
  onRemove: () => void
}

function FileListItem({ file, onRemove }: FileListItemProps) {
  const validation = validateFile(file.file)
  const hasError = validation || file.status === 'error'

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border p-3',
        hasError ? 'border-destructive bg-destructive/5' : 'border-border',
      )}
    >
      <div className="size-12 flex-shrink-0 overflow-hidden rounded border bg-muted">
        {file.preview ? (
          <Image alt={file.file.name} className="size-full object-cover" height={48} src={file.preview} width={48} />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          {file.status === 'success' && <CheckCircle className="size-4 text-green-600" />}
          {(hasError || file.status === 'error') && <AlertCircle className="size-4 text-destructive" />}
          <span className="truncate font-medium text-sm">{file.file.name}</span>
        </div>

        <p className="text-muted-foreground text-xs">{(file.file.size / (1024 * 1024)).toFixed(1)} MB</p>

        {file.status === 'uploading' && (
          <div className="space-y-1">
            <Progress className="h-2" value={file.progress} />
            <p className="text-muted-foreground text-xs">{file.progress}% enviado</p>
          </div>
        )}

        {(validation || file.error) && <p className="text-destructive text-xs">{validation || file.error}</p>}

        {file.status === 'success' && <p className="text-green-600 text-xs">Upload realizado com sucesso!</p>}
      </div>

      <Button className="size-6 flex-shrink-0 p-0" intent="danger" onClick={onRemove} size="sm">
        <X className="size-4" />
      </Button>
    </div>
  )
}
