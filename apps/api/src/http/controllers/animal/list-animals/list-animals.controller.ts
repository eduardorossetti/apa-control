import { makeListAnimalsUseCase } from '@/use-cases/animal/list-animals/list-animals.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { listAnimalsSchema } from './list-animals.schema'

export async function listAnimalsController(request: FastifyRequest, reply: FastifyReply) {
  const data = listAnimalsSchema.parse(request.query)
  const listAnimalsUseCase = makeListAnimalsUseCase()
  const [count, items] = await listAnimalsUseCase.execute(data)

  reply.header('X-Total-Count', count)

  return items
}
