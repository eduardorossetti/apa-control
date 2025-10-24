import { makeListAccessProfilesUseCase } from '@/use-cases/access-profile/list-access-profiles/list-access-profiles.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function listAccessProfilesController(_: FastifyRequest, reply: FastifyReply) {
  const listAccessProfilesUseCase = makeListAccessProfilesUseCase()
  const [count, items] = await listAccessProfilesUseCase.execute()

  reply.header('X-Total-Count', count)

  return items
}
