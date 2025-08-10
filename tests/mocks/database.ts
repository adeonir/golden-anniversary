/**
 * Test database client using PGlite (in-memory PostgreSQL)
 * Following Drizzle ORM testing best practices from official documentation
 * @see https://orm.drizzle.team/docs/get-started/pglite-new
 */
import { PGlite } from '@electric-sql/pglite'
import { drizzle } from 'drizzle-orm/pglite'
import * as schema from '~/lib/database/schema'

// Create in-memory PostgreSQL database using PGlite
// This provides a real database for testing without external dependencies
const client = new PGlite()
export const testDb = drizzle(client, { schema })

// Type the test database
export type TestDatabase = typeof testDb
