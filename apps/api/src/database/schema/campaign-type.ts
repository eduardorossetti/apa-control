import { boolean, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { campaignCategoryEnum } from './enums'

export const campaignType = pgTable('campaign_type', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull().unique(),
  description: text(),
  category: campaignCategoryEnum().notNull(),
  active: boolean().notNull().default(true),
  createdAt: timestamp().notNull(),
})
