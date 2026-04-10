import { db } from '@/database/client'
import { AdoptionStatus } from '@/database/schema/enums/adoption-status'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { AnimalHistory } from '@/entities'
import type { AdoptionRepository } from '@/repositories/adoption.repository'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import { ApiError } from '@/utils/api-error'
import type { ConfirmAdoptionData } from './confirm-adoption.dto'

export class ConfirmAdoptionUseCase {
  constructor(
    private adoptionRepository: AdoptionRepository,
    private animalRepository: AnimalRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute({ id, employeeId }: ConfirmAdoptionData): Promise<void> {
    const existing = await this.adoptionRepository.findByIdOrThrow(id)

    if (existing.status === AdoptionStatus.CANCELLED) {
      throw new ApiError('Não é possível confirmar uma adoção cancelada.', 400)
    }

    await db.transaction(async (tx) => {
      await this.adoptionRepository.update(
        id,
        {
          status: AdoptionStatus.COMPLETED,
          animalDepartureDate: new Date().toISOString().slice(0, 10),
          employeeId,
        },
        tx,
      )
      await this.animalRepository.update(existing.animalId, { status: AnimalStatus.INACTIVE }, tx)
      await this.animalHistoryRepository.create(
        new AnimalHistory({
          animalId: existing.animalId,
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
    })
  }
}
