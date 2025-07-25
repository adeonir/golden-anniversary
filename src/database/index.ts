import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { env } from '~/env'
import * as schema from './schema'

const client = postgres(
  `postgresql://postgres:${env.DATABASE_PASSWORD}@db.${env.SUPABASE_PROJECT_ID}.supabase.co:6543/postgres?pgbouncer=true`,
  {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
  },
)
export const database = drizzle(client, { schema })
