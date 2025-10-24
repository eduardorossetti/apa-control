import { makeUpdateEmployeeUseCase } from '@/use-cases/employee/update-employee/update-employee.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { updateEmployeeSchema } from './update-employee.schema'

export async function updateEmployeeController(request: FastifyRequest, reply: FastifyReply) {
  const data = updateEmployeeSchema.parse(request.body)

  const updateEmployeeUseCase = makeUpdateEmployeeUseCase()
  await updateEmployeeUseCase.execute(data)

  return reply.status(204).send()
}
