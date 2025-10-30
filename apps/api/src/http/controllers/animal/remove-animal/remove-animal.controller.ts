import { makeRemoveAnimalUseCase } from '@/use-cases/animal/remove-animal/remove-animal.factory'
import type { FastifyRequest } from 'fastify'
import { removeAnimalSchema } from './remove-animal.schema'

export async function removeAnimalController(request: FastifyRequest) {
  const { id } = removeAnimalSchema.parse(request.params)

  const removeAnimalUseCase = makeRemoveAnimalUseCase()
  await removeAnimalUseCase.execute({ id })

  return { message: 'Animal removido com sucesso' }
}
