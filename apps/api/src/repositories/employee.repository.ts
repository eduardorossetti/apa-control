import { db } from '@/database/client'
import { employee } from '@/database/schema'
import { eq } from 'drizzle-orm'

type EmployeeSelectSchema = typeof employee.$inferSelect

export class EmployeeRepository {
  async findByLogin<K extends keyof EmployeeSelectSchema>(username: string, fields: K[]) {
    const selectFields = fields.reduce((acc, fieldName) => ({ ...acc, [fieldName]: employee[fieldName] }), {})
    const [first] = await db.select(selectFields).from(employee).where(eq(employee.login, username)).limit(1)

    if (!first) {
      return null
    }

    return first as Pick<EmployeeSelectSchema, K>
  }
}
