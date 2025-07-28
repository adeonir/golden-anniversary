import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type * as React from 'react'

import { cn } from '~/lib/utils'

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        solid: 'shadow-xs',
        outline: 'border bg-background shadow-xs',
      },
      intent: {
        default: '',
        admin: '',
        success: '',
        danger: '',
        neutral: '',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    compoundVariants: [
      // Solid variants
      {
        variant: 'solid',
        intent: 'default',
        class: 'bg-primary text-primary-foreground hover:bg-primary/90',
      },
      {
        variant: 'solid',
        intent: 'admin',
        class: 'bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground/20',
      },
      {
        variant: 'solid',
        intent: 'success',
        class: 'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-500/20',
      },
      {
        variant: 'solid',
        intent: 'danger',
        class: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500/20',
      },
      {
        variant: 'solid',
        intent: 'neutral',
        class: 'bg-zinc-500 text-white hover:bg-zinc-600 focus-visible:ring-zinc-500/20',
      },
      // Outline variants
      {
        variant: 'outline',
        intent: 'default',
        class: 'hover:bg-accent hover:text-accent-foreground',
      },
      {
        variant: 'outline',
        intent: 'admin',
        class: 'border-foreground text-foreground hover:bg-foreground hover:text-background',
      },
    ],
    defaultVariants: {
      variant: 'solid',
      intent: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  intent,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, intent, size, className }))} data-slot="button" {...props} />
}

export { Button, buttonVariants }
