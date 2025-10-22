import { makeCreateAccessProfileUseCase } from '@/use-cases/access-profile/create-access-profile/create-access-profile.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { createAccessProfileSchema } from './create-access-profile.schema'

export async function createAccessProfileController(request: FastifyRequest, reply: FastifyReply) {
  const data = createAccessProfileSchema.parse(request.body)
  const createAccessProfileUseCase = makeCreateAccessProfileUseCase()

  const { id } = await createAccessProfileUseCase.execute(data)
  return reply.status(201).send({ id })
}
