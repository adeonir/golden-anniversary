'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useMessageActions } from '~/hooks/use-message-actions'
import { useApproveMessage, useDeleteMessage, useMessages, useRejectMessage } from '~/hooks/use-messages'
import { config } from '~/lib/config'

export function MessagesTab() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const {
    data: messagesData,
    isLoading,
    error,
  } = useMessages(config.pagination.defaultPage, config.pagination.adminPageSize)

  const approveMutation = useApproveMessage()
  const rejectMutation = useRejectMessage()
  const deleteMutation = useDeleteMessage()

  const { pendingActions, createHandler } = useMessageActions()

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    })
  }

  const handleApprove = createHandler('approve', approveMutation)
  const handleReject = createHandler('reject', rejectMutation)
  const handleDelete = createHandler('delete', deleteMutation)

  const allMessages = messagesData?.messages || []
  const pendingCount = allMessages.filter((msg) => msg.status === 'pending').length

  const messages = allMessages.filter((message) => {
    if (filter === 'all') return true
    return message.status === filter
  })

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-2xl text-foreground">Mensagens</h2>
            {pendingCount > 0 && (
              <Badge className="bg-amber-500 text-white">
                {pendingCount} pendente{pendingCount !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Gerencie as mensagens do livro de visitas</p>
        </div>
        <Select onValueChange={(value) => setFilter(value as typeof filter)} value={filter}>
          <SelectTrigger className="w-48" intent="admin">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="approved">Aprovadas</SelectItem>
            <SelectItem value="rejected">Rejeitadas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-1">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Carregando mensagens...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-8">
            <p className="text-destructive">Erro ao carregar mensagens. Tente novamente.</p>
          </div>
        )}

        {!(isLoading || error) && messages.length === 0 && (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Nenhuma mensagem encontrada.</p>
          </div>
        )}

        {!(isLoading || error) && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card className="p-6" key={message.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-foreground">{message.name}</h3>
                      <StatusBadge status={message.status} />
                    </div>

                    <p className="text-foreground leading-relaxed">{message.message}</p>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <p className="text-muted-foreground text-xs">Enviado em {formatDate(message.createdAt)}</p>
                    <div className="flex gap-2">
                      <Button
                        className="w-20"
                        disabled={message.status === 'approved' || pendingActions[message.id] === 'approve'}
                        intent="approve"
                        onClick={() => handleApprove(message.id)}
                        size="sm"
                      >
                        {pendingActions[message.id] === 'approve' ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          'Aprovar'
                        )}
                      </Button>
                      <Button
                        className="w-20"
                        disabled={message.status === 'rejected' || pendingActions[message.id] === 'reject'}
                        intent="reject"
                        onClick={() => handleReject(message.id)}
                        size="sm"
                      >
                        {pendingActions[message.id] === 'reject' ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          'Rejeitar'
                        )}
                      </Button>
                      <Button
                        className="w-20"
                        disabled={pendingActions[message.id] === 'delete'}
                        intent="delete"
                        onClick={() => handleDelete(message.id)}
                        size="sm"
                      >
                        {pendingActions[message.id] === 'delete' ? (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        ) : (
                          'Deletar'
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
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
