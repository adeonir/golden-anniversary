import type { UseMutationResult } from '@tanstack/react-query'
import { useState } from 'react'

type ActionType = 'approve' | 'reject' | 'delete'

export function useMessageActions() {
  const [pendingActions, setPendingActions] = useState<Record<string, ActionType>>({})

  const createHandler = (
    actionType: ActionType,
    mutation: UseMutationResult<unknown, Error, string, unknown>,
    confirmMessage?: string,
  ) => {
    return (id: string) => {
      if (confirmMessage && !confirm(confirmMessage)) return

      setPendingActions((prev) => ({ ...prev, [id]: actionType }))
      mutation.mutate(id, {
        onSettled: () =>
          setPendingActions((prev) => {
            const { [id]: _, ...rest } = prev
            return rest
          }),
      })
    }
  }

  return { pendingActions, createHandler }
}
