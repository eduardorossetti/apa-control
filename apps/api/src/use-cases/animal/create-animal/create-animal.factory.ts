import { AnimalRepository } from '@/repositories/animal.repository'
import { CreateAnimalUseCase } from './create-animal'

export function makeCreateAnimalUseCase() {
  const animalRepository = new AnimalRepository()
  return new CreateAnimalUseCase(animalRepository)
}
