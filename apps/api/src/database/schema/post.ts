import { integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { employee } from './employee'
import { postStatusEnum, postTypeEnum } from './enums'

export const post = pgTable('post', {
  id: serial().primaryKey(),
  employeeId: integer()
    .notNull()
    .references(() => employee.id),
  title: varchar({ length: 200 }).notNull(),
  content: text().notNull(),
  type: postTypeEnum().notNull(),
  publicationDate: timestamp().notNull(),
  status: postStatusEnum().notNull(),
  relatedAnimals: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
})
