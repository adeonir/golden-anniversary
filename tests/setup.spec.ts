/**
 * Test setup validation
 * Validates PGlite database setup is working correctly
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { testDb } from './mocks/database'
import { cleanTestDatabase, initializeTestDatabase } from './utils/database'

describe('Database Setup Validation', () => {
  beforeEach(async () => {
    await initializeTestDatabase()
    await cleanTestDatabase()
  })

  it('should have a valid PGlite database instance', () => {
    expect(testDb).toBeDefined()
    expect(testDb.select).toBeDefined()
    expect(testDb.insert).toBeDefined()
    expect(testDb.update).toBeDefined()
    expect(testDb.delete).toBeDefined()
  })

  it('should initialize database tables correctly', async () => {
    // Test that initialization functions work without errors
    await expect(initializeTestDatabase()).resolves.not.toThrow()
    await expect(cleanTestDatabase()).resolves.not.toThrow()
  })
})
