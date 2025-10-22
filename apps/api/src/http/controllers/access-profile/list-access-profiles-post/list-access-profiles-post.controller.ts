import { makeListAccessProfilesPostUseCase } from '@/use-cases/access-profile/list-access-profiles-post/list-access-profiles.factory'
import { apiQuerySchema } from '@/utils/drizzle/api-query-schema'

import type { FastifyRequest } from 'fastify'

export async function listAccessProfilesPostController(request: FastifyRequest) {
  const data = apiQuerySchema.parse(request.body)
  const listAccessProfilesUseCase = makeListAccessProfilesPostUseCase()

  const result = await listAccessProfilesUseCase.execute(data)
  return result
}
