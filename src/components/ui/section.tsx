import type * as React from 'react'
import type { ComponentProps } from 'react'
import { cn } from '~/lib/utils'

export function Section({
  children,
  className,
  ...props
}: ComponentProps<'section'> & {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('px-4 py-24 sm:py-32', className)} {...props}>
      {children}
    </section>
  )
}
