import { db } from '@/database/client'
import { transactionType } from '@/database/schema'
import type { DrizzleTransaction } from '@/database/types'
import type { TransactionType } from '@/entities'
import type {
  ListTransactionTypesDTO,
  ListTransactionTypesData,
} from '@/use-cases/transaction-type/list-transaction-types/list-transaction-types.dto'
import { ApiError } from '@/utils/api-error'
import type { ApiQuery } from '@/utils/drizzle/api-query-schema'
import { type QuerySettings, getPager, querify } from '@/utils/drizzle/querify'
import { type QueryStringSettings, querifyString } from '@/utils/drizzle/querify-string'
import { type SQL, eq, ilike, inArray } from 'drizzle-orm'

const querifyStringSettings: QueryStringSettings = {
  table: transactionType,
  initialOrderBy: transactionType.name,
}

const querifySettings: QuerySettings = {
  table: transactionType,
  initialOrderBy: transactionType.name,
}

export class TransactionTypeRepository {
  async hasName(name: string) {
    const count = await db.$count(transactionType, eq(transactionType.name, name))
    return count > 0
  }

  async create(data: TransactionType) {
    const [result] = await db.insert(transactionType).values(data).returning({ id: transactionType.id })

    return result
  }

  async update(id: number, data: Partial<TransactionType>) {
    await db.update(transactionType).set(data).where(eq(transactionType.id, id))
  }

  async list(data: ListTransactionTypesData): Promise<[number, ListTransactionTypesDTO[]]> {
    const { name, categoryIds } = data
    const whereList: SQL[] = []

    if (name) {
      whereList.push(ilike(transactionType.name, `%${name}%`))
    }

    if (categoryIds?.length) {
      whereList.push(inArray(transactionType.category, categoryIds))
    }

    const [sqlQuery, countQuery] = querifyString<ListTransactionTypesDTO>(data, whereList, querifyStringSettings)

    const items = await sqlQuery
    const [{ total }] = await countQuery

    return [total, items] as const
  }

  async listPost(query: ApiQuery) {
    const [sqlQuery, countQuery] = querify<TransactionType>(query, querifySettings)
    const [items, [{ total }]] = await Promise.all([sqlQuery, countQuery])
    return { items, pager: getPager(query, total) }
  }

  async remove(id: number, dbTransaction: DrizzleTransaction) {
    await dbTransaction.delete(transactionType).where(eq(transactionType.id, id))
  }

  async findById(id: number) {
    const [first] = await db
      .select({
        id: transactionType.id,
        name: transactionType.name,
        category: transactionType.category,
        description: transactionType.description,
        active: transactionType.active,
        createdAt: transactionType.createdAt,
      })
      .from(transactionType)
      .where(eq(transactionType.id, id))
      .limit(1)

    if (!first) {
      return null
    }

    return first
  }

  async findByIdOrThrow(id: number) {
    const [first] = await db
      .select({
        id: transactionType.id,
        name: transactionType.name,
        category: transactionType.category,
        description: transactionType.description,
        active: transactionType.active,
        createdAt: transactionType.createdAt,
      })
      .from(transactionType)
      .where(eq(transactionType.id, id))
      .limit(1)

    if (!first) {
      throw new ApiError('Tipo de transação não encontrado.', 404)
    }

    return first
  }
}
