'use client'

import { AlertCircle, CheckCircle, Image as ImageIcon, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { useUploadPhoto } from '~/hooks/use-photos'
import { useViewportHeight } from '~/hooks/use-viewport-height'
import { cn, validateFile } from '~/lib/utils'

type UploadFile = {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

type UploadsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadsModal({ open, onOpenChange }: UploadsModalProps) {
  const [files, setFiles] = useState<UploadFile[]>([])
  const viewportHeight = useViewportHeight()
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

  const updateFileStatus = useCallback((id: string, status: UploadFile['status'], error?: string) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, status, error } : file)))
  }, [])

  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')

    for (const file of pendingFiles) {
      const validation = validateFile(file.file)
      if (validation) {
        updateFileStatus(file.id, 'error', validation)
        continue
      }

      updateFileStatus(file.id, 'uploading')

      try {
        await uploadMutation.mutateAsync(file.file)
        updateFileStatus(file.id, 'success')
      } catch (_error) {
        updateFileStatus(file.id, 'error', 'Erro no upload')
      }
    }
  }, [files, uploadMutation, updateFileStatus])

  const handleClose = () => {
    clearAllFiles()
    onOpenChange(false)
  }

  const { scrollAreaHeight } = useMemo(() => {
    const minHeight = 88
    const itemHeight = 88
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
        className={cn('flex max-h-[90vh] max-w-[calc(100%-3rem)] flex-col', files.length > 0 && 'min-h-[534px]')}
        ref={modalRef}
      >
        <DialogHeader>
          <DialogTitle>Upload de Fotos</DialogTitle>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 flex-col space-y-6">
          <div
            {...getRootProps()}
            className={cn(
              'cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors',
              isDragActive ? 'border-zinc-500 bg-zinc-50' : 'border-zinc-300 hover:border-zinc-400',
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto mb-4 size-12 text-zinc-500" />
            <p className="text-sm text-zinc-600">Apenas arquivos JPEG, máximo 1MB por arquivo</p>
          </div>

          {files.length > 0 && (
            <div className="flex min-h-0 flex-1 flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-lg">Arquivos Selecionados ({files.length})</h3>
                <Button intent="admin" onClick={clearAllFiles} size="sm" variant="outline">
                  Limpar Tudo
                </Button>
              </div>

              <div className="min-h-0 overflow-y-auto pr-2" style={{ height: `${scrollAreaHeight}px` }}>
                <div className="space-y-3">
                  {files.map((uploadFile) => (
                    <FileListItem file={uploadFile} key={uploadFile.id} onRemove={() => removeFile(uploadFile.id)} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <DialogFooter>
            <Button className="flex-1 sm:flex-initial" intent="admin" onClick={handleClose} variant="outline">
              {files.every((f) => f.status === 'success' || f.status === 'error') ? 'Fechar' : 'Cancelar'}
            </Button>
            {!files.every((f) => f.status === 'success' || f.status === 'error') && (
              <Button
                className="flex-1 sm:w-32 sm:flex-initial"
                disabled={files.every((f) => f.status !== 'pending')}
                intent="admin"
                loading={uploadMutation.isPending}
                onClick={handleUpload}
              >
                Fazer Upload
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

type FileListItemProps = {
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
        hasError ? 'border-red-500 bg-red-50' : 'border-zinc-300',
      )}
    >
      <div className="size-12 flex-shrink-0 overflow-hidden rounded border bg-zinc-100">
        {file.preview ? (
          <Image alt={file.file.name} className="size-full object-cover" height={48} src={file.preview} width={48} />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-4 text-zinc-500" />
          </div>
        )}
      </div>

      <div className="grid min-w-0 flex-1 grid-rows-2">
        <div className="flex items-center gap-2">
          {file.status === 'success' && <CheckCircle className="size-4 flex-shrink-0 text-green-600" />}
          {(hasError || file.status === 'error') && <AlertCircle className="size-4 flex-shrink-0 text-red-600" />}
          <span className="truncate font-medium text-sm">{file.file.name}</span>
          <span className="flex-shrink-0 text-sm text-zinc-600">({(file.file.size / 1024).toFixed(0)} KB)</span>
        </div>

        {(validation || file.error) && <p className="text-red-600 text-xs">{validation || file.error}</p>}

        {file.status === 'success' && <p className="text-green-600 text-xs">Upload realizado com sucesso!</p>}
      </div>

      {file.status !== 'success' && (
        <Button className="size-6 flex-shrink-0 p-0" intent="danger" onClick={onRemove} size="sm">
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  )
}
