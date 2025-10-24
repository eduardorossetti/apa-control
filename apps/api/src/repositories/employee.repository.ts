import { db } from '@/database/client'
import { accessProfile, employee } from '@/database/schema'
import type { DrizzleTransaction } from '@/database/types'
import type { Employee } from '@/entities'
import type { EmployeeWithDetails, ListEmployeesData } from '@/use-cases/employee/list-employees/list-employees.dto'
import { ApiError } from '@/utils/api-error'
import type { QuerySettings } from '@/utils/drizzle/querify'
import { type QueryStringSettings, querifyString } from '@/utils/drizzle/querify-string'
import { type SQL, eq, ilike, inArray, isNotNull, isNull } from 'drizzle-orm'

const querifyStringSettings: QueryStringSettings = {
  table: employee,
  initialOrderBy: employee.id,
  includes: [[accessProfile, eq(accessProfile.id, employee.profileId)]],
  customFields: {
    profileName: accessProfile.description,
  },
}

type EmployeeSelectSchema = typeof employee.$inferSelect

const querifySettings: QuerySettings = {
  table: employee,
  initialOrderBy: employee.name,
}

export class EmployeeRepository {
  async hasLogin(login: string) {
    const loginCount = await db.$count(employee, eq(employee.login, login))
    return loginCount > 0
  }

  create(data: Employee, dbTransaction: DrizzleTransaction | null) {
    const connection = dbTransaction ?? db
    return connection.insert(employee).values(data).returning({ id: employee.id })
  }

  async update(id: number, data: Partial<Employee>) {
    await db.update(employee).set(data).where(eq(employee.id, id))
  }

  async list(data: ListEmployeesData) {
    const { name, login, cpf, profileIds, show } = data
    const whereList: SQL[] = []

    if (name) {
      whereList.push(ilike(employee.name, `%${name}%`))
    }

    if (login) {
      whereList.push(ilike(employee.login, `%${login}%`))
    }

    if (cpf) {
      whereList.push(ilike(employee.cpf, `%${cpf}%`))
    }

    if (profileIds?.length) {
      whereList.push(inArray(employee.profileId, profileIds))
    }

    if (show === 'enabled') {
      whereList.push(isNull(employee.disabledAt))
    } else if (show === 'disabled') {
      whereList.push(isNotNull(employee.disabledAt))
    }

    const [sqlQuery, countQuery] = querifyString<EmployeeWithDetails>(data, whereList, querifyStringSettings)

    const items = await sqlQuery
    const [{ total }] = await countQuery

    return [total, items] as const
  }

  async findById(id: number) {
    const [item] = await db.select().from(employee).where(eq(employee.id, id))

    if (!item) {
      return null
    }

    return item
  }

  async findByIdCustom<K extends keyof EmployeeSelectSchema>(
    id: number,
    fields: K[],
    dbTransaction: DrizzleTransaction | null,
  ) {
    const connection = dbTransaction ?? db
    const selectFields = fields.reduce((acc, fieldName) => ({ ...acc, [fieldName]: employee[fieldName] }), {})
    const [item] = await connection.select(selectFields).from(employee).where(eq(employee.id, id)).limit(1)

    if (!item) {
      throw new ApiError('Funcionário não encontrado.', 404)
    }

    return item as Pick<EmployeeSelectSchema, K>
  }

  async findByLogin<K extends keyof EmployeeSelectSchema>(username: string, fields: K[]) {
    const selectFields = fields.reduce((acc, fieldName) => ({ ...acc, [fieldName]: employee[fieldName] }), {})
    const [item] = await db.select(selectFields).from(employee).where(eq(employee.login, username)).limit(1)

    if (!item) {
      return null
    }

    return item as Pick<EmployeeSelectSchema, K>
  }
}
