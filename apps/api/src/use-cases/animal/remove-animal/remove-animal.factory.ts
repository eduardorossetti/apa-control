import { AnimalRepository } from '@/repositories/animal.repository'
import { RemoveAnimalUseCase } from './remove-animal'

export function makeRemoveAnimalUseCase() {
  const animalRepository = new AnimalRepository()
  return new RemoveAnimalUseCase(animalRepository)
}
