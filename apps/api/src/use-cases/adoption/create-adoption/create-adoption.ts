import { db } from '@/database/client'
import { AdoptionStatus } from '@/database/schema/enums/adoption-status'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { Adoption, AnimalHistory } from '@/entities'
import type { AdopterRepository } from '@/repositories/adopter.repository'
import type { AdoptionRepository } from '@/repositories/adoption.repository'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import { ApiError } from '@/utils/api-error'
import type { CreateAdoptionData } from './create-adoption.dto'

export class CreateAdoptionUseCase {
  constructor(
    private adoptionRepository: AdoptionRepository,
    private animalRepository: AnimalRepository,
    private adopterRepository: AdopterRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: CreateAdoptionData, employeeId: number): Promise<number> {
    const status = data.status ?? AdoptionStatus.PROCESSING
    const animalDepartureDate = null
    const pendingAdoption = await this.adoptionRepository.findByAnimalId(data.animalId, AdoptionStatus.PROCESSING)
    if (pendingAdoption) {
      throw new ApiError('Este animal já possui uma adoção pendente.', 409)
    }

    const animal = await this.animalRepository.findById(data.animalId)
    if (!animal) throw new ApiError('Animal não encontrado.', 404)
    if (animal.status === AnimalStatus.INACTIVE) {
      throw new ApiError('O animal já consta como inativo.', 409)
    }

    const adopter = await this.adopterRepository.findById(data.adopterId)
    if (!adopter) throw new ApiError('Adotante não encontrado.', 404)

    return await db.transaction(async (tx) => {
      const [row] = await this.adoptionRepository.create(
        new Adoption({
          animalId: data.animalId,
          adopterId: data.adopterId,
          employeeId,
          adoptionDate: data.adoptionDate,
          animalDepartureDate,
          status,
          observations: data.observations ?? null,
          proof: data.proof ?? null,
          createdAt: new Date(),
          updatedAt: null,
        }),
        tx,
      )

      await this.animalHistoryRepository.create(
        new AnimalHistory({
          animalId: data.animalId,
          rescueId: null,
          employeeId,
          type: AnimalHistoryType.ADOPTION,
          action: 'adoption.created',
          description: 'Adoção registrada',
          oldValue: null,
          newValue: null,
          createdAt: new Date(),
        }),
        tx,
      )

      return row!.id
    })
  }
}
