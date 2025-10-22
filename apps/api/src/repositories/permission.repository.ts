import { eq } from 'drizzle-orm'

import { db } from '@/database/client'
import { module, permission } from '@/database/schema'

import type { DrizzleTransaction } from '@/database/types'
import type { Permission } from '@/entities'

export class PermissionRepository {
  async getPermissionIds(profileId: number) {
    const permissions = await db
      .select({ moduleId: permission.moduleId })
      .from(permission)
      .where(eq(permission.profileId, profileId))

    return permissions.map((permission) => permission.moduleId)
  }

  async update(profileId: number, data: Permission[]) {
    await db.delete(permission).where(eq(permission.profileId, profileId))
    await db.insert(permission).values(data)
  }

  async remove(profileId: number, dbTransaction: DrizzleTransaction) {
    await dbTransaction.delete(permission).where(eq(permission.profileId, profileId))
  }

  async getPermissionRoles(profileId: number) {
    const roles = await db
      .select({ name: module.name })
      .from(permission)
      .innerJoin(module, eq(module.id, permission.moduleId))
      .where(eq(permission.profileId, profileId))

    return roles.map((role) => role.name)
  }
}
