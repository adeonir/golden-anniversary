import { defineConfig } from 'drizzle-kit'
import { env } from '~/env'

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  out: './drizzle',
  dbCredentials: {
    url: `postgresql://postgres:${env.DATABASE_PASSWORD}@db.${env.PROJECT_ID}.supabase.co:5432/postgres`,
  },
})
