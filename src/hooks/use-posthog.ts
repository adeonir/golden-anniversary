'use client'

import { useContext } from 'react'
import { PostHogContext } from '~/providers/posthog-provider'

export function usePostHog() {
  const posthog = useContext(PostHogContext)
  return posthog
}
