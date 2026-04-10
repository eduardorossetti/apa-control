import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { AnimalHistory } from '@/entities'
import type { AdoptionRepository } from '@/repositories/adoption.repository'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveAdoptionData } from './remove-adoption.dto'

export class RemoveAdoptionUseCase {
  constructor(
    private adoptionRepository: AdoptionRepository,
    private animalRepository: AnimalRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: RemoveAdoptionData, employeeId: number): Promise<void> {
    const existing = await this.adoptionRepository.findById(data.id)
    if (!existing) throw new ApiError('Adoção não encontrada.', 404)

    await db.transaction(async (tx) => {
      await this.adoptionRepository.delete(data.id, tx)
      await this.animalRepository.update(existing.animalId, { status: AnimalStatus.ACTIVE }, tx)
      await this.animalHistoryRepository.create(
        new AnimalHistory({
          animalId: existing.animalId,
          rescueId: null,
          employeeId,
          type: AnimalHistoryType.ADOPTION,
          action: 'adoption.deleted',
          description: 'Adoção removida',
          oldValue: null,
          newValue: null,
          createdAt: new Date(),
        }),
        tx,
      )
    })
  }
}
