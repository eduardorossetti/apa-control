import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { ConfirmClinicalProceduresUseCase } from './confirm-clinical-procedures'

export function makeConfirmClinicalProceduresUseCase() {
  return new ConfirmClinicalProceduresUseCase(
    new ClinicalProcedureRepository(),
    new ReminderRepository(),
    new ProcedureTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
