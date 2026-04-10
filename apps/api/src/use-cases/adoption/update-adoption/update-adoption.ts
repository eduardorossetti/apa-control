import { db } from '@/database/client'
import { AdoptionStatus } from '@/database/schema/enums/adoption-status'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { AnimalHistory } from '@/entities'
import type { AdopterRepository } from '@/repositories/adopter.repository'
import type { AdoptionRepository } from '@/repositories/adoption.repository'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import { ApiError } from '@/utils/api-error'
import type { UpdateAdoptionData } from './update-adoption.dto'

export class UpdateAdoptionUseCase {
  constructor(
    private adoptionRepository: AdoptionRepository,
    private adopterRepository: AdopterRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
  ) {}

  async execute(data: UpdateAdoptionData, employeeId: number): Promise<void> {
    const existing = await this.adoptionRepository.findById(data.id)
    if (!existing) throw new ApiError('Adoção não encontrada.', 404)

    const adopter = await this.adopterRepository.findById(data.adopterId)
    if (!adopter) throw new ApiError('Adotante não encontrado.', 404)

    const animalDepartureDate = existing.animalDepartureDate ?? null
    const normalizedData = {
      adopterId: data.adopterId,
      adoptionDate: data.adoptionDate,
      animalDepartureDate,
      status: data.status,
      observations: data.observations ?? null,
      proof: data.proof ?? null,
    } as const
    const comparableExisting = {
      adopterId: existing.adopterId,
      adoptionDate: existing.adoptionDate,
      animalDepartureDate: existing.animalDepartureDate ?? null,
      status: existing.status,
      observations: existing.observations ?? null,
      proof: existing.proof ?? null,
    } as const
    const comparableNew = {
      adopterId: normalizedData.adopterId,
      adoptionDate: normalizedData.adoptionDate,
      animalDepartureDate: normalizedData.animalDepartureDate,
      status: normalizedData.status,
      observations: normalizedData.observations,
      proof: normalizedData.proof,
    } as const
    const changedData = (Object.keys(normalizedData) as (keyof typeof normalizedData)[]).reduce(
      (acc, key) => {
        if (JSON.stringify(comparableExisting[key]) !== JSON.stringify(comparableNew[key])) {
          return { ...acc, [key]: normalizedData[key] }
        }

        return acc
      },
      {} as Record<string, unknown>,
    )
    const oldValues = Object.keys(changedData).reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = (existing as Record<string, unknown>)[key] ?? null
      return acc
    }, {})
    const newValues = Object.keys(changedData).reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = changedData[key]
      return acc
    }, {})

    await db.transaction(async (tx) => {
      await this.adoptionRepository.update(data.id, normalizedData, tx)

      if (Object.keys(changedData).length > 0) {
        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId: existing.animalId,
            rescueId: null,
            employeeId,
            type: AnimalHistoryType.ADOPTION,
            action: 'adoption.updated',
            description: 'Adoção atualizada',
            oldValue: JSON.stringify(oldValues),
            newValue: JSON.stringify(newValues),
            createdAt: new Date(),
          }),
          tx,
        )
      }
    })
  }
}
