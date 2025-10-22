import { AccessProfileRepository } from '@/repositories/access-profile.repository'
import { PermissionRepository } from '@/repositories/permission.repository'
import { UpdateAccessProfileUseCase } from '@/use-cases/access-profile/update-access-profile/update-access-profile'

export function makeUpdateAccessProfileUseCase() {
  const accessProfileRepository = new AccessProfileRepository()
  const permissionRepository = new PermissionRepository()
  const updateAccessProfileUseCase = new UpdateAccessProfileUseCase(accessProfileRepository, permissionRepository)

  return updateAccessProfileUseCase
}
