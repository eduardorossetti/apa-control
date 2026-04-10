import { AdopterRepository } from '@/repositories/adopter.repository'
import { AdoptionRepository } from '@/repositories/adoption.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { CreateAdoptionUseCase } from './create-adoption'

export function makeCreateAdoptionUseCase() {
  return new CreateAdoptionUseCase(
    new AdoptionRepository(),
    new AnimalRepository(),
    new AdopterRepository(),
    new AnimalHistoryRepository(),
  )
}
