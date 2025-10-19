import { Filter, ListCheck } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger } from '~/components/ui/select'

type MessagesFiltersProps = {
  selectedCount: number
  filteredMessagesCount: number
  filter: 'all' | 'pending' | 'approved' | 'rejected'
  selectedAction: 'approve' | 'reject' | 'delete' | null
  onBatchAction: (action: 'approve' | 'reject' | 'delete') => void
  onFilterChange: (filter: 'all' | 'pending' | 'approved' | 'rejected') => void
}

export function MessagesFilters({
  selectedCount,
  filteredMessagesCount,
  filter,
  selectedAction,
  onBatchAction,
  onFilterChange,
}: MessagesFiltersProps) {
  const filterLabels = {
    all: 'Todas mensagens',
    pending: 'Pendentes',
    approved: 'Aprovadas',
    rejected: 'Rejeitadas',
  }

  return (
    <div className="flex items-center gap-4">
      {filteredMessagesCount > 0 && (
        <>
          <Select
            disabled={selectedCount === 0}
            onValueChange={(value) => onBatchAction(value as 'approve' | 'reject' | 'delete')}
            value={selectedAction ?? ''}
          >
            <SelectTrigger className="w-fit sm:w-36" intent="admin">
              <div className="flex items-center gap-2">
                <ListCheck className="size-4 sm:hidden" />
                <span className="hidden sm:inline">Ações em lote</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="approve">Aprovar Selecionadas</SelectItem>
              <SelectItem value="reject">Rejeitar Selecionadas</SelectItem>
              <SelectItem value="delete">Deletar Selecionadas</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden h-8 w-px bg-zinc-300 sm:flex" />
        </>
      )}
      <Select onValueChange={(value) => onFilterChange(value as typeof filter)} value={filter}>
        <SelectTrigger className="w-fit sm:w-44" intent="admin">
          <div className="flex items-center gap-2">
            <Filter className="size-4 sm:hidden" />
            <span className="hidden sm:inline">{filterLabels[filter]}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas mensagens</SelectItem>
          <SelectItem value="pending">Pendentes</SelectItem>
          <SelectItem value="approved">Aprovadas</SelectItem>
          <SelectItem value="rejected">Rejeitadas</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
