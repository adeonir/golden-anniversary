import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '~/env'
import * as schema from './schema'

const client = postgres(
  `postgresql://postgres:${env.DATABASE_PASSWORD}@db.${env.SUPABASE_PROJECT_ID}.supabase.co:5432/postgres`,
)
export const database = drizzle(client, { schema })
