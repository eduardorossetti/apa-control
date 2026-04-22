import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AppointmentTypeRepository } from '@/repositories/appointment-type.repository'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { CancelAppointmentsUseCase } from './cancel-appointments'

export function makeCancelAppointmentsUseCase() {
  return new CancelAppointmentsUseCase(
    new AppointmentRepository(),
    new ReminderRepository(),
    new AppointmentTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
