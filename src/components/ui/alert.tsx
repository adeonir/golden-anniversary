import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-white text-zinc-900',
        destructive: 'bg-white text-red-600 *:data-[slot=alert-description]:text-red-600/90 [&>svg]:text-current',
        info: 'border-blue-300 bg-blue-50 text-blue-800 [&>svg]:text-blue-600',
        success: 'border-green-300 bg-green-50 text-green-800 [&>svg]:text-green-600',
        warning: 'border-amber-300 bg-amber-50 text-amber-800 [&>svg]:text-amber-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Alert({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div className={cn(alertVariants({ variant }), className)} data-slot="alert" role="alert" {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
      data-slot="alert-title"
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-sm text-zinc-600 [&_p]:leading-relaxed',
        className,
      )}
      data-slot="alert-description"
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
