import { makeReactivateAnimalUseCase } from '@/use-cases/animal/reactivate-animal/reactivate-animal.factory'
import type { FastifyRequest } from 'fastify'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

export async function reactivateAnimalController(request: FastifyRequest) {
  const { id } = paramsSchema.parse(request.params)
  const { id: employeeId } = request.user

  const reactivateAnimalUseCase = makeReactivateAnimalUseCase()
  await reactivateAnimalUseCase.execute({ id, employeeId })

  return { message: 'Animal reativado com sucesso' }
}
