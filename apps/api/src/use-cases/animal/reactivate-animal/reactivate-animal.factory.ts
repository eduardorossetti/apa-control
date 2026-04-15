import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { FinalDestinationRepository } from '@/repositories/final-destination.repository'
import { RescueRepository } from '@/repositories/rescue.repository'
import { ReactivateAnimalUseCase } from './reactivate-animal'

export function makeReactivateAnimalUseCase() {
  const animalRepository = new AnimalRepository()
  const finalDestinationRepository = new FinalDestinationRepository()
  const animalHistoryRepository = new AnimalHistoryRepository()
  const rescueRepository = new RescueRepository()
  return new ReactivateAnimalUseCase(
    animalRepository,
    finalDestinationRepository,
    animalHistoryRepository,
    rescueRepository,
  )
}
