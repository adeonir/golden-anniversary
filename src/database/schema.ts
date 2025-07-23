import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const photos = pgTable('photos', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title'),
  filePath: text('file_path').notNull(),
  orderPosition: integer('order_position').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
