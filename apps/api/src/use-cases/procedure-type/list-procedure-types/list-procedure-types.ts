import type { ProcedureTypeRepository } from '@/repositories'
import type { ListProcedureTypesDTO, ListProcedureTypesData } from './list-procedure-types.dto'

export class ListProcedureTypesUseCase {
  constructor(private procedureTypeRepository: ProcedureTypeRepository) {}

  async execute(data: ListProcedureTypesData): Promise<[number, ListProcedureTypesDTO[]]> {
    const result = await this.procedureTypeRepository.list(data)
    return result
  }
}
