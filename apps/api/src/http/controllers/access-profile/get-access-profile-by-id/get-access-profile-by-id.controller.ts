import { makeGetAccessProfileByIdUseCase } from '@/use-cases/access-profile/get-access-profile-by-id/get-access-profile-by-id.factory'
import type { FastifyRequest } from 'fastify'
import { getAccessProfileByIdSchema } from './get-access-profile-by-id.schema'

export async function getAccessProfileByIdController(request: FastifyRequest) {
  const { id } = getAccessProfileByIdSchema.parse(request.params)

  const getAccessProfileByIdUseCase = makeGetAccessProfileByIdUseCase()
  const result = await getAccessProfileByIdUseCase.execute({ id })

  return result
}
