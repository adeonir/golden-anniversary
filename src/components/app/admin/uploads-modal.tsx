'use client'

import { Image, Upload, X } from 'lucide-react'
import NextImage from 'next/image'
import { useRef } from 'react'
import { Button } from '~/components/ui/button'
import { CircularProgress } from '~/components/ui/circular-progress'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { useFileUpload } from '~/hooks/use-file-upload'
import { cn } from '~/lib/utils'

type UploadsModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const STATUS_BORDER_COLORS = {
  pending: 'border-transparent',
  uploading: 'border-orange-400',
  success: 'border-green-500',
  error: 'border-red-500',
} as const

export function UploadsModal({ open, onOpenChange }: UploadsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const {
    files,
    isUploading,
    uploadProgress,
    statusCounts,
    dropzone,
    removeFile,
    clearAllFiles,
    handleUpload,
    handleRetry,
    handleCancel,
  } = useFileUpload()

  const { getRootProps, getInputProps, isDragActive } = dropzone

  const handleClose = () => {
    clearAllFiles()
    onOpenChange(false)
  }

  const showUploadButton = statusCounts.pending > 0 || statusCounts.error > 0
  const isRetryMode = statusCounts.error > 0 && statusCounts.pending === 0
  const showCloseText = statusCounts.pending === 0 && statusCounts.error === 0

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
                <p className="text-sm text-zinc-600">Apenas arquivos JPEG, maximo 1MB por arquivo</p>
              </>
            )}
          </div>

          {files.length > 0 && (
            <div className="flex min-h-0 flex-1 flex-col space-y-4">
              <h3 className="font-medium text-lg">Arquivos Selecionados ({files.length})</h3>

              <div className="flex flex-wrap gap-2">
                {files.map((uploadFile) => (
                  <Tooltip key={uploadFile.id}>
                    <TooltipTrigger asChild>
                      <div className="group relative size-12 flex-shrink-0">
                        <div
                          className={cn(
                            'size-full overflow-hidden rounded border-2',
                            STATUS_BORDER_COLORS[uploadFile.status],
                          )}
                        >
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
                ))}
              </div>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <DialogFooter>
            <Button
              className="flex-1 sm:flex-initial"
              intent="admin"
              onClick={isUploading ? handleCancel : handleClose}
              variant="outline"
            >
              {showCloseText ? 'Fechar' : 'Cancelar'}
            </Button>
            {showUploadButton && (
              <Button
                className="flex-1 sm:w-32 sm:flex-initial"
                disabled={isUploading}
                intent="admin"
                loading={isUploading}
                onClick={isRetryMode ? handleRetry : handleUpload}
              >
                {isRetryMode ? 'Reenviar' : 'Fazer Upload'}
              </Button>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
