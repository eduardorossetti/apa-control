import { AppointmentType } from '@/entities'
import type { AppointmentTypeRepository } from '@/repositories/appointment-type.repository'
import { ApiError } from '@/utils/api-error'
import type { CreateAppointmentTypeDTO, CreateAppointmentTypeData } from './create-appointment-type.dto'

export class CreateAppointmentTypeUseCase {
  constructor(private appointmentTypeRepository: AppointmentTypeRepository) {}

  async execute(data: CreateAppointmentTypeData): Promise<CreateAppointmentTypeDTO> {
    if (await this.appointmentTypeRepository.hasName(data.name)) {
      throw new ApiError('Já existe um tipo de consulta cadastrado com o nome informado.', 409)
    }

    const appointmentType = new AppointmentType({
      name: data.name,
      description: data.description,
      urgency: data.urgency,
      active: data.active,
      createdAt: new Date(),
    })

    const result = await this.appointmentTypeRepository.create(appointmentType)

    return { id: result.id }
  }
}
