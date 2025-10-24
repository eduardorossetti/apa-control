import { db } from '@/database/client'
import { accessProfile, permission } from '@/database/schema'
import type { DrizzleTransaction } from '@/database/types'
import type { AccessProfile } from '@/entities'
import { ApiError } from '@/utils/api-error'
import { type QueryStringSettings, querifyString } from '@/utils/drizzle/querify-string'
import { eq } from 'drizzle-orm'

const querifyStringSettings: QueryStringSettings = {
  table: accessProfile,
  initialOrderBy: accessProfile.description,
}

export class AccessProfileRepository {
  async create(profile: AccessProfile, permissions: number[], dbTransaction: DrizzleTransaction | null) {
    const connection = dbTransaction ?? db
    const [profileReturn] = await connection.insert(accessProfile).values(profile).returning({ id: accessProfile.id })

    if (permissions.length) {
      await connection
        .insert(permission)
        .values(permissions.map((moduleId) => ({ moduleId, profileId: profileReturn.id })))
    }

    return profileReturn
  }

  async update(id: number, data: Partial<AccessProfile>) {
    await db.update(accessProfile).set(data).where(eq(accessProfile.id, id))
  }

  async list() {
    const [sqlQuery, countQuery] = querifyString<AccessProfile>({}, [], querifyStringSettings)

    const items = await sqlQuery
    const [{ total }] = await countQuery

    return [total, items] as const
  }

  async remove(id: number, dbTransaction: DrizzleTransaction) {
    await dbTransaction.delete(accessProfile).where(eq(accessProfile.id, id))
  }

  async findById(id: number, dbTransaction: DrizzleTransaction | null) {
    const connection = dbTransaction ?? db

    const [first] = await connection
      .select({
        id: accessProfile.id,
        description: accessProfile.description,
      })
      .from(accessProfile)
      .where(eq(accessProfile.id, id))
      .limit(1)

    if (!first) {
      return null
    }

    return first
  }

  async findByIdOrThrow(id: number) {
    const [first] = await db
      .select({
        id: accessProfile.id,
        description: accessProfile.description,
      })
      .from(accessProfile)
      .where(eq(accessProfile.id, id))
      .limit(1)

    if (!first) {
      throw new ApiError('Perfil não encontrado.', 404)
    }

    return first
  }
}
