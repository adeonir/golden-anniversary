'use client'

import { type ReactNode, useState } from 'react'
import { Avatar, AvatarInitials } from '~/components/ui/avatar'
import { Card, CardContent } from '~/components/ui/card'
import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import { useMessages } from '~/hooks/use-messages'
import { config } from '~/lib/config'
import { getInitials } from '~/lib/utils'

export function GuestbookMessages() {
  const [currentPage, setCurrentPage] = useState<number>(config.pagination.defaultPage)

  const { data, isLoading } = useMessages(currentPage, config.pagination.frontendPageSize, 'approved')

  const messages = data?.messages || []
  const totalPages = data?.totalPages || 1

  const isEmpty = messages.length === 0

  if (isLoading) {
    return <GuestbookSkeleton />
  }

  if (isEmpty) {
    return (
      <StatusCard>
        <p className="text-zinc-600">Ainda não há mensagens. Seja o primeiro a escrever!</p>
      </StatusCard>
    )
  }

  return (
    <div className="space-y-8">
      <h2 className="text-center font-medium font-serif text-2xl text-zinc-800">Mensagens Recebidas</h2>

      <div aria-label="Lista de mensagens do livro de visitas" className="space-y-4" role="feed">
        {messages.map((message) => (
          <Card aria-labelledby={`message-${message.id}-author`} className="shadow-md" key={message.id}>
            <CardContent className="px-8 py-4">
              <div className="flex gap-4">
                <Avatar aria-hidden="true" className="size-12 bg-gold-100">
                  <AvatarInitials className="bg-gold-200 font-medium text-gold-800">
                    {getInitials(message.name)}
                  </AvatarInitials>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-lg text-zinc-800" id={`message-${message.id}-author`}>
                    {message.name}
                  </h3>
                  <p className="text-zinc-600">{message.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination aria-label="Navegação das páginas de mensagens" className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                aria-label="Ir para página anterior"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationButton
                  aria-current={currentPage === page ? 'page' : undefined}
                  aria-label={`Ir para página ${page}`}
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationButton>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                aria-label="Ir para próxima página"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Próxima
              </PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}

function StatusCard({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-8">
      <h2 className="text-center font-medium font-serif text-2xl text-zinc-800">Mensagens Recebidas</h2>
      <Card className="border-gold-200 bg-white shadow-lg">
        <CardContent className="px-8 py-4 text-center">{children}</CardContent>
      </Card>
    </div>
  )
}

function MessageSkeleton() {
  return (
    <Card className="shadow-md">
      <CardContent className="px-8 py-4">
        <div className="flex gap-4">
          <div className="size-12 animate-pulse rounded-full bg-zinc-200" />
          <div className="flex-1 space-y-4">
            <div className="h-7 w-32 animate-pulse rounded bg-zinc-200" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-zinc-200" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function GuestbookSkeleton() {
  return (
    <div className="space-y-8">
      <h2 className="text-center font-medium font-serif text-2xl text-zinc-800">Mensagens Recebidas</h2>
      <div className="space-y-4">
        {Array.from({ length: 3 }, () => (
          <MessageSkeleton key={crypto.randomUUID()} />
        ))}
      </div>
    </div>
  )
}
