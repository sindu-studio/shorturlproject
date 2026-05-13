import { pgTable, integer, varchar, text, timestamp, unique, index } from 'drizzle-orm/pg-core';

export const shortenedLinks = pgTable(
  'shortened_links',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    shortCode: varchar('short_code', { length: 10 }).notNull(),
    originalUrl: text('original_url').notNull(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('unique_short_code').on(table.shortCode),
    index('idx_user_id').on(table.userId),
    index('idx_short_code').on(table.shortCode),
  ]
);
