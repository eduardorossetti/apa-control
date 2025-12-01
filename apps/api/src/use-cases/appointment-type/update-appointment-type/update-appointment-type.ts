import type { AppointmentTypeRepository } from '@/repositories/appointment-type.repository'
import { ApiError } from '@/utils/api-error'
import type { UpdateAppointmentTypeData } from './update-appointment-type.dto'

export class UpdateAppointmentTypeUseCase {
  constructor(private appointmentTypeRepository: AppointmentTypeRepository) {}

  async execute(data: UpdateAppointmentTypeData): Promise<void> {
    const oldData = await this.appointmentTypeRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Tipo de consulta não encontrado.', 404)
    }

    if (oldData.name !== data.name && (await this.appointmentTypeRepository.hasName(data.name))) {
      throw new ApiError('Já existe um tipo de consulta cadastrado com o nome informado.', 409)
    }

    await this.appointmentTypeRepository.update(data.id, {
      name: data.name,
      description: data.description,
      urgency: data.urgency,
      active: data.active,
    })
  }
}
