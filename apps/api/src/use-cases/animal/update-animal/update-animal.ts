import type { Animal } from '@/entities'
import type { AnimalRepository } from '@/repositories/animal.repository'
import { ApiError } from '@/utils/api-error'
import type { UpdateAnimalData } from './update-animal.dto'

export class UpdateAnimalUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(data: UpdateAnimalData): Promise<void> {
    const oldData = await this.animalRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Animal não encontrado.', 404)
    }

    const changedData = Object.entries(data).reduce((acc, [key, value]) => {
      const oldValue = oldData[key as keyof Animal] ?? null
      const newValue = typeof value !== 'undefined' ? value : oldValue
      const shouldIgnoreKey = key === 'id'

      if (shouldIgnoreKey) {
        return acc
      }

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        return { ...acc, [key]: newValue }
      }

      return acc
    }, {}) as Partial<Animal>

    await this.animalRepository.update(data.id, changedData)
  }
}
