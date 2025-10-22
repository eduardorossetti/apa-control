import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { appointment } from './appointment'

export const anamnesis = pgTable('anamnesis', {
  id: serial().primaryKey(),
  appointmentId: integer()
    .notNull()
    .unique()
    .references(() => appointment.id),
  symptomsPresented: text().notNull(),
  dietaryHistory: text(),
  behavioralHistory: text(),
  requestedExams: text(),
  presumptiveDiagnosis: text(),
  observations: text(),
  createdAt: timestamp().notNull(),
})
