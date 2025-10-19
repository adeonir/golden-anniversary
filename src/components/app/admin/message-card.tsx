import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Checkbox } from '~/components/ui/checkbox'
import { formatDate } from '~/lib/utils'
import type { Message } from '~/types/messages'

export type MessageCardProps = {
  message: Message
  isSelected: boolean
  isPendingApprove: boolean
  isPendingReject: boolean
  isPendingDelete: boolean
  onToggleSelect: () => void
  onApprove: () => void
  onReject: () => void
  onDelete: () => void
}

export function MessageCard({
  message,
  isSelected,
  isPendingApprove,
  isPendingReject,
  isPendingDelete,
  onToggleSelect,
  onApprove,
  onReject,
  onDelete,
}: MessageCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-300 bg-gray-50 p-4 text-zinc-900 shadow-none md:gap-6 md:p-6">
      <div className="flex gap-4 md:items-start">
        <Checkbox
          checked={isSelected}
          className="mt-1 self-start"
          id={`message-${message.id}`}
          onCheckedChange={onToggleSelect}
        />

        <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-medium text-zinc-900">{message.name}</h3>
              <StatusBadge status={message.status} />
            </div>

            <p className="text-zinc-900 leading-relaxed">{message.message}</p>

            <div className="flex flex-wrap items-center gap-1 pt-2 lg:hidden">
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
          </div>

          <div className="flex flex-col gap-3 lg:items-end lg:gap-2">
            <div className="hidden flex-wrap items-center gap-2 lg:flex">
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
            <div className="flex flex-wrap gap-2">
              <Button
                className="w-20"
                disabled={message.status === 'approved'}
                intent="success"
                loading={isPendingApprove}
                onClick={onApprove}
                size="sm"
              >
                Aprovar
              </Button>
              <Button
                className="w-20"
                disabled={message.status === 'rejected'}
                intent="danger"
                loading={isPendingReject}
                onClick={onReject}
                size="sm"
              >
                Rejeitar
              </Button>
              <Button className="w-20" intent="neutral" loading={isPendingDelete} onClick={onDelete} size="sm">
                Deletar
              </Button>
            </div>
          </div>
        </div>
      </div>
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
