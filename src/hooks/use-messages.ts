import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { createMessage, deleteMessage, fetchMessages, getMessage } from '~/actions/messages'
import { useToast } from '~/hooks/use-toast'

const messagesKeys = {
  all: ['messages'] as const,
  list: (page: number, status?: string) => [...messagesKeys.all, 'list', page, status] as const,
  details: () => [...messagesKeys.all, 'detail'] as const,
  detail: (id: string) => [...messagesKeys.details(), id] as const,
}

export function useMessages(page = 1, limit = 5, status?: 'approved' | 'pending' | 'rejected') {
  const toast = useToast()

  const query = useQuery({
    queryKey: messagesKeys.list(page, status),
    queryFn: () => fetchMessages(page, limit, status),
  })

  useEffect(() => {
    if (query.error) {
      toast.error('Erro ao carregar mensagens. Tente novamente mais tarde.')
    }
  }, [query.error, toast])

  return query
}

export function useMessage(id: string) {
  const toast = useToast()

  const query = useQuery({
    queryKey: messagesKeys.detail(id),
    queryFn: () => getMessage(id),
    enabled: !!id,
  })

  useEffect(() => {
    if (query.error) {
      toast.error('Erro ao carregar mensagem. Tente novamente mais tarde.')
    }
  }, [query.error, toast])

  return query
}

export function useCreateMessage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      toast.success('Mensagem enviada com sucesso! Será analisada e publicada em breve.')
    },
    onError: () => {
      toast.error('Erro ao enviar mensagem. Tente novamente.')
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      queryClient.removeQueries({ queryKey: messagesKeys.detail(deletedId) })
    },
  })
}
