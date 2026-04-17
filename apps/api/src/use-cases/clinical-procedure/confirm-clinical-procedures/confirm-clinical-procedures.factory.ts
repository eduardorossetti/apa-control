import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AppointmentReminderRepository } from '@/repositories/appointment-reminder.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ConfirmClinicalProceduresUseCase } from './confirm-clinical-procedures'

export function makeConfirmClinicalProceduresUseCase() {
  return new ConfirmClinicalProceduresUseCase(
    new ClinicalProcedureRepository(),
    new AppointmentReminderRepository(),
    new ProcedureTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
