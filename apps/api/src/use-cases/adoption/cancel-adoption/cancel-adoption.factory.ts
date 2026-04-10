import { AdoptionRepository } from '@/repositories/adoption.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { CancelAdoptionUseCase } from './cancel-adoption'

export function makeCancelAdoptionUseCase() {
  return new CancelAdoptionUseCase(new AdoptionRepository(), new AnimalRepository(), new AnimalHistoryRepository())
}
