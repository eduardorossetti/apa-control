import { AdoptionRepository } from '@/repositories/adoption.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { RemoveAdoptionUseCase } from './remove-adoption'

export function makeRemoveAdoptionUseCase() {
  return new RemoveAdoptionUseCase(new AdoptionRepository(), new AnimalRepository(), new AnimalHistoryRepository())
}
