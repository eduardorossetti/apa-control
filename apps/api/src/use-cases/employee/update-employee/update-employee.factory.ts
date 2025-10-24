import { EmployeeRepository } from '@/repositories/employee.repository'
import { UpdateEmployeeUseCase } from '@/use-cases/employee/update-employee/update-employee'

export function makeUpdateEmployeeUseCase() {
  const employeeRepository = new EmployeeRepository()
  const updateEmployeeUseCase = new UpdateEmployeeUseCase(employeeRepository)

  return updateEmployeeUseCase
}
