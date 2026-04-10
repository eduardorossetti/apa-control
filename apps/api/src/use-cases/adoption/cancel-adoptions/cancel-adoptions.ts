import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { AnimalHistory } from '@/entities'
import type { AdoptionRepository } from '@/repositories/adoption.repository'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import type { CancelAdoptionsData } from './cancel-adoptions.dto'

export class CancelAdoptionsUseCase {
  constructor(
    private adoptionRepository: AdoptionRepository,
    private animalRepository: AnimalRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: CancelAdoptionsData, employeeId: number): Promise<void> {
    const adoptions = await this.adoptionRepository.findByIds(data.ids)

    await db.transaction(async (tx) => {
      await this.adoptionRepository.cancelByIds(data.ids, tx)

      for (const adoption of adoptions) {
        await this.animalRepository.update(adoption.animalId, { status: AnimalStatus.ACTIVE }, tx)
        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId: adoption.animalId,
            rescueId: null,
            employeeId,
            type: AnimalHistoryType.ADOPTION,
            action: 'adoption.cancelled',
            description: 'Adoção cancelada',
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
