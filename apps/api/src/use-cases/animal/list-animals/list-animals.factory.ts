import { AnimalRepository } from '@/repositories/animal.repository'
import { ListAnimalsUseCase } from './list-animals'

export function makeListAnimalsUseCase() {
  const animalRepository = new AnimalRepository()
  return new ListAnimalsUseCase(animalRepository)
}
