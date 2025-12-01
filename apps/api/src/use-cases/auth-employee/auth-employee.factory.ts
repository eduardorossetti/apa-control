import { EmployeeRepository } from '@/repositories'
import { AccessProfileRepository } from '@/repositories/access-profile.repository'
import { PermissionRepository } from '@/repositories/permission.repository'
import { AuthEmployeeUseCase } from './auth-employee'

export function makeAuthEmployeeUseCase() {
  const employeeRepository = new EmployeeRepository()
  const permissionRepository = new PermissionRepository()
  const accessProfileRepository = new AccessProfileRepository()
  const authEmployeeUseCase = new AuthEmployeeUseCase(employeeRepository, permissionRepository, accessProfileRepository)

  return authEmployeeUseCase
}
