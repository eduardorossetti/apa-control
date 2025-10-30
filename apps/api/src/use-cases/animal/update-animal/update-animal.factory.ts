import { AnimalRepository } from '@/repositories/animal.repository'
import { UpdateAnimalUseCase } from './update-animal'

export function makeUpdateAnimalUseCase() {
  const animalRepository = new AnimalRepository()
  return new UpdateAnimalUseCase(animalRepository)
}
