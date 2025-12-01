import type { DrizzleTransaction } from '@/database/types'
import type { AccessProfileRepository } from '@/repositories/access-profile.repository'
import type { EmployeeRepository } from '@/repositories/employee.repository'
import type { PermissionRepository } from '@/repositories/permission.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveAccessProfileData } from './remove-access-profile.dto'

export class RemoveAccessProfileUseCase {
  constructor(
    private accessProfileRepository: AccessProfileRepository,
    private permissionRepository: PermissionRepository,
    private employeeRepository: EmployeeRepository,
  ) {}

  async execute(data: RemoveAccessProfileData, dbTransaction: DrizzleTransaction) {
    const profile = await this.accessProfileRepository.findById(data.id, dbTransaction)

    if (!profile) {
      throw new ApiError('Nenhum perfil encontrado.', 404)
    }

    const employeeCount = await this.employeeRepository.countByProfileId(profile.id, dbTransaction)

    if (employeeCount > 0) {
      throw new ApiError(
        `Não é possível excluir o perfil de acesso pois existem ${employeeCount} funcionário(s) vinculado(s) a ele.`,
        400,
      )
    }

    await this.permissionRepository.remove(profile.id, dbTransaction)
    await this.accessProfileRepository.remove(profile.id, dbTransaction)
  }
}
