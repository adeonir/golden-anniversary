import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const messageStatusEnum = pgEnum('message_status', ['pending', 'approved', 'rejected'])
export const photoCategoryEnum = pgEnum('photo_category', ['memory', 'event'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  status: messageStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const photos = pgTable('photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  filename: text('filename').notNull(),
  title: text('title'),
  url: text('url').notNull(),
  size: integer('size').notNull(),
  order: integer('order').notNull().default(0),
  category: photoCategoryEnum('category').notNull().default('memory'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type Message = typeof messages.$inferSelect
export type NewMessage = typeof messages.$inferInsert

export type Photo = typeof photos.$inferSelect
export type NewPhoto = typeof photos.$inferInsert
