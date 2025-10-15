import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { db } from '~/lib/database/client'
import { users } from '~/lib/database/schema'
import { getCookie, verifyToken } from './jwt'

export async function isAuthenticated(): Promise<boolean> {
  try {
    const token = await getCookie()

    if (!token) {
      return false
    }

    const payload = await verifyToken(token)

    if (!payload) {
      return false
    }

    const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1)

    return user.length > 0
  } catch {
    return false
  }
}

export async function requireAuth(): Promise<void> {
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    redirect('/login')
  }
}

export async function getCurrentUser() {
  const token = await getCookie()

  if (!token) {
    return null
  }

  const payload = await verifyToken(token)

  if (!payload) {
    return null
  }

  const user = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1)

  return user[0] ?? null
}
