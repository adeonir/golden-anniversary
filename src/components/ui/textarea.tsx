import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const textareaVariants = cva(
  'field-sizing-content flex min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm',
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

function Textarea({
  className,
  variant,
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return <textarea className={cn(textareaVariants({ variant, className }))} data-slot="textarea" {...props} />
}

export { Textarea }
