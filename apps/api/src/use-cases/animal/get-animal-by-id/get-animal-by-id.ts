import type { AnimalRepository } from '@/repositories/animal.repository'
import { ApiError } from '@/utils/api-error'
import type { GetAnimalByIdDTO, GetAnimalByIdData } from './get-animal-by-id.dto'

export class GetAnimalByIdUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(data: GetAnimalByIdData): Promise<GetAnimalByIdDTO> {
    const animal = await this.animalRepository.findById(data.id)

    if (!animal) {
      throw new ApiError('Nenhum animal encontrado.', 404)
    }

    return animal
  }
}
