import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { deletePhoto, fetchMemories, fetchPhotos, reorderPhotos, updatePhoto, uploadPhoto } from '~/actions/photos'
import { useErrorTracking } from '~/hooks/use-error-tracking'
import { useToast } from '~/hooks/use-toast'

const photosKeys = {
  all: ['photos'] as const,
  list: () => [...photosKeys.all, 'list'] as const,
  memories: () => [...photosKeys.all, 'memories'] as const,
}

export function usePhotos() {
  const toast = useToast()
  const { captureError } = useErrorTracking()

  const query = useQuery({
    queryKey: photosKeys.list(),
    queryFn: () => fetchPhotos(),
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.error) {
      captureError(query.error, { context: 'fetchPhotos', errorType: 'query' })
      toast.error('Erro ao carregar fotos. Tente novamente mais tarde.')
    }
  }, [query.error, toast, captureError])

  return query
}

export function useMemories() {
  const toast = useToast()
  const { captureError } = useErrorTracking()

  const query = useQuery({
    queryKey: photosKeys.memories(),
    queryFn: fetchMemories,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.error) {
      captureError(query.error, { context: 'fetchMemories', errorType: 'query' })
      toast.error('Erro ao carregar memórias. Tente novamente mais tarde.')
    }
  }, [query.error, toast, captureError])

  return query
}

export function useUploadPhoto() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { captureError } = useErrorTracking()

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Foto enviada com sucesso!')
    },
    onError: (error) => {
      captureError(error, { context: 'uploadPhoto', errorType: 'mutation' })
      toast.error('Erro ao enviar foto. Tente novamente.')
    },
  })
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { captureError } = useErrorTracking()

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => updatePhoto(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Foto atualizada com sucesso!')
    },
    onError: (error) => {
      captureError(error, { context: 'updatePhoto', errorType: 'mutation' })
      toast.error('Erro ao atualizar foto. Tente novamente.')
    },
  })
}

export function useDeletePhoto() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { captureError } = useErrorTracking()

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Foto deletada com sucesso!')
    },
    onError: (error) => {
      captureError(error, { context: 'deletePhoto', errorType: 'mutation' })
      toast.error('Erro ao deletar foto. Tente novamente.')
    },
  })
}

export function useReorderPhotos() {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { captureError } = useErrorTracking()

  return useMutation({
    mutationFn: reorderPhotos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Fotos reordenadas com sucesso!')
    },
    onError: (error) => {
      captureError(error, { context: 'reorderPhotos', errorType: 'mutation' })
      toast.error('Erro ao reordenar fotos. Tente novamente.')
    },
  })
}
