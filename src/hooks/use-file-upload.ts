'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useUploadPhoto } from '~/hooks/use-photos'
import { validateFile } from '~/lib/utils'

export type UploadFile = {
  id: string
  file: File
  preview: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

type StatusCounts = {
  pending: number
  uploading: number
  success: number
  error: number
}

const AUTO_CLEANUP_DELAY = 2000

export function useFileUpload() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const uploadInterruptedRef = useRef(false)
  const uploadMutation = useUploadPhoto()

  const dropzone = useDropzone({
    accept: { 'image/jpeg': ['.jpg', '.jpeg'] },
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

  const updateFileStatus = useCallback((id: string, status: UploadFile['status'], error?: string) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, status, error } : file)))
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id)
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      return prev.filter((file) => file.id !== id)
    })
  }, [])

  const clearAllFiles = useCallback(() => {
    setFiles((prev) => {
      for (const file of prev) {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      }
      return []
    })
  }, [])

  const handleUpload = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending')
    setIsUploading(true)
    uploadInterruptedRef.current = false

    for (const file of pendingFiles) {
      if (uploadInterruptedRef.current) break

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

  const handleRetry = useCallback(() => {
    setFiles((prev) =>
      prev.map((file) => (file.status === 'error' ? { ...file, status: 'pending', error: undefined } : file)),
    )
    handleUpload()
  }, [handleUpload])

  const handleCancel = useCallback(() => {
    uploadInterruptedRef.current = true
    setIsUploading(false)
    setFiles((prev) =>
      prev.map((file) => (file.status === 'uploading' ? { ...file, status: 'error', error: 'Cancelado' } : file)),
    )
  }, [])

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    for (const file of files) {
      if (file.status === 'success') {
        const timeout = setTimeout(() => {
          removeFile(file.id)
        }, AUTO_CLEANUP_DELAY)
        timeouts.push(timeout)
      }
    }

    return () => {
      for (const timeout of timeouts) {
        clearTimeout(timeout)
      }
    }
  }, [files, removeFile])

  const uploadProgress = useMemo(() => {
    if (files.length === 0) return 0
    const completed = files.filter((f) => f.status === 'success').length
    const failed = files.filter((f) => f.status === 'error').length
    return Math.min(((completed + failed) / files.length) * 100, 100)
  }, [files])

  const statusCounts = useMemo<StatusCounts>(
    () => ({
      pending: files.filter((f) => f.status === 'pending').length,
      uploading: files.filter((f) => f.status === 'uploading').length,
      success: files.filter((f) => f.status === 'success').length,
      error: files.filter((f) => f.status === 'error').length,
    }),
    [files],
  )

  return {
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
  }
}
