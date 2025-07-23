import type { User } from '@supabase/supabase-js'
import { env } from '~/env'

export function isAdmin(user: User | null): boolean {
  return user?.email === env.ADMIN_EMAIL
}

export function requireAdmin(user: User | null): User {
  if (!(isAdmin(user) && user)) {
    throw new Error('Unauthorized: Admin access required')
  }
  return user
}
