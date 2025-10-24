import { EmployeeRepository } from '@/repositories/employee.repository'
import { CreateEmployeeUseCase } from '@/use-cases/employee/create-employee/create-employee'

export function makeCreateEmployeeUseCase() {
  const employeeRepository = new EmployeeRepository()
  const createEmployeeUseCase = new CreateEmployeeUseCase(employeeRepository)

  return createEmployeeUseCase
}
