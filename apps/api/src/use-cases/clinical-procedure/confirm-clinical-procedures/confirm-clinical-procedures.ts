import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { ProcedureStatus } from '@/database/schema/enums/procedure-status'
import { AnimalHistory } from '@/entities'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import type { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ApiError } from '@/utils/api-error'
import type { ConfirmClinicalProceduresData } from './confirm-clinical-procedures.dto'

export class ConfirmClinicalProceduresUseCase {
  constructor(
    private clinicalProcedureRepository: ClinicalProcedureRepository,
    private procedureTypeRepository: ProcedureTypeRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: ConfirmClinicalProceduresData, employeeId: number): Promise<void> {
    const procedures = await this.clinicalProcedureRepository.findByIds(data.ids)

    if (procedures.length !== data.ids.length) {
      throw new ApiError('Um ou mais procedimentos clínicos não foram encontrados.', 404)
    }

    if (procedures.some((procedure) => procedure.status !== ProcedureStatus.SCHEDULED)) {
      throw new ApiError('Apenas procedimentos clínicos agendados podem ser confirmados como realizados.', 409)
    }

    const procedureTypes = await Promise.all(
      [...new Set(procedures.map((procedure) => procedure.procedureTypeId))].map(async (id) => {
        const procedureType = await this.procedureTypeRepository.findById(id)
        return [id, procedureType?.name ?? `#${id}`] as const
      }),
    )
    const procedureTypeById = new Map(procedureTypes)

    await db.transaction(async (tx) => {
      await this.clinicalProcedureRepository.updateStatusByIds(data.ids, ProcedureStatus.COMPLETED, tx)

      for (const procedure of procedures) {
        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId: procedure.animalId,
            rescueId: null,
            employeeId,
            type: AnimalHistoryType.PROCEDURE,
            action: 'clinical-procedure.completed',
            description: `Procedimento ${procedureTypeById.get(procedure.procedureTypeId)} realizado`,
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
