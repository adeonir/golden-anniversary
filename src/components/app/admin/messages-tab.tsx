'use client'

import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '~/components/ui/alert-dialog'
import { Badge } from '~/components/ui/badge'
import { Checkbox } from '~/components/ui/checkbox'
import { useBatchSelection } from '~/hooks/use-batch-selection'
import { useDataState } from '~/hooks/use-data-state'
import { useMessageActions } from '~/hooks/use-message-actions'
import {
  useApproveMessage,
  useBatchApproveMessages,
  useBatchDeleteMessages,
  useBatchRejectMessages,
  useDeleteMessage,
  useMessages,
  useRejectMessage,
} from '~/hooks/use-messages'
import { useMessagesFilters } from '~/hooks/use-messages-filter'
import { config } from '~/lib/config'
import { MessageCard } from './message-card'
import { MessagesFilters } from './messages-filters'

export function MessagesTab() {
  const {
    data: messagesData,
    isLoading,
    error,
  } = useMessages(config.pagination.defaultPage, config.pagination.adminPageSize)

  const approveMutation = useApproveMessage()
  const rejectMutation = useRejectMessage()
  const deleteMutation = useDeleteMessage()

  const batchApproveMutation = useBatchApproveMessages()
  const batchRejectMutation = useBatchRejectMessages()
  const batchDeleteMutation = useBatchDeleteMessages()

  const allMessages = messagesData?.messages || []
  const { filter, setFilter, filteredMessages, pendingCount } = useMessagesFilters({ messages: allMessages })
  const { pendingActions, createHandler } = useMessageActions()
  const { selectedIds, count, toggle, selectAll, clearAll, isSelected } = useBatchSelection()

  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'delete' | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const dataStateAlert = useDataState({
    data: filteredMessages,
    isLoading,
    error,
    loadingText: 'Carregando mensagens...',
    errorText: 'Erro ao carregar mensagens. Tente novamente.',
    emptyText: 'Nenhuma mensagem encontrada.',
  })

  const handleApprove = createHandler('approve', approveMutation)
  const handleReject = createHandler('reject', rejectMutation)
  const handleDelete = createHandler('delete', deleteMutation)

  const handleSelectAll = () => {
    if (count === filteredMessages.length) {
      clearAll()
    } else {
      selectAll(filteredMessages.map((m) => m.id))
    }
  }

  const handleBatchAction = (action: 'approve' | 'reject' | 'delete') => {
    if (count === 0) return

    setSelectedAction(action)
    setDialogOpen(true)
  }

  const confirmBatchAction = () => {
    if (!selectedAction) return

    if (selectedAction === 'approve') {
      batchApproveMutation.mutate(selectedIds, {
        onSuccess: () => {
          clearAll()
          setDialogOpen(false)
          setSelectedAction(null)
        },
      })
    } else if (selectedAction === 'reject') {
      batchRejectMutation.mutate(selectedIds, {
        onSuccess: () => {
          clearAll()
          setDialogOpen(false)
          setSelectedAction(null)
        },
      })
    } else if (selectedAction === 'delete') {
      batchDeleteMutation.mutate(selectedIds, {
        onSuccess: () => {
          clearAll()
          setDialogOpen(false)
          setSelectedAction(null)
        },
      })
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <div className="flex flex-shrink-0 flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
        <div className="w-full">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-2xl text-zinc-900">Mensagens</h2>
            {pendingCount > 0 && (
              <Badge className="bg-amber-500 text-white">
                {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
              </Badge>
            )}
            {count > 0 && (
              <Badge className="bg-blue-500 text-white">
                {count} selecionada{count !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="text-zinc-600">Gerencie as mensagens do livro de visitas</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={count === filteredMessages.length && count > 0}
                id="select-all"
                onCheckedChange={handleSelectAll}
              />
              <label className="cursor-pointer text-sm text-zinc-700" htmlFor="select-all">
                <span className="hidden sm:block">Selecionar todas</span>
                <span className="sm:hidden">Todas</span>
              </label>
            </div>
            <div className="lg:hidden">
              <MessagesFilters
                filter={filter}
                filteredMessagesCount={filteredMessages.length}
                onBatchAction={handleBatchAction}
                onFilterChange={setFilter}
                selectedAction={selectedAction}
                selectedCount={count}
              />
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <MessagesFilters
            filter={filter}
            filteredMessagesCount={filteredMessages.length}
            onBatchAction={handleBatchAction}
            onFilterChange={setFilter}
            selectedAction={selectedAction}
            selectedCount={count}
          />
        </div>
      </div>

      <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-400 min-h-0 flex-1 overflow-y-auto pr-2">
        {dataStateAlert && <div className="flex items-center justify-center py-8">{dataStateAlert}</div>}

        {!dataStateAlert && (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <MessageCard
                isPendingApprove={pendingActions[message.id] === 'approve'}
                isPendingDelete={pendingActions[message.id] === 'delete'}
                isPendingReject={pendingActions[message.id] === 'reject'}
                isSelected={isSelected(message.id)}
                key={message.id}
                message={message}
                onApprove={() => handleApprove(message.id)}
                onDelete={() => handleDelete(message.id)}
                onReject={() => handleReject(message.id)}
                onToggleSelect={() => toggle(message.id)}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setSelectedAction(null)
        }}
        open={dialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar ação em lote</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedAction === 'approve' &&
                `Você está prestes a aprovar ${count} mensagem(ns). Elas ficarão visíveis no livro de visitas.`}
              {selectedAction === 'reject' &&
                `Você está prestes a rejeitar ${count} mensagem(ns). Esta ação pode ser revertida mais tarde.`}
              {selectedAction === 'delete' &&
                `Você está prestes a deletar ${count} mensagem(ns). Esta ação não pode ser desfeita.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction intent="admin" onClick={confirmBatchAction}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
