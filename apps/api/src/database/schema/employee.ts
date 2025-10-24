import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'
import { accessProfile } from './access-profile'

export const employee = pgTable('employee', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  login: varchar({ length: 50 }).notNull().unique(),
  cpf: varchar({ length: 11 }).notNull().unique(),
  email: varchar({ length: 255 }).unique(),
  passwordHash: varchar({ length: 255 }).notNull(),
  streetName: varchar({ length: 50 }),
  streetNumber: varchar({ length: 20 }),
  district: varchar({ length: 80 }),
  city: varchar({ length: 50 }),
  state: varchar({ length: 2 }),
  postalCode: varchar({ length: 8 }),
  complement: varchar({ length: 50 }),
  phone1: varchar({ length: 11 }),
  phone2: varchar({ length: 11 }),
  profileId: integer()
    .notNull()
    .references(() => accessProfile.id),
  createdAt: timestamp({ withTimezone: true }).notNull(),
  activedAt: timestamp({ withTimezone: true }),
  disabledAt: timestamp({ withTimezone: true }),
})
