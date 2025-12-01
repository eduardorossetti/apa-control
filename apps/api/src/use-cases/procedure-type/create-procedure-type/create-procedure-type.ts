import { ProcedureType } from '@/entities'
import type { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ApiError } from '@/utils/api-error'
import Decimal from 'decimal.js'
import type { CreateProcedureTypeDTO, CreateProcedureTypeData } from './create-procedure-type.dto'

export class CreateProcedureTypeUseCase {
  constructor(private procedureTypeRepository: ProcedureTypeRepository) {}

  async execute(data: CreateProcedureTypeData): Promise<CreateProcedureTypeDTO> {
    if (await this.procedureTypeRepository.hasName(data.name)) {
      throw new ApiError('Já existe um tipo de procedimento cadastrado com o nome informado.', 409)
    }

    const procedureType = new ProcedureType({
      name: data.name,
      description: data.description,
      category: data.category,
      averageCost: new Decimal(data.averageCost),
      active: data.active,
      createdAt: new Date(),
    })

    const result = await this.procedureTypeRepository.create(procedureType)

    return { id: result.id }
  }
}
