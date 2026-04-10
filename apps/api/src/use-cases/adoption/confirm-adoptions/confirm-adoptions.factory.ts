import { AdoptionRepository } from '@/repositories/adoption.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { ConfirmAdoptionsUseCase } from './confirm-adoptions'

export function makeConfirmAdoptionsUseCase() {
  return new ConfirmAdoptionsUseCase(new AdoptionRepository(), new AnimalRepository(), new AnimalHistoryRepository())
}
