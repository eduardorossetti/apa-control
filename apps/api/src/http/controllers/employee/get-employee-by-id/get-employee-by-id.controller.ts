import { makeGetEmployeeByIdUseCase } from '@/use-cases/employee/get-employee-by-id/get-employee-by-id.factory'
import type { FastifyRequest } from 'fastify'
import { getEmployeeByIdSchema } from './get-employee-by-id.schema'

export async function getEmployeeByIdController(request: FastifyRequest) {
  const { id } = getEmployeeByIdSchema.parse(request.params)

  const getEmployeeByIdUseCase = makeGetEmployeeByIdUseCase()
  const result = await getEmployeeByIdUseCase.execute({ id })

  return result
}
