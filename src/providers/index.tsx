'use client'

import { NuqsAdapter } from 'nuqs/adapters/next/app'
import type { ReactNode } from 'react'
import { MotionProvider } from './motion-provider'
import { QueryProvider } from './query-client'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <MotionProvider>
        <NuqsAdapter>{children}</NuqsAdapter>
      </MotionProvider>
    </QueryProvider>
  )
}
