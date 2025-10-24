import { makeListEmployeesUseCase } from '@/use-cases/employee/list-employees/list-employees.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { listEmployeesSchema } from './list-employees.schema'

export async function listEmployeesController(request: FastifyRequest, reply: FastifyReply) {
  const data = listEmployeesSchema.parse(request.query)
  const listEmployeesUseCase = makeListEmployeesUseCase()
  const [count, items] = await listEmployeesUseCase.execute(data)

  reply.header('X-Total-Count', count)

  return items
}
