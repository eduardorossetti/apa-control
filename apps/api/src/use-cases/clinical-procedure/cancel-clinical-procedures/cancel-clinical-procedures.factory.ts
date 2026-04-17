import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AppointmentReminderRepository } from '@/repositories/appointment-reminder.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { CancelClinicalProceduresUseCase } from './cancel-clinical-procedures'

export function makeCancelClinicalProceduresUseCase() {
  return new CancelClinicalProceduresUseCase(
    new ClinicalProcedureRepository(),
    new AppointmentReminderRepository(),
    new ProcedureTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
