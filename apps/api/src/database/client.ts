import { env } from '@/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

import * as schema from './schema'

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  min: 2,
  max: 20,
  idleTimeoutMillis: 1000 * 60 * 5,
  connectionTimeoutMillis: 1000 * 5,

  statement_timeout: 1000 * 60,
  query_timeout: 1000 * 60,

  keepAlive: true,
  allowExitOnIdle: true,
  keepAliveInitialDelayMillis: 10000,
  application_name: 'apa-control-api',
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: true } : false,
})

const db = drizzle(pool, { schema, casing: 'snake_case' })

export { db, pool }
