import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { AnimalHistory, Rescue } from '@/entities'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import type { FinalDestinationRepository } from '@/repositories/final-destination.repository'
import type { RescueRepository } from '@/repositories/rescue.repository'
import { ApiError } from '@/utils/api-error'
import { timeZoneName } from '@/utils/time-zone'
import { tz } from '@date-fns/tz'
import { parseISO, startOfDay } from 'date-fns'
import type { ReactivateAnimalData } from './reactivate-animal.dto'

export class ReactivateAnimalUseCase {
  constructor(
    private animalRepository: AnimalRepository,
    private finalDestinationRepository: FinalDestinationRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
    private rescueRepository: RescueRepository,
  ) {}

  async execute(data: ReactivateAnimalData): Promise<void> {
    const animal = await this.animalRepository.findById(data.id)
    if (!animal) throw new ApiError('Animal não encontrado.', 404)
    if (animal.status !== 'inativo') throw new ApiError('Apenas animais inativos podem ser reativados.', 400)

    await db.transaction(async (tx) => {
      await this.finalDestinationRepository.deleteByAnimalId(data.id, tx)
      await this.animalRepository.update(data.id, { status: 'ativo', rescueAt: new Date() }, tx)

      if (data.rescue) {
        const [rescueRow] = await this.rescueRepository.create(
          new Rescue({
            animalId: data.id,
            employeeId: data.employeeId,
            rescueDate: startOfDay(parseISO(data.rescue.rescueDate, { in: tz(timeZoneName.SP) }), {
              in: tz(timeZoneName.SP),
            }),
            locationFound: data.rescue.locationFound,
            circumstances: data.rescue.circumstances,
            foundConditions: data.rescue.foundConditions,
            immediateProcedures: data.rescue.immediateProcedures ?? null,
            observations: data.rescue.observations ?? null,
            createdAt: new Date(),
          }),
          tx,
        )

        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId: data.id,
            rescueId: rescueRow!.id,
            employeeId: data.employeeId,
            type: AnimalHistoryType.RESCUE,
            action: 'rescue.created',
            description: 'Retorno à instituição registrado',
            oldValue: null,
            newValue: null,
            createdAt: new Date(),
          }),
          tx,
        )
      } else {
        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId: data.id,
            rescueId: null,
            employeeId: data.employeeId,
            type: AnimalHistoryType.REGISTRATION,
            action: 'animal.reactivated',
            description: 'Animal reativado',
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
