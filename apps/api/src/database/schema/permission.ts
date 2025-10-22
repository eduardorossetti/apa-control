import { integer, pgTable, serial, uniqueIndex } from 'drizzle-orm/pg-core'
import { accessProfile } from './access-profile'
import { module } from './module'

export const permission = pgTable(
  'permission',
  {
    id: serial().primaryKey(),
    profileId: integer()
      .notNull()
      .references(() => accessProfile.id),
    moduleId: integer()
      .notNull()
      .references(() => module.id),
  },
  (table) => [uniqueIndex().on(table.profileId, table.moduleId)],
)
