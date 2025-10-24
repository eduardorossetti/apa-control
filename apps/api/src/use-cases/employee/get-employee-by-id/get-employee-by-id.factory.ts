import { EmployeeRepository } from '@/repositories/employee.repository'
import { GetEmployeeByIdUseCase } from '@/use-cases/employee/get-employee-by-id/get-employee-by-id'

export function makeGetEmployeeByIdUseCase() {
  const employeeRepository = new EmployeeRepository()
  const getEmployeeByIdUseCase = new GetEmployeeByIdUseCase(employeeRepository)

  return getEmployeeByIdUseCase
}
