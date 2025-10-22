import type { AccessProfileRepository } from '@/repositories/access-profile.repository'
import type { PermissionRepository } from '@/repositories/permission.repository'
import { ApiError } from '@/utils/api-error'
import type { GetAccessProfileByIdDTO, GetAccessProfileByIdData } from './get-access-profile-by-id.dto'

export class GetAccessProfileByIdUseCase {
  constructor(
    private accessProfileRepository: AccessProfileRepository,
    private permissionRepository: PermissionRepository,
  ) {}

  async execute(data: GetAccessProfileByIdData): Promise<GetAccessProfileByIdDTO> {
    const profile = await this.accessProfileRepository.findById(data.id, null)

    if (!profile) {
      throw new ApiError('Nenhum perfil encontrado.', 404)
    }

    const permissions = await this.permissionRepository.getPermissionIds(data.id)

    return { ...profile, permissions }
  }
}
