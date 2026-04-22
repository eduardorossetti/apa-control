import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { ProcedureStatus } from '@/database/schema/enums/procedure-status'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import { AnimalHistory } from '@/entities'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import type { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveClinicalProcedureData } from './remove-clinical-procedure.dto'

export class RemoveClinicalProcedureUseCase {
  constructor(
    private clinicalProcedureRepository: ClinicalProcedureRepository,
    private reminderRepository: ReminderRepository,
    private procedureTypeRepository: ProcedureTypeRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: RemoveClinicalProcedureData, employeeId: number): Promise<void> {
    const existing = await this.clinicalProcedureRepository.findById(data.id)
    if (!existing) throw new ApiError('Procedimento clínico não encontrado.', 404)
    if (existing.status !== ProcedureStatus.SCHEDULED) {
      throw new ApiError('Apenas procedimentos clínicos agendados podem ser removidos.', 409)
    }
    const procedureType = await this.procedureTypeRepository.findById(existing.procedureTypeId)

    await db.transaction(async (tx) => {
      await this.reminderRepository.deleteByEntity(ReminderEntityType.PROCEDURE, [data.id], tx)
      await this.clinicalProcedureRepository.delete(data.id, tx)

      await this.animalHistoryRepository.create(
        new AnimalHistory({
          animalId: existing.animalId,
          rescueId: null,
          employeeId,
          type: AnimalHistoryType.PROCEDURE,
          action: 'clinical-procedure.deleted',
          description: `Procedimento ${procedureType?.name ?? `#${existing.procedureTypeId}`} removido`,
          oldValue: null,
          newValue: null,
          createdAt: new Date(),
        }),
        tx,
      )
    })
  }
}
