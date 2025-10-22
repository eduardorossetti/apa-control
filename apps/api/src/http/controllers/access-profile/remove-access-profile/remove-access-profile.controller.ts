import { db } from '@/database/client'
import { makeRemoveAccessProfileUseCase } from '@/use-cases/access-profile/remove-access-profile/remove-access-profile.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { removeAccessProfileSchema } from './remove-access-profile.schema'

export async function removeAccessProfileController(request: FastifyRequest, reply: FastifyReply) {
  const { id } = removeAccessProfileSchema.parse(request.params)

  const removeAccessProfileUseCase = makeRemoveAccessProfileUseCase()
  await db.transaction((dbTransaction) => removeAccessProfileUseCase.execute({ id }, dbTransaction))

  return reply.status(204).send()
}
