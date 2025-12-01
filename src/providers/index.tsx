'use client'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import { TooltipProvider } from '~/components/ui/tooltip'
import { MotionProvider } from './motion-provider'
import { PostHogProvider } from './posthog-provider'
import { QueryProvider } from './query-client'

type ProvidersProps = {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <PostHogProvider>
        <MotionProvider>
          <TooltipProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </TooltipProvider>
        </MotionProvider>
      </PostHogProvider>
    </QueryProvider>
  )
}
