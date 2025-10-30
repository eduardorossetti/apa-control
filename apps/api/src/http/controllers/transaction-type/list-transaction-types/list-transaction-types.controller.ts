import { makeListTransactionTypesUseCase } from '@/use-cases/transaction-type/list-transaction-types/list-transaction-types.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { listTransactionTypesSchema } from './list-transaction-types.schema'

export async function listTransactionTypesController(request: FastifyRequest, reply: FastifyReply) {
  const data = listTransactionTypesSchema.parse(request.query)
  const listTransactionTypesUseCase = makeListTransactionTypesUseCase()
  const [count, items] = await listTransactionTypesUseCase.execute(data)

  reply.header('X-Total-Count', count)

  return items
}
