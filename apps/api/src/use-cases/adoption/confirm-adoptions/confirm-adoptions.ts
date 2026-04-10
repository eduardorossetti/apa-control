import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { AnimalHistory } from '@/entities'
import type { AdoptionRepository } from '@/repositories/adoption.repository'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import type { ConfirmAdoptionsData } from './confirm-adoptions.dto'

export class ConfirmAdoptionsUseCase {
  constructor(
    private adoptionRepository: AdoptionRepository,
    private animalRepository: AnimalRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: ConfirmAdoptionsData, employeeId: number): Promise<void> {
    const adoptions = await this.adoptionRepository.findByIds(data.ids)

    await db.transaction(async (tx) => {
      await this.adoptionRepository.confirmByIds(data.ids, tx)

      for (const adoption of adoptions) {
        await this.animalRepository.update(adoption.animalId, { status: AnimalStatus.INACTIVE }, tx)
        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId: adoption.animalId,
            rescueId: null,
            employeeId,
            type: AnimalHistoryType.ADOPTION,
            action: 'adoption.completed',
            description: 'Adoção concluída',
            oldValue: null,
            newValue: null,
            createdAt: new Date(),
          }),
          tx,
        )
      }
    })
  }
}
