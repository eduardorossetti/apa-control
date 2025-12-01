import { AccessProfileRepository } from '@/repositories/access-profile.repository'
import { EmployeeRepository } from '@/repositories/employee.repository'
import { PermissionRepository } from '@/repositories/permission.repository'
import { RemoveAccessProfileUseCase } from '@/use-cases/access-profile/remove-access-profile/remove-access-profile'

export function makeRemoveAccessProfileUseCase() {
  const accessProfileRepository = new AccessProfileRepository()
  const permissionRepository = new PermissionRepository()
  const employeeRepository = new EmployeeRepository()
  const removeAccessProfileUseCase = new RemoveAccessProfileUseCase(
    accessProfileRepository,
    permissionRepository,
    employeeRepository,
  )

  return removeAccessProfileUseCase
}
