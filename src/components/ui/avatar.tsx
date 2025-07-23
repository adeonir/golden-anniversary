'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import type * as React from 'react'

import { cn } from '~/lib/utils'

function Avatar({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-8 shrink-0 overflow-hidden rounded-full', className)}
      data-slot="avatar"
      {...props}
    />
  )
}

function AvatarInitials({ className, ...props }: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn('flex size-full items-center justify-center rounded-full bg-muted', className)}
      data-slot="avatar-initials"
      {...props}
    />
  )
}

export { Avatar, AvatarInitials }
