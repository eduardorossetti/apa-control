import type { DrizzleTransaction } from '@/database/types'
import type { VeterinaryClinicRepository } from '@/repositories/veterinary-clinic.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveVeterinaryClinicData } from './remove-veterinary-clinic.dto'

export class RemoveVeterinaryClinicUseCase {
  constructor(private veterinaryClinicRepository: VeterinaryClinicRepository) {}

  async execute(data: RemoveVeterinaryClinicData, dbTransaction: DrizzleTransaction) {
    const veterinaryClinic = await this.veterinaryClinicRepository.findById(data.id)

    if (!veterinaryClinic) {
      throw new ApiError('Nenhuma clínica veterinária encontrada.', 404)
    }

    const appointmentCount = await this.veterinaryClinicRepository.countByClinicId(veterinaryClinic.id, dbTransaction)

    if (appointmentCount > 0) {
      throw new ApiError(
        `Não é possível excluir a clínica veterinária pois existem ${appointmentCount} consulta(s) vinculada(s) a ela.`,
        400,
      )
    }

    await this.veterinaryClinicRepository.remove(veterinaryClinic.id, dbTransaction)
  }
}
