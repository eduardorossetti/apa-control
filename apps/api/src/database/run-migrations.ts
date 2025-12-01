import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/node-postgres'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { Pool } from 'pg'

import { createDrizzleSchema } from './create-drizzle-schema'

config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  ssl: process.env.DATABASE_URL?.includes('sslmode=require') || process.env.NODE_ENV === 'production',
  max: 1,
})

async function runMigrations() {
  try {
    console.log('🔄 Criando schema drizzle...')
    await createDrizzleSchema(pool)

    console.log('🔄 Executando migrations...')
    const db = drizzle(pool)

    await migrate(db, { migrationsFolder: './src/database/migrations' })

    console.log('✅ Migrations concluídas com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao executar migrations:', error)
    throw error
  } finally {
    await pool.end()
  }
}

runMigrations()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
