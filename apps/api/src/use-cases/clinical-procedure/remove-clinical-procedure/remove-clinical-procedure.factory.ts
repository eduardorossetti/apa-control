import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AppointmentReminderRepository } from '@/repositories/appointment-reminder.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { RemoveClinicalProcedureUseCase } from './remove-clinical-procedure'

export function makeRemoveClinicalProcedureUseCase() {
  return new RemoveClinicalProcedureUseCase(
    new ClinicalProcedureRepository(),
    new AppointmentReminderRepository(),
    new ProcedureTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
