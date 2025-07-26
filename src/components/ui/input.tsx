import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const inputVariants = cva(
  'flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm',
  {
    variants: {
      variant: {
        default:
          'border-input focus-visible:border-foreground/50 focus-visible:ring-[3px] focus-visible:ring-foreground/20',
        primary: 'border-border focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30',
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
  type,
  ...props
}: React.ComponentProps<'input'> & VariantProps<typeof inputVariants>) {
  return <input className={cn(inputVariants({ variant, className }))} data-slot="input" type={type} {...props} />
}

export { Input }
