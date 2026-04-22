import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { CancelClinicalProceduresUseCase } from './cancel-clinical-procedures'

export function makeCancelClinicalProceduresUseCase() {
  return new CancelClinicalProceduresUseCase(
    new ClinicalProcedureRepository(),
    new ReminderRepository(),
    new ProcedureTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
