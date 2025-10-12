import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { env } from '~/env'

const secret = new TextEncoder().encode(env.JWT_SECRET)
const alg = 'HS256'
const cookieName = 'auth-token'

export type TokenPayload = {
  userId: string
  email: string
}

export async function signToken(payload: TokenPayload): Promise<string> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)

  return token
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [alg],
    })

    return {
      userId: payload.userId as string,
      email: payload.email as string,
    }
  } catch {
    return null
  }
}

export async function getCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(cookieName)

  return token?.value ?? null
}

export async function setCookie(token: string): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export async function clearCookie(): Promise<void> {
  const cookieStore = await cookies()

  cookieStore.delete(cookieName)
}
