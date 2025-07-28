import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { deletePhoto, fetchPhotos, reorderPhotos, updatePhoto, uploadPhoto } from '~/actions/photos'
import { useToast } from '~/hooks/use-toast'

const photosKeys = {
  all: ['photos'] as const,
  list: () => [...photosKeys.all, 'list'] as const,
}

export function usePhotos() {
  const toast = useToast()

  const query = useQuery({
    queryKey: photosKeys.list(),
    queryFn: fetchPhotos,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.error) {
      toast.error('Erro ao carregar fotos. Tente novamente mais tarde.')
    }
  }, [query.error, toast])

  return query
}

export function useUploadPhoto() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: uploadPhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Foto enviada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao enviar foto. Tente novamente.')
    },
  })
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, originalName }: { id: string; originalName: string }) => updatePhoto(id, originalName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Foto atualizada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao atualizar foto. Tente novamente.')
    },
  })
}

export function useDeletePhoto() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Foto deletada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao deletar foto. Tente novamente.')
    },
  })
}

export function useReorderPhotos() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: reorderPhotos,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: photosKeys.all })
      toast.success('Fotos reordenadas com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao reordenar fotos. Tente novamente.')
    },
  })
}
