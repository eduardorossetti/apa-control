import { EmployeeRepository } from '@/repositories/employee.repository'
import { ListEmployeesUseCase } from '@/use-cases/employee/list-employees/list-employees'

export function makeListEmployeesUseCase() {
  const employeeRepository = new EmployeeRepository()
  const listEmployeesUseCase = new ListEmployeesUseCase(employeeRepository)

  return listEmployeesUseCase
}
