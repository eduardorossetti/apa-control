import { foreignKey, integer, pgTable, varchar } from 'drizzle-orm/pg-core'

export const module = pgTable(
  'module',
  {
    id: integer().primaryKey(),
    name: varchar({ length: 120 }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    parentId: integer(),
  },
  (table) => [foreignKey({ columns: [table.parentId], foreignColumns: [table.id] })],
)
