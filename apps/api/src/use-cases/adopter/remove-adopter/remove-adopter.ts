import type { DrizzleTransaction } from '@/database/types'
import type { AdopterRepository } from '@/repositories/adopter.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveAdopterData } from './remove-adopter.dto'

export class RemoveAdopterUseCase {
  constructor(private adopterRepository: AdopterRepository) {}

  async execute(data: RemoveAdopterData, dbTransaction: DrizzleTransaction) {
    const adopter = await this.adopterRepository.findById(data.id)

    if (!adopter) {
      throw new ApiError('Nenhum adotante encontrado.', 404)
    }

    const adoptionCount = await this.adopterRepository.countByAdopterId(adopter.id!, dbTransaction)

    if (adoptionCount > 0) {
      throw new ApiError(
        `Não é possível excluir o adotante pois existem ${adoptionCount} adoção(ões) vinculada(s) a ele.`,
        400,
      )
    }

    await this.adopterRepository.remove(adopter.id!, dbTransaction)
  }
}
