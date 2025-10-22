import { aliasedTable, eq } from 'drizzle-orm'

import { module } from '@/database/schema'
import type { Module } from '@/entities'
import { querify } from '@/utils/drizzle/querify'

export class ModuleRepository {
  findAll() {
    const parentModule = aliasedTable(module, 'parent')

    const [sqlQuery] = querify<Module>(
      { fields: ['id', 'title', 'parentId', 'parentTitle'], page: 1, perPage: 10, usePager: false },
      {
        table: module,
        initialOrderBy: module.title,
        includes: [[parentModule, eq(parentModule.id, module.parentId)]],
        customFields: { parentTitle: parentModule.title },
      },
    )

    return sqlQuery
  }
}
