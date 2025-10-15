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
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { Checkbox } from '~/components/ui/checkbox'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
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
import { formatDate } from '~/lib/utils'

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
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
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
        </div>
        <div className="flex items-center gap-4">
          {filteredMessages.length > 0 && (
            <>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={count === filteredMessages.length && count > 0}
                  id="select-all"
                  onCheckedChange={handleSelectAll}
                />
                <label className="cursor-pointer text-sm text-zinc-700" htmlFor="select-all">
                  Selecionar todas
                </label>
              </div>
              <Select
                disabled={count === 0}
                onValueChange={(value) => handleBatchAction(value as 'approve' | 'reject' | 'delete')}
                value={selectedAction ?? ''}
              >
                <SelectTrigger className="w-48" intent="admin">
                  <SelectValue placeholder="Ações em lote" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">Aprovar Selecionadas</SelectItem>
                  <SelectItem value="reject">Rejeitar Selecionadas</SelectItem>
                  <SelectItem value="delete">Deletar Selecionadas</SelectItem>
                </SelectContent>
              </Select>
              <div className="h-8 w-px bg-zinc-300" />
            </>
          )}
          <Select onValueChange={(value) => setFilter(value as typeof filter)} value={filter}>
            <SelectTrigger className="w-48" intent="admin">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas mensagens</SelectItem>
              <SelectItem value="pending">Pendentes</SelectItem>
              <SelectItem value="approved">Aprovadas</SelectItem>
              <SelectItem value="rejected">Rejeitadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1">
        {dataStateAlert && <div className="flex items-center justify-center py-8">{dataStateAlert}</div>}

        {!dataStateAlert && (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card className="border-zinc-300 p-6" key={message.id}>
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={isSelected(message.id)}
                    className="mt-1"
                    id={`message-${message.id}`}
                    onCheckedChange={() => toggle(message.id)}
                  />

                  <div className="flex flex-1 items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-zinc-900">{message.name}</h3>
                        <StatusBadge status={message.status} />
                      </div>

                      <p className="text-zinc-900 leading-relaxed">{message.message}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-zinc-600">Enviado em {formatDate(message.createdAt)}</p>
                        {message.approvedAt && (
                          <>
                            <div className="h-4 w-px bg-zinc-300" />
                            <p className="text-green-600 text-xs">Aprovada em {formatDate(message.approvedAt)}</p>
                          </>
                        )}
                        {message.rejectedAt && (
                          <>
                            <div className="h-4 w-px bg-zinc-300" />
                            <p className="text-red-600 text-xs">Rejeitada em {formatDate(message.rejectedAt)}</p>
                          </>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="w-20"
                          disabled={message.status === 'approved'}
                          intent="success"
                          loading={pendingActions[message.id] === 'approve'}
                          onClick={() => handleApprove(message.id)}
                          size="sm"
                        >
                          Aprovar
                        </Button>
                        <Button
                          className="w-20"
                          disabled={message.status === 'rejected'}
                          intent="danger"
                          loading={pendingActions[message.id] === 'reject'}
                          onClick={() => handleReject(message.id)}
                          size="sm"
                        >
                          Rejeitar
                        </Button>
                        <Button
                          className="w-20"
                          intent="neutral"
                          loading={pendingActions[message.id] === 'delete'}
                          onClick={() => handleDelete(message.id)}
                          size="sm"
                        >
                          Deletar
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>

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

function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const variants = {
    pending: { className: 'bg-amber-500 text-white', text: 'Pendente' },
    approved: { className: 'bg-green-500 text-white', text: 'Aprovada' },
    rejected: { className: 'bg-red-500 text-white', text: 'Rejeitada' },
  }

  const { className, text } = variants[status]
  return <Badge className={className}>{text}</Badge>
}
