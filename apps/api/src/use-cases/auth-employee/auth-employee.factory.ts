import { EmployeeRepository } from '@/repositories'
import { PermissionRepository } from '@/repositories/permission.repository'
import { AuthEmployeeUseCase } from './auth-employee'

export function makeAuthEmployeeUseCase() {
  const employeeRepository = new EmployeeRepository()
  const permissionRepository = new PermissionRepository()
  const authEmployeeUseCase = new AuthEmployeeUseCase(employeeRepository, permissionRepository)

  return authEmployeeUseCase
}
