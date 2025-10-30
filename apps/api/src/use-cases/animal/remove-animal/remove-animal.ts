import type { AnimalRepository } from '@/repositories/animal.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveAnimalData } from './remove-animal.dto'

export class RemoveAnimalUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(data: RemoveAnimalData): Promise<void> {
    const animal = await this.animalRepository.findById(data.id)

    if (!animal) {
      throw new ApiError('Animal não encontrado.', 404)
    }

    await this.animalRepository.delete(data.id)
  }
}
