'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { type ReactNode, useRef } from 'react'

type QueryProviderProps = {
  children: ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  const queryClient = useRef(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          retry: 3,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30_000),
          staleTime: 5 * 60 * 1000, // 5 minutes
        },
        mutations: {
          retry: 2,
          retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10_000),
        },
      },
    }),
  ).current

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}
