'use client'

import { useCallback } from 'react'
import { analyticsEvents, type ErrorTrackingProps } from '~/lib/analytics/events'
import { usePostHog } from './use-posthog'

type ErrorContext = {
  context: string
  errorType?: 'api' | 'query' | 'mutation'
}

export function useErrorTracking() {
  const posthog = usePostHog()

  const captureError = useCallback(
    (error: unknown, { context, errorType = 'api' }: ErrorContext) => {
      if (!posthog) return

      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      const stackTrace = error instanceof Error ? error.stack : undefined

      let eventName: string
      if (errorType === 'mutation') {
        eventName = analyticsEvents.mutationError
      } else if (errorType === 'query') {
        eventName = analyticsEvents.queryError
      } else {
        eventName = analyticsEvents.apiError
      }

      const errorData: ErrorTrackingProps = {
        error_message: errorMessage,
        error_type: error instanceof Error ? error.name : 'UnknownError',
        context,
        stack_trace: stackTrace,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
      }

      posthog.capture(eventName, errorData)
    },
    [posthog],
  )

  return { captureError }
}
