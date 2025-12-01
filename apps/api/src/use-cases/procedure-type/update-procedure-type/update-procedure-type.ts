import type { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ApiError } from '@/utils/api-error'
import Decimal from 'decimal.js'
import type { UpdateProcedureTypeData } from './update-procedure-type.dto'

export class UpdateProcedureTypeUseCase {
  constructor(private procedureTypeRepository: ProcedureTypeRepository) {}

  async execute(data: UpdateProcedureTypeData): Promise<void> {
    const oldData = await this.procedureTypeRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Tipo de procedimento não encontrado.', 404)
    }

    if (oldData.name !== data.name && (await this.procedureTypeRepository.hasName(data.name))) {
      throw new ApiError('Já existe um tipo de procedimento cadastrado com o nome informado.', 409)
    }

    await this.procedureTypeRepository.update(data.id, {
      name: data.name,
      description: data.description,
      category: data.category,
      averageCost: new Decimal(data.averageCost),
      active: data.active,
    })
  }
}
