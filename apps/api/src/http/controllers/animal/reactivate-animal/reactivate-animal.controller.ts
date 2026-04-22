import { makeReactivateAnimalUseCase } from '@/use-cases/animal/reactivate-animal/reactivate-animal.factory'
import type { FastifyRequest } from 'fastify'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const bodySchema = z
  .object({
    rescue: z
      .object({
        rescueDate: z.string().min(1, 'Data do resgate é obrigatória'),
        locationFound: z.string().min(1, 'Local encontrado é obrigatório').max(200),
        circumstances: z.string().min(1, 'Circunstâncias são obrigatórias'),
        foundConditions: z.string().min(1, 'Condições em que foi encontrado é obrigatório'),
        immediateProcedures: z.string().nullish(),
        observations: z.string().nullish(),
      })
      .optional(),
  })
  .optional()

export async function reactivateAnimalController(request: FastifyRequest) {
  const { id } = paramsSchema.parse(request.params)
  const body = bodySchema.parse(request.body)
  const { id: employeeId } = request.user

  const reactivateAnimalUseCase = makeReactivateAnimalUseCase()
  await reactivateAnimalUseCase.execute({ id, employeeId, rescue: body?.rescue ?? undefined })

  return { message: 'Animal reativado com sucesso' }
}
