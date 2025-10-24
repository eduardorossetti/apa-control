import { EmployeeRepository } from '@/repositories/employee.repository'
import { DisableEmployeeUseCase } from '@/use-cases/employee/disable-employee/disable-employee'

export function makeDisableEmployeeUseCase() {
  const employeeRepository = new EmployeeRepository()
  const disableEmployeeUseCase = new DisableEmployeeUseCase(employeeRepository)

  return disableEmployeeUseCase
}
