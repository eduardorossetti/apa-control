import { ApprovalStatus } from '@/database/schema/enums/approval-status'
import { Adopter } from '@/entities'
import type { AdopterRepository } from '@/repositories/adopter.repository'
import { ApiError } from '@/utils/api-error'
import Decimal from 'decimal.js'
import type { CreateAdopterDTO, CreateAdopterData } from './create-adopter.dto'

export class CreateAdopterUseCase {
  constructor(private adopterRepository: AdopterRepository) {}

  async execute(data: CreateAdopterData): Promise<CreateAdopterDTO> {
    if (await this.adopterRepository.hasCpf(data.cpf)) {
      throw new ApiError('Já existe um adotante cadastrado com o CPF informado.', 409)
    }

    const adopter = new Adopter({
      name: data.name,
      cpf: data.cpf,
      email: data.email,
      phone: data.phone,
      address: data.address,
      familyIncome: new Decimal(data.familyIncome),
      animalExperience: data.animalExperience,
      approvalStatus: ApprovalStatus.PENDING,
      createdAt: new Date(),
    })

    const result = await this.adopterRepository.create(adopter)

    return { id: result.id }
  }
}
