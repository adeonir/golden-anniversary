import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const inputVariants = cva(
  'flex h-9 w-full min-w-0 rounded-md border border-zinc-300 bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-gold-600 selection:text-gold-50 file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-sm file:text-zinc-900 placeholder:text-zinc-600 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-600/20 md:text-sm',
  {
    variants: {
      variant: {
        default: 'focus-visible:border-gold-600 focus-visible:ring-[3px] focus-visible:ring-gold-600/30',
      },
      intent: {
        admin: 'focus-visible:border-zinc-900/50 focus-visible:ring-[3px] focus-visible:ring-zinc-600/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Input({
  className,
  variant,
  intent,
  type,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return (
    <input className={cn(inputVariants({ variant, intent, className }))} data-slot="input" type={type} {...props} />
  )
}

export { Input }
