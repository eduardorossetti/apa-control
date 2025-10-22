import { boolean, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const finalDestinationType = pgTable('final_destination_type', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  description: text(),
  requiresApproval: boolean().notNull().default(false),
  active: boolean().notNull().default(true),
  createdAt: timestamp().notNull(),
})
