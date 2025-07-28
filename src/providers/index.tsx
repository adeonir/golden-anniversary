'use client'

import type { ReactNode } from 'react'
import { MotionProvider } from './motion-provider'
import { QueryProvider } from './query-client'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      <MotionProvider>{children}</MotionProvider>
    </QueryProvider>
  )
}
