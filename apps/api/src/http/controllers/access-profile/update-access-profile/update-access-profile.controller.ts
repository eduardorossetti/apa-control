import { makeUpdateAccessProfileUseCase } from '@/use-cases/access-profile/update-access-profile/update-access-profile.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateAccessProfileSchema } from './update-access-profile.schema'

export async function updateAccessProfileController(request: FastifyRequest, reply: FastifyReply) {
  const data = updateAccessProfileSchema.parse(request.body)

  const updateAccessProfileUseCase = makeUpdateAccessProfileUseCase()
  await updateAccessProfileUseCase.execute(data)

  return reply.status(204).send()
}
