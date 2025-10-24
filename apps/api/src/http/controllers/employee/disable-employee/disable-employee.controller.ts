import { makeDisableEmployeeUseCase } from '@/use-cases/employee/disable-employee/disable-employee.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { disableEmployeeSchema } from './disable-employee.schema'

export async function disableEmployeeController(request: FastifyRequest, reply: FastifyReply) {
  const data = disableEmployeeSchema.parse(request.body)

  const disableEmployeeUseCase = makeDisableEmployeeUseCase()
  await disableEmployeeUseCase.execute(data)

  return reply.status(204).send()
}
