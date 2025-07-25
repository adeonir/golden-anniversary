'use client'

import { useState } from 'react'
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
import { getInitials } from '~/lib/utils'

export function GuestbookMessages() {
  const [currentPage, setCurrentPage] = useState(1)

  const { data, isLoading } = useMessages({
    status: 'approved',
    page: currentPage,
    limit: 5,
  })

  const messages = data?.messages || []
  const totalPages = data?.totalPages || 1

  const isEmpty = messages.length === 0

  if (isLoading) {
    return (
      <StatusCard>
        <p className="text-zinc-600">Carregando mensagens...</p>
      </StatusCard>
    )
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

      <div className="space-y-4">
        {messages.map((message) => (
          <Card className="border-gold-200 bg-white shadow-lg" key={message.id}>
            <CardContent className="px-8 py-4">
              <div className="flex gap-4">
                <Avatar className="size-12 bg-gold-100">
                  <AvatarInitials className="bg-gold-200 font-medium text-gold-800">
                    {getInitials(message.name)}
                  </AvatarInitials>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-lg text-zinc-800">{message.name}</h3>
                  <p className="text-zinc-600">{message.message}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                Anterior
              </PaginationPrevious>
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationButton isActive={currentPage === page} onClick={() => setCurrentPage(page)}>
                  {page}
                </PaginationButton>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
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

function StatusCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8">
      <h2 className="text-center font-medium font-serif text-2xl text-zinc-800">Mensagens Recebidas</h2>
      <Card className="border-gold-200 bg-white shadow-lg">
        <CardContent className="px-8 py-4 text-center">{children}</CardContent>
      </Card>
    </div>
  )
}
