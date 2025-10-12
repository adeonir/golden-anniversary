'use client'

import { LogOut } from 'lucide-react'
import { signOut } from '~/actions/sign-out'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type LogoutButtonProps = {
  className?: string
}

export function LogoutButton({ className }: LogoutButtonProps) {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <Button className={cn('w-full', className)} intent="admin" onClick={handleLogout}>
      Sair
      <LogOut />
    </Button>
  )
}
