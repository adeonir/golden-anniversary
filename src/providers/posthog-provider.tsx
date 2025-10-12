'use client'

import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'
import type { ReactNode } from 'react'
import { createContext, useEffect } from 'react'

export const PostHogContext = createContext<typeof posthog | null>(null)

type PostHogProviderProps = {
  children: ReactNode
}

function isAdminRoute(pathname: string | null): boolean {
  return pathname?.startsWith('/admin') || pathname === '/sign-in'
}

function capturePageView() {
  posthog.capture('$pageview', {
    $current_url: window.location.href,
  })
}

export function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (isAdminRoute(pathname)) {
      if (posthog.__loaded) {
        posthog.opt_out_capturing()
      }
      return
    }

    if (pathname && posthog.__loaded) {
      capturePageView()
    }
  }, [pathname])

  return <PostHogContext.Provider value={posthog}>{children}</PostHogContext.Provider>
}
