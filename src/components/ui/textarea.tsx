import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const textareaVariants = cva(
  'field-sizing-content flex min-h-16 w-full rounded-md border border-zinc-300 bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-[color,box-shadow] placeholder:text-zinc-600 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-red-500 aria-invalid:ring-red-600/20 md:text-sm',
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

function Textarea({
  className,
  variant,
  intent,
  ...props
}: React.ComponentProps<'textarea'> & VariantProps<typeof textareaVariants>) {
  return <textarea className={cn(textareaVariants({ variant, intent, className }))} data-slot="textarea" {...props} />
}

export { Textarea }
