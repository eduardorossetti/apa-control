import { AdoptionRepository } from '@/repositories/adoption.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { ConfirmAdoptionUseCase } from './confirm-adoption'

export function makeConfirmAdoptionUseCase() {
  return new ConfirmAdoptionUseCase(new AdoptionRepository(), new AnimalRepository(), new AnimalHistoryRepository())
}
