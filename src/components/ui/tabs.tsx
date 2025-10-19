'use client'

import { Tabs as TabsPrimitive } from 'radix-ui'
import type * as React from 'react'

import { cn } from '~/lib/utils'

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root className={cn('flex flex-col gap-2', className)} data-slot="tabs" {...props} />
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex w-fit items-center justify-center rounded-md bg-zinc-100 p-0.5 text-zinc-600/70',
        className,
      )}
      data-slot="tabs-list"
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 font-medium text-sm outline-none transition-all hover:text-zinc-600 focus-visible:border-zinc-900/50 focus-visible:ring-[3px] focus-visible:ring-zinc-600/30 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-xs [&_svg]:shrink-0',
        className,
      )}
      data-slot="tabs-trigger"
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn('flex min-h-0 flex-1 flex-col outline-none', className)}
      data-slot="tabs-content"
      {...props}
    />
  )
}

export { Tabs, TabsContent, TabsList, TabsTrigger }
