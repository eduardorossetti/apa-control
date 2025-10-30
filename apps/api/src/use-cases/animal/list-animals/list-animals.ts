import type { AnimalRepository } from '@/repositories'
import type { AnimalWithDetails, ListAnimalsData } from './list-animals.dto'

export class ListAnimalsUseCase {
  constructor(private animalRepository: AnimalRepository) {}

  async execute(data: ListAnimalsData): Promise<[number, AnimalWithDetails[]]> {
    const [count, items] = await this.animalRepository.list(data)
    return [count, items]
  }
}
