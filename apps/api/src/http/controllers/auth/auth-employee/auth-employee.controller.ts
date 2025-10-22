import { makeAuthEmployeeUseCase } from '@/use-cases/auth-employee/auth-employee.factory'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { authEmployeeSchema } from './auth-employee.schema'

export async function authEmployeeController(request: FastifyRequest, reply: FastifyReply) {
  const data = authEmployeeSchema.parse(request.body)
  const authEmployeeUseCase = makeAuthEmployeeUseCase()

  const result = await authEmployeeUseCase.execute(data)
  return reply.status(200).send(result)
}
