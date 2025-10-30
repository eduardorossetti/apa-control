import { Animal } from '@/entities'
import type { AnimalRepository } from '@/repositories/animal.repository'
import type { CreateAnimalData } from './create-animal.dto'

export class CreateAnimalUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(data: CreateAnimalData) {
    const [animal] = await this.animalRepository.create(
      new Animal({
        ...data,
        createdAt: new Date(),
      }),
      null,
    )

    return animal.id
  }
}
