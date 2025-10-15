'use server'

import { redirect } from 'next/navigation'
import { clearCookie } from '~/lib/auth/jwt'

export async function signOut() {
  await clearCookie()

  redirect('/login')
}
