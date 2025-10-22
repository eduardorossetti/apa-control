import { pgTable, serial, varchar } from 'drizzle-orm/pg-core'

export const accessProfile = pgTable('access_profile', {
  id: serial().primaryKey(),
  description: varchar({ length: 50 }).notNull(),
})
