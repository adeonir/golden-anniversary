import { cva, type VariantProps } from 'class-variance-authority'
import { Slot } from 'radix-ui'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const badgeVariants = cva(
  'inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full border px-1.5 font-medium text-xs leading-normal transition-[color,box-shadow] focus-visible:border-gold-600 focus-visible:ring-[3px] focus-visible:ring-gold-600/50 [&>svg]:pointer-events-none [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-zinc-100 text-zinc-600 [a&]:hover:bg-zinc-100/90',
        primary: 'border-transparent bg-gold-600 text-gold-50 [a&]:hover:bg-gold-600/90',
        secondary: 'border-transparent bg-zinc-100 text-zinc-900 [a&]:hover:bg-zinc-100/90',
        destructive:
          'border-transparent bg-red-600 text-white focus-visible:ring-red-600/20 dark:focus-visible:ring-red-600/40 [a&]:hover:bg-red-600/90',
        outline: 'text-zinc-900 [a&]:hover:bg-zinc-100 [a&]:hover:text-zinc-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return <Comp className={cn(badgeVariants({ variant }), className)} data-slot="badge" {...props} />
}

export { Badge, badgeVariants }
