import { Permission } from '@/entities'
import type { AccessProfileRepository } from '@/repositories/access-profile.repository'
import type { PermissionRepository } from '@/repositories/permission.repository'
import { ApiError } from '@/utils/api-error'
import type { UpdateAccessProfileData } from './update-access-profile.dto'

export class UpdateAccessProfileUseCase {
  constructor(
    private accessProfileRepository: AccessProfileRepository,
    private permissionRepository: PermissionRepository,
  ) {}

  async execute(data: UpdateAccessProfileData): Promise<void> {
    const oldData = await this.accessProfileRepository.findById(data.id, null)

    if (!oldData) {
      throw new ApiError('Perfil não encontrado.', 404)
    }

    data.description = data.description?.trim()
    data.permissions ??= []

    await this.accessProfileRepository.update(data.id, {
      description: data.description,
    })

    await this.permissionRepository.update(
      data.id,
      data.permissions.map((moduleId) => new Permission({ moduleId, profileId: data.id })),
    )
  }
}
