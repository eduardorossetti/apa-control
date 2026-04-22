import { index, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { employee } from './employee'
import { reminderEntityTypeEnum } from './enums/pg-enums'

export const reminder = pgTable(
  'reminder',
  {
    id: serial().primaryKey(),
    entityType: reminderEntityTypeEnum().notNull(),
    entityId: integer().notNull(),
    employeeId: integer()
      .notNull()
      .references(() => employee.id),
    title: varchar({ length: 255 }).notNull(),
    message: text().notNull(),
    readAt: timestamp({ withTimezone: true }),
    createdAt: timestamp({ withTimezone: true }).notNull(),
  },
  (table) => [index().on(table.employeeId, table.createdAt), index().on(table.entityType, table.entityId)],
)
