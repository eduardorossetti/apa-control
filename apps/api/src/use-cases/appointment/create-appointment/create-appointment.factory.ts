import { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { AnimalRepository } from '@/repositories/animal.repository'
import { AppointmentTypeRepository } from '@/repositories/appointment-type.repository'
import { AppointmentRepository } from '@/repositories/appointment.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { VeterinaryClinicRepository } from '@/repositories/veterinary-clinic.repository'
import { CreateAppointmentUseCase } from './create-appointment'

export function makeCreateAppointmentUseCase() {
  return new CreateAppointmentUseCase(
    new AppointmentRepository(),
    new ReminderRepository(),
    new AppointmentTypeRepository(),
    new AnimalRepository(),
    new VeterinaryClinicRepository(),
    new AnimalHistoryRepository(),
  )
}
