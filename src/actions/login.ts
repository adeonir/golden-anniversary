'use server'

import { compare } from 'bcryptjs'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { setCookie, signToken } from '~/lib/auth/jwt'
import { db } from '~/lib/database/client'
import { users } from '~/lib/database/schema'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1)

  if (user.length === 0) {
    throw new Error('Invalid credentials')
  }

  const isValidPassword = await compare(password, user[0].password)

  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }

  const token = await signToken({
    userId: user[0].id,
    email: user[0].email,
  })

  await setCookie(token)

  redirect('/admin')
}
