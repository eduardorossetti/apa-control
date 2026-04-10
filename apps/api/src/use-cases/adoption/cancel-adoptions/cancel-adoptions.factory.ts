import { AdoptionRepository } from '@/repositories/adoption.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { CancelAdoptionsUseCase } from './cancel-adoptions'

export function makeCancelAdoptionsUseCase() {
  return new CancelAdoptionsUseCase(new AdoptionRepository(), new AnimalRepository(), new AnimalHistoryRepository())
}
