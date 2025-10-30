import { AnimalRepository } from '@/repositories/animal.repository'
import { GetAnimalByIdUseCase } from './get-animal-by-id'

export function makeGetAnimalByIdUseCase() {
  const animalRepository = new AnimalRepository()
  return new GetAnimalByIdUseCase(animalRepository)
}
