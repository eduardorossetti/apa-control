import { makeGetAnimalByIdUseCase } from '@/use-cases/animal/get-animal-by-id/get-animal-by-id.factory'
import type { FastifyRequest } from 'fastify'
import { getAnimalByIdSchema } from './get-animal-by-id.schema'

export async function getAnimalByIdController(request: FastifyRequest) {
  const { id } = getAnimalByIdSchema.parse(request.params)

  const getAnimalByIdUseCase = makeGetAnimalByIdUseCase()
  const result = await getAnimalByIdUseCase.execute({ id })

  return result
}
