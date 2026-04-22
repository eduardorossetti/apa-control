import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { RemoveClinicalProcedureUseCase } from './remove-clinical-procedure'

export function makeRemoveClinicalProcedureUseCase() {
  return new RemoveClinicalProcedureUseCase(
    new ClinicalProcedureRepository(),
    new ReminderRepository(),
    new ProcedureTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
