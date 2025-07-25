import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createMessage, deleteMessage, getMessage, getMessages } from '~/actions/messages'
import { useToast } from '~/hooks/use-toast'

const messagesKeys = {
  all: ['messages'] as const,
  lists: () => [...messagesKeys.all, 'list'] as const,
  list: (filters: string) => [...messagesKeys.lists(), { filters }] as const,
  details: () => [...messagesKeys.all, 'detail'] as const,
  detail: (id: string) => [...messagesKeys.details(), id] as const,
}

export function useMessages() {
  return useQuery({
    queryKey: messagesKeys.lists(),
    queryFn: getMessages,
  })
}

export function useMessage(id: string) {
  return useQuery({
    queryKey: messagesKeys.detail(id),
    queryFn: () => getMessage(id),
    enabled: !!id,
  })
}

export function useCreateMessage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: createMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      toast.success('Mensagem enviada com sucesso! Será analisada e publicada em breve.', {
        description: 'Obrigado por compartilhar sua mensagem com a família.',
      })
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
