import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import {
  approveMessage,
  batchApproveMessages,
  batchDeleteMessages,
  batchRejectMessages,
  createMessage,
  deleteMessage,
  fetchMessages,
  rejectMessage,
} from '~/actions/messages'
import { useToast } from '~/hooks/use-toast'
import { config } from '~/lib/config'

const messagesKeys = {
  all: ['messages'] as const,
  list: (page: number, limit: number) => [...messagesKeys.all, 'list', page, limit] as const,
  details: () => [...messagesKeys.all, 'detail'] as const,
  detail: (id: string) => [...messagesKeys.details(), id] as const,
}

export function useMessages(
  page: number = config.pagination.defaultPage,
  limit: number = config.pagination.frontendPageSize,
  status?: 'approved' | 'pending' | 'rejected',
) {
  const toast = useToast()

  const query = useQuery({
    queryKey: messagesKeys.list(page, limit),
    queryFn: () => fetchMessages(page, limit, status),
    refetchOnWindowFocus: true,
  })

  useEffect(() => {
    if (query.error) {
      toast.error('Erro ao carregar mensagens. Tente novamente mais tarde.')
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

export function useApproveMessage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: approveMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      toast.success('Mensagem aprovada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao aprovar mensagem. Tente novamente.')
    },
  })
}

export function useRejectMessage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: rejectMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      toast.success('Mensagem rejeitada.')
    },
    onError: () => {
      toast.error('Erro ao rejeitar mensagem. Tente novamente.')
    },
  })
}

export function useDeleteMessage() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      queryClient.removeQueries({ queryKey: messagesKeys.detail(deletedId) })
      toast.success('Mensagem deletada com sucesso!')
    },
    onError: () => {
      toast.error('Erro ao deletar mensagem. Tente novamente.')
    },
  })
}

export function useBatchApproveMessages() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: batchApproveMessages,
    onSuccess: (messages) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      toast.success(`${messages.length} mensagem(ns) aprovada(s) com sucesso!`)
    },
    onError: () => {
      toast.error('Erro ao aprovar mensagens. Tente novamente.')
    },
  })
}

export function useBatchRejectMessages() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: batchRejectMessages,
    onSuccess: (messages) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      toast.success(`${messages.length} mensagem(ns) rejeitada(s).`)
    },
    onError: () => {
      toast.error('Erro ao rejeitar mensagens. Tente novamente.')
    },
  })
}

export function useBatchDeleteMessages() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: batchDeleteMessages,
    onSuccess: (deletedIds) => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all })
      for (const id of deletedIds) {
        queryClient.removeQueries({ queryKey: messagesKeys.detail(id) })
      }
      toast.success(`${deletedIds.length} mensagem(ns) deletada(s) com sucesso!`)
    },
    onError: () => {
      toast.error('Erro ao deletar mensagens. Tente novamente.')
    },
  })
}
