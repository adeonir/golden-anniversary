'use client'

import { signOut } from '~/actions/sign-out'
import { Button } from '~/components/ui/button'

export function LogoutButton() {
  const handleLogout = async () => {
    await signOut()
  }

  return (
    <Button className="w-full bg-zinc-600 hover:bg-zinc-700" onClick={handleLogout}>
      Sair
    </Button>
  )
}
