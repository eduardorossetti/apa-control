import { parseISO } from 'date-fns'
import {
  type ColumnBaseConfig,
  type ColumnDataType,
  type SQL,
  and,
  asc,
  count,
  desc,
  eq,
  getTableColumns,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  lte,
  ne,
  notInArray,
  or,
  sql,
} from 'drizzle-orm'

import { db } from '@/database/client'

import type { DrizzleTransaction } from '@/database/types'
import type { ApiQuery, FilterItem } from '@/utils/drizzle/api-query-schema'
import type { PgColumn, PgSelectBase, PgTable, SelectedFields } from 'drizzle-orm/pg-core'

export type QuerySettings = {
  table: PgTable
  initialOrderBy: PgColumn
  excludeColumns?: string[]
  fixedOrderBy?: PgColumn | SQL
  includes?: Array<[table: PgTable, condition: SQL, options?: { innerJoin?: boolean }]>
  customFields?: Record<string, PgColumn | SQL>
  // biome-ignore lint/suspicious/noExplicitAny: idk why
  extraFilters?: Array<(value?: any) => SQL>
  dbTransaction?: DrizzleTransaction | null
}

export function getFilter(item: FilterItem, table: PgTable, customFields: Record<string, SQL | PgColumn>) {
  const field =
    (customFields[item.name.replace('.', '_')] as PgColumn) || (table[item.name as keyof typeof table] as PgColumn)
  const { comparer } = item

  let value = item.value

  if (field.dataType === 'date' && typeof value === 'string') {
    value = parseISO(value)
  }

  if (typeof value === 'number') {
    value = Math.min(value, 2147483647)
  }

  if (comparer === 'Like') {
    return ilike(
      sql`UNACCENT(${field})`,
      `%${String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')}%`,
    )
  }

  if (comparer === 'Contains' && Array.isArray(value)) {
    return inArray(field, value)
  }

  if (comparer === 'NotContains' && Array.isArray(value)) {
    return notInArray(field, value)
  }

  if (comparer === 'NotEquals') {
    return item.value === null ? isNotNull(field) : ne(field, value)
  }

  if (comparer === 'GreaterThan') {
    return gt(field, value)
  }

  if (comparer === 'GreaterThanOrEqual') {
    return gte(field, value)
  }

  if (comparer === 'LessThan') {
    return lt(field, value)
  }

  if (comparer === 'LessThanOrEqual') {
    return lte(field, value)
  }

  return item.value === null ? isNull(field) : eq(field, value)
}

export function getPager(query: ApiQuery, records: number): Pager {
  const perPage = query.perPage || 10
  return {
    records,
    page: query.page || 1,
    perPage,
    usePager: query.usePager ?? true,
    pages: query.usePager ? Math.ceil(records / perPage) : 1,
  }
}

export function querify<T>(
  query: ApiQuery,
  settings: QuerySettings,
  ...args: unknown[]
): [sqlQuery: Promise<T[]>, countQuery: Promise<Array<{ total: number }>>] {
  let sqlQuery: PgSelectBase<
    string,
    SelectedFields,
    'partial',
    Record<string, 'not-null'>,
    false,
    never,
    Array<{ [x: string]: unknown }>,
    { [x: string]: never }
  >

  query.page = query.page || 1
  query.perPage = query.perPage || 10

  const sqlFilters: Array<SQL | undefined> = []

  const sort = query.sort || []
  const filters = query.filters || []
  const fields = query.fields || []
  const { page, perPage, usePager } = query

  const extraFilters = settings.extraFilters || []
  const includes = settings.includes || []
  const { customFields = {}, excludeColumns = [], initialOrderBy, fixedOrderBy, dbTransaction } = settings
  const connection = dbTransaction ?? db

  if (fields.length) {
    sqlQuery = connection
      .select(
        fields
          .filter((field) => !excludeColumns.includes(field))
          .reduce((acc, field) => {
            const customValue = customFields[field]

            if (customValue) {
              acc[field] = customValue
            } else if (field in settings.table) {
              acc[field] = settings.table[field as keyof typeof settings.table] as PgColumn
            }

            return acc
          }, {} as SelectedFields),
      )
      .from(settings.table)
  } else {
    const allColumns: Record<string, SQL | PgColumn<ColumnBaseConfig<ColumnDataType, string>>> = getTableColumns(
      settings.table,
    )

    const columns = Object.entries(allColumns)
      .filter(([key]) => !excludeColumns.includes(key))
      .concat(Object.entries(customFields))
      .reduce(
        (acc, [key, value]) => ({ ...acc, [key]: value }),
        {} as Record<string, SQL | PgColumn<ColumnBaseConfig<ColumnDataType, string>>>,
      )

    sqlQuery = connection.select(columns).from(settings.table)
  }

  const countQuery = connection.select({ total: count() }).from(settings.table)

  if (includes.length) {
    for (const [table, condition, options = {}] of includes) {
      if (options.innerJoin) {
        sqlQuery.innerJoin(table, condition)
        countQuery.innerJoin(table, condition)
      } else {
        sqlQuery.leftJoin(table, condition)
        countQuery.leftJoin(table, condition)
      }
    }
  }

  if (filters.length) {
    for (const group of filters) {
      if (group?.items) {
        const groupFilters: SQL[] = []

        for (const filter of group.items) {
          groupFilters.push(getFilter(filter, settings.table, customFields))
        }

        if (group.kind?.toLowerCase() === 'or') {
          sqlFilters.push(or(...groupFilters))
        } else {
          sqlFilters.push(and(...groupFilters))
        }
      }
    }
  }

  if (extraFilters.length) {
    extraFilters.forEach((extraFilter, index) => {
      sqlFilters.push(extraFilter(args[index]))
    })
  }

  sqlQuery.where(and(...sqlFilters))
  countQuery.where(and(...sqlFilters))

  if (fixedOrderBy) {
    sqlQuery.orderBy(fixedOrderBy)
  } else if (sort.length) {
    const orderings: SQL[] = []

    for (const item of sort) {
      const order = (item.order || 'asc').toLowerCase()
      const customValue = customFields[item.name]
      const fn = order === 'asc' ? asc : desc

      if (customValue) {
        orderings.push(fn(customValue))
      } else if (item.name in settings.table) {
        orderings.push(fn(settings.table[item.name as keyof typeof settings.table] as PgColumn))
      }
    }

    sqlQuery.orderBy(...orderings)
  } else {
    sqlQuery.orderBy(initialOrderBy)
  }

  if (usePager) {
    sqlQuery.limit(perPage).offset((page - 1) * perPage)
  }

  return [sqlQuery as unknown as Promise<T[]>, countQuery]
}
