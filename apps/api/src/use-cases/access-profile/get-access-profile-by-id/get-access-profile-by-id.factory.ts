import { AccessProfileRepository } from '@/repositories/access-profile.repository'
import { PermissionRepository } from '@/repositories/permission.repository'
import { GetAccessProfileByIdUseCase } from '@/use-cases/access-profile/get-access-profile-by-id/get-access-profile-by-id'

export function makeGetAccessProfileByIdUseCase() {
  const accessProfileRepository = new AccessProfileRepository()
  const permissionRepository = new PermissionRepository()
  const getAccessProfileByIdUseCase = new GetAccessProfileByIdUseCase(accessProfileRepository, permissionRepository)

  return getAccessProfileByIdUseCase
}
