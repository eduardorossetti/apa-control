import type { DrizzleTransaction } from '@/database/types'
import type { ProcedureTypeRepository } from '@/repositories/procedure-type.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveProcedureTypeData } from './remove-procedure-type.dto'

export class RemoveProcedureTypeUseCase {
  constructor(private procedureTypeRepository: ProcedureTypeRepository) {}

  async execute(data: RemoveProcedureTypeData, dbTransaction: DrizzleTransaction) {
    const procedureType = await this.procedureTypeRepository.findById(data.id)

    if (!procedureType) {
      throw new ApiError('Nenhum tipo de procedimento encontrado.', 404)
    }

    const clinicalProcedureCount = await this.procedureTypeRepository.countByProcedureTypeId(
      procedureType.id,
      dbTransaction,
    )

    if (clinicalProcedureCount > 0) {
      throw new ApiError(
        `Não é possível excluir o tipo de procedimento pois existem ${clinicalProcedureCount} procedimento(s) clínico(s) vinculado(s) a ele.`,
        400,
      )
    }

    await this.procedureTypeRepository.remove(procedureType.id, dbTransaction)
  }
}
