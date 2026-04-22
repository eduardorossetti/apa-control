import { AnamnesisRepository } from '@/repositories/anamnesis.repository'
import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AppointmentTypeRepository } from '@/repositories/appointment-type.repository'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { ClinicalProcedureRepository } from '@/repositories/clinical-procedure.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { RemoveAppointmentUseCase } from './remove-appointment'

export function makeRemoveAppointmentUseCase() {
  return new RemoveAppointmentUseCase(
    new AppointmentRepository(),
    new ReminderRepository(),
    new AppointmentTypeRepository(),
    new AnamnesisRepository(),
    new ClinicalProcedureRepository(),
    new AnimalHistoryRepository(),
  )
}
