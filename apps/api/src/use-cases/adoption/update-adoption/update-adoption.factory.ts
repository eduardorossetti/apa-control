import { AdopterRepository } from '@/repositories/adopter.repository'
import { AdoptionRepository } from '@/repositories/adoption.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { UpdateAdoptionUseCase } from './update-adoption'

export function makeUpdateAdoptionUseCase() {
  return new UpdateAdoptionUseCase(new AdoptionRepository(), new AdopterRepository(), new AnimalHistoryRepository())
}
