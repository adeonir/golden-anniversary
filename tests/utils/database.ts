/**
 * Database testing utilities using PGlite in-memory database
 * Following Drizzle ORM testing best practices
 * @see https://orm.drizzle.team/docs/get-started/pglite-new
 */
import { sql } from 'drizzle-orm'
import * as schema from '~/lib/database/schema'
import { testDb } from '../mocks/database'

/**
 * Initialize test database with schema
 * Creates all necessary tables for testing
 */
export async function initializeTestDatabase() {
  // Create tables - PGlite starts empty
  await testDb.execute(sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await testDb.execute(sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await testDb.execute(sql`
    CREATE TABLE IF NOT EXISTS photos (
      id SERIAL PRIMARY KEY,
      filename TEXT NOT NULL,
      title TEXT,
      url TEXT NOT NULL,
      file_id TEXT UNIQUE NOT NULL,
      size INTEGER NOT NULL,
      category TEXT CHECK (category IN ('memory', 'event')) NOT NULL,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

/**
 * Clean test database
 * Removes all data from tables
 */
export async function cleanTestDatabase() {
  await testDb.execute(sql`TRUNCATE TABLE photos, messages, users RESTART IDENTITY CASCADE`)
}

/**
 * Get test data from database
 * Simple utility to query all tables
 */
export async function getTestData() {
  const users = await testDb.select().from(schema.users)
  const messages = await testDb.select().from(schema.messages)
  const photos = await testDb.select().from(schema.photos)

  return {
    users,
    messages,
    photos,
  }
}

/**
 * Create test user using real database operations
 */
export async function createTestUser(userData: { email: string; password: string }) {
  const [user] = await testDb.insert(schema.users).values(userData).returning()

  return user
}

/**
 * Create test message using real database operations
 */
export async function createTestMessage(messageData: {
  name: string
  message: string
  status: 'pending' | 'approved' | 'rejected'
}) {
  const [message] = await testDb.insert(schema.messages).values(messageData).returning()

  return message
}

/**
 * Create test photo using real database operations
 */
export async function createTestPhoto(photoData: {
  filename: string
  title?: string
  url: string
  fileId: string
  size: number
  category: 'memory' | 'event'
  order?: number
}) {
  const [photo] = await testDb.insert(schema.photos).values(photoData).returning()

  return photo
}
