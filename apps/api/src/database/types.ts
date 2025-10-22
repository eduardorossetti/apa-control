import type { ExtractTablesWithRelations } from 'drizzle-orm'
import type { NodePgQueryResultHKT } from 'drizzle-orm/node-postgres'
import type { PgTransaction } from 'drizzle-orm/pg-core'
import type * as schema from './schema'

type Schema = typeof schema

export type DrizzleTransaction = PgTransaction<NodePgQueryResultHKT, Schema, ExtractTablesWithRelations<Schema>>
