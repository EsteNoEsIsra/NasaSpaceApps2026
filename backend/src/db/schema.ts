import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'

// ── Users ──────────────────────────────────────────────────────────────────
export const users = pgTable('users', {
  id:        uuid('id').primaryKey().defaultRandom(),
  email:     varchar('email', { length: 255 }).notNull().unique(),
  password:  varchar('password', { length: 255 }).notNull(),
  name:      varchar('name', { length: 100 }).notNull(),
  role:      varchar('role', { length: 20 }).notNull().default('user'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// ── Saved NASA items ───────────────────────────────────────────────────────
export const savedItems = pgTable('saved_items', {
  id:        uuid('id').primaryKey().defaultRandom(),
  userId:    uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type:      varchar('type', { length: 50 }).notNull(),   // 'apod' | 'mars' | etc
  nasaId:    varchar('nasa_id', { length: 100 }),
  title:     varchar('title', { length: 255 }),
  data:      text('data'),                                 // JSON blob
  isFavorite: boolean('is_favorite').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export type User         = typeof users.$inferSelect
export type NewUser      = typeof users.$inferInsert
export type SavedItem    = typeof savedItems.$inferSelect
export type NewSavedItem = typeof savedItems.$inferInsert
