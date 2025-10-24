import { makeCreateEmployeeUseCase } from '@/use-cases/employee/create-employee/create-employee.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { createEmployeeSchema } from './create-employee.schema'

export async function createEmployeeController(request: FastifyRequest, reply: FastifyReply) {
  const data = createEmployeeSchema.parse(request.body)
  const createEmployeeUseCase = makeCreateEmployeeUseCase()

  const id = await createEmployeeUseCase.execute(data)
  return reply.status(201).send({ id })
}
