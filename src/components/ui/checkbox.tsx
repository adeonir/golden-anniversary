'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import type * as React from 'react'

import { cn } from '~/lib/utils'

function Checkbox({ className, ...props }: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn(
        'peer size-4 shrink-0 cursor-pointer rounded-[4px] border border-zinc-300 bg-white shadow-xs outline-none transition-all hover:border-zinc-400 focus-visible:border-zinc-900/50 focus-visible:ring-[3px] focus-visible:ring-zinc-600/30 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-zinc-700 data-[state=checked]:bg-zinc-700 data-[state=checked]:text-white',
        className,
      )}
      data-slot="checkbox"
      {...props}
    >
      <CheckboxPrimitive.Indicator
        className="grid place-content-center text-current transition-none"
        data-slot="checkbox-indicator"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
