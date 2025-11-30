'use client'

import { Image, Upload, X } from 'lucide-react'
import NextImage from 'next/image'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '~/components/ui/button'
import { CircularProgress } from '~/components/ui/circular-progress'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { useUploadPhoto } from '~/hooks/use-photos'
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
  const [isUploading, setIsUploading] = useState(false)
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
    setIsUploading(true)

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

    setIsUploading(false)
  }, [files, uploadMutation, updateFileStatus])

  const handleClose = () => {
    clearAllFiles()
    onOpenChange(false)
  }

  const uploadProgress = useMemo(() => {
    if (files.length === 0) return 0
    const completed = files.filter((f) => f.status === 'success').length
    const failed = files.filter((f) => f.status === 'error').length
    return Math.min(((completed + failed) / files.length) * 100, 100)
  }, [files])

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
              'relative rounded-lg border-2 border-dashed p-8 text-center transition-colors',
              isUploading ? 'pointer-events-none border-zinc-300' : 'cursor-pointer',
              !isUploading && (isDragActive ? 'border-zinc-500 bg-zinc-50' : 'border-zinc-300 hover:border-zinc-400'),
            )}
          >
            <input {...getInputProps()} disabled={isUploading} />
            {isUploading ? (
              <div className="flex items-center justify-center">
                <CircularProgress intent="admin" size={80} strokeWidth={8} value={uploadProgress} />
              </div>
            ) : (
              <>
                <Upload className="mx-auto mb-4 size-12 text-zinc-500" />
                <p className="text-sm text-zinc-600">Apenas arquivos JPEG, máximo 1MB por arquivo</p>
              </>
            )}
          </div>

          {files.length > 0 && (
            <div className="flex min-h-0 flex-1 flex-col space-y-4">
              <h3 className="font-medium text-lg">Arquivos Selecionados ({files.length})</h3>

              <div className="flex flex-wrap gap-2">
                {files.map((uploadFile) => {
                  const borderColor = {
                    pending: 'border-transparent',
                    uploading: 'border-orange-400',
                    success: 'border-green-500',
                    error: 'border-red-500',
                  }[uploadFile.status]

                  return (
                    <Tooltip key={uploadFile.id}>
                      <TooltipTrigger asChild>
                        <div className="group relative size-12 flex-shrink-0">
                          <div className={cn('size-full overflow-hidden rounded border-2', borderColor)}>
                            {uploadFile.preview ? (
                              <NextImage
                                alt={uploadFile.file.name}
                                className="size-full object-cover"
                                height={48}
                                src={uploadFile.preview}
                                width={48}
                              />
                            ) : (
                              <div className="flex size-full items-center justify-center bg-zinc-100">
                                <Image className="size-4 text-zinc-500" />
                              </div>
                            )}
                          </div>
                          {(uploadFile.status === 'pending' || uploadFile.status === 'error') && (
                            <button
                              className={cn(
                                '-right-1 -top-1 absolute flex size-5 items-center justify-center rounded-full bg-zinc-800 text-white opacity-0 transition-opacity hover:bg-zinc-900 group-hover:opacity-100',
                                isUploading && 'pointer-events-none',
                              )}
                              disabled={isUploading}
                              onClick={() => removeFile(uploadFile.id)}
                              type="button"
                            >
                              <X className="size-3" />
                            </button>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{uploadFile.file.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                })}
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
