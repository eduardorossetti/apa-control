import { boolean, date, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { adopter } from './adopter'
import { animal } from './animal'
import { employee } from './employee'
import { adoptionStatusEnum } from './enums'

export const adoption = pgTable('adoption', {
  id: serial().primaryKey(),
  animalId: integer()
    .notNull()
    .unique()
    .references(() => animal.id),
  adopterId: integer()
    .notNull()
    .references(() => adopter.id),
  employeeId: integer()
    .notNull()
    .references(() => employee.id),
  adoptionDate: date().notNull(),
  termSigned: boolean().notNull().default(false),
  adaptationPeriod: integer(),
  status: adoptionStatusEnum().notNull(),
  observations: text(),
  createdAt: timestamp().notNull(),
  updatedAt: timestamp(),
})
