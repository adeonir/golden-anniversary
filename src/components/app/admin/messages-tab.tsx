'use client'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import type { Message } from '~/types/messages'

const mockMessages: Message[] = [
  {
    id: '1',
    name: 'Maria Silva',
    message:
      'Que alegria imensa poder celebrar os 50 anos de casamento de vocês! Vocês são um exemplo de amor verdadeiro.',
    status: 'pending',
    createdAt: new Date('2024-01-15T10:30:00Z'),
  },
  {
    id: '2',
    name: 'João Santos',
    message: 'Parabéns pelos 50 anos de união! Que Deus continue abençoando essa família maravilhosa.',
    status: 'approved',
    createdAt: new Date('2024-01-14T15:45:00Z'),
  },
  {
    id: '3',
    name: 'Ana Costa',
    message: 'Meio século de amor! Vocês são inspiração para todos nós. Muito obrigada por tanto carinho.',
    status: 'rejected',
    createdAt: new Date('2024-01-13T09:20:00Z'),
  },
  {
    id: '4',
    name: 'Pedro Oliveira',
    message: 'Bodas de Ouro! Que bela conquista. Desejo muitos anos mais de felicidade e saúde para vocês.',
    status: 'pending',
    createdAt: new Date('2024-01-12T14:10:00Z'),
  },
]

export function MessagesTab() {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const formatDate = (date: Date) => {
    return format(date, "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR,
    })
  }

  const filteredMessages = mockMessages.filter((message) => {
    if (filter === 'all') return true
    return message.status === filter
  })

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-2xl text-foreground">Mensagens</h2>
          <p className="text-muted-foreground">Gerencie as mensagens do livro de visitas</p>
        </div>
        <Select onValueChange={(value) => setFilter(value as typeof filter)} value={filter}>
          <SelectTrigger className="w-48">
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
        <div className="space-y-4">
          {filteredMessages.map((message) => (
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
                      className="bg-green-500 text-white hover:bg-green-600 disabled:bg-green-3040"
                      disabled={message.status === 'approved'}
                      size="sm"
                    >
                      Aprovar
                    </Button>
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600 disabled:bg-red-3040"
                      disabled={message.status === 'rejected'}
                      size="sm"
                    >
                      Rejeitar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
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
