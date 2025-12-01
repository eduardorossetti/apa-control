import { db } from '@/database/client'
import { clinicalProcedure, procedureType } from '@/database/schema'
import type { DrizzleTransaction } from '@/database/types'
import type { ProcedureType } from '@/entities'
import type {
  ListProcedureTypesDTO,
  ListProcedureTypesData,
} from '@/use-cases/procedure-type/list-procedure-types/list-procedure-types.dto'
import { ApiError } from '@/utils/api-error'
import type { ApiQuery } from '@/utils/drizzle/api-query-schema'
import { type QuerySettings, getPager, querify } from '@/utils/drizzle/querify'
import { type QueryStringSettings, querifyString } from '@/utils/drizzle/querify-string'
import { type SQL, eq, ilike, inArray } from 'drizzle-orm'

const querifyStringSettings: QueryStringSettings = {
  table: procedureType,
  initialOrderBy: procedureType.name,
}

const querifySettings: QuerySettings = {
  table: procedureType,
  initialOrderBy: procedureType.name,
}

export class ProcedureTypeRepository {
  async hasName(name: string) {
    const count = await db.$count(procedureType, eq(procedureType.name, name))
    return count > 0
  }

  async create(data: ProcedureType) {
    const [result] = await db.insert(procedureType).values(data).returning({ id: procedureType.id })

    return result
  }

  async update(id: number, data: Partial<ProcedureType>) {
    await db.update(procedureType).set(data).where(eq(procedureType.id, id))
  }

  async list(data: ListProcedureTypesData): Promise<[number, ListProcedureTypesDTO[]]> {
    const { name, categoryIds } = data
    const whereList: SQL[] = []

    if (name) {
      whereList.push(ilike(procedureType.name, `%${name}%`))
    }

    if (categoryIds?.length) {
      whereList.push(inArray(procedureType.category, categoryIds))
    }

    const [sqlQuery, countQuery] = querifyString<ListProcedureTypesDTO>(data, whereList, querifyStringSettings)

    const items = await sqlQuery
    const [{ total }] = await countQuery

    return [total, items] as const
  }

  async listPost(query: ApiQuery) {
    const [sqlQuery, countQuery] = querify<ProcedureType>(query, querifySettings)
    const [items, [{ total }]] = await Promise.all([sqlQuery, countQuery])
    return { items, pager: getPager(query, total) }
  }

  async remove(id: number, dbTransaction: DrizzleTransaction) {
    await dbTransaction.delete(procedureType).where(eq(procedureType.id, id))
  }

  async findById(id: number) {
    const [first] = await db
      .select({
        id: procedureType.id,
        name: procedureType.name,
        description: procedureType.description,
        category: procedureType.category,
        averageCost: procedureType.averageCost,
        active: procedureType.active,
        createdAt: procedureType.createdAt,
      })
      .from(procedureType)
      .where(eq(procedureType.id, id))
      .limit(1)

    if (!first) {
      return null
    }

    return first
  }

  async findByIdOrThrow(id: number) {
    const [first] = await db
      .select({
        id: procedureType.id,
        name: procedureType.name,
        description: procedureType.description,
        category: procedureType.category,
        averageCost: procedureType.averageCost,
        active: procedureType.active,
        createdAt: procedureType.createdAt,
      })
      .from(procedureType)
      .where(eq(procedureType.id, id))
      .limit(1)

    if (!first) {
      throw new ApiError('Tipo de procedimento não encontrado.', 404)
    }

    return first
  }

  async countByProcedureTypeId(procedureTypeId: number, dbTransaction: DrizzleTransaction | null) {
    const connection = dbTransaction ?? db
    const count = await connection.$count(clinicalProcedure, eq(clinicalProcedure.procedureTypeId, procedureTypeId))
    return count
  }
}
