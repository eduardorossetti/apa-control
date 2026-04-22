import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AppointmentTypeRepository } from '@/repositories/appointment-type.repository'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { ConfirmAppointmentsUseCase } from './confirm-appointments'

export function makeConfirmAppointmentsUseCase() {
  return new ConfirmAppointmentsUseCase(
    new AppointmentRepository(),
    new ReminderRepository(),
    new AppointmentTypeRepository(),
    new AnimalHistoryRepository(),
  )
}
