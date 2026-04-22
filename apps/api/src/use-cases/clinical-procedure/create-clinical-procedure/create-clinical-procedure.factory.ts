import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { CreateClinicalProcedureUseCase } from './create-clinical-procedure'

export function makeCreateClinicalProcedureUseCase() {
  return new CreateClinicalProcedureUseCase(
    new ClinicalProcedureRepository(),
    new ReminderRepository(),
    new ProcedureTypeRepository(),
    new AnimalRepository(),
    new AppointmentRepository(),
    new AnimalHistoryRepository(),
  )
}
