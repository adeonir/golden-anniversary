import { defineConfig } from 'drizzle-kit'
import { env } from '~/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: `postgresql://postgres:${env.DATABASE_PASSWORD}@db.${env.SUPABASE_PROJECT_ID}.supabase.co:6543/postgres?pgbouncer=true`,
  },
})
