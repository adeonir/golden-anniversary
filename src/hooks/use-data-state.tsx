import { AlertCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/alert'

type UseDataStateOptions = {
  data: unknown[] | undefined
  isLoading: boolean
  error: Error | null | unknown
  loadingText?: string
  errorText?: string
  emptyText?: string
}

export function useDataState({
  data,
  isLoading,
  error,
  loadingText = 'Carregando...',
  errorText = 'Erro ao carregar dados. Tente novamente.',
  emptyText = 'Nenhum item encontrado.',
}: UseDataStateOptions) {
  if (isLoading) {
    return (
      <Alert variant="info">
        <Loader2 className="animate-spin" />
        <AlertDescription>{loadingText}</AlertDescription>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertDescription>{errorText}</AlertDescription>
      </Alert>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Alert variant="warning">
        <AlertTriangle />
        <AlertDescription>{emptyText}</AlertDescription>
      </Alert>
    )
  }

  return null
}
