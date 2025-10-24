import type { EmployeeRepository } from '@/repositories'
import type { EmployeeWithDetails, ListEmployeesData } from './list-employees.dto'

export class ListEmployeesUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(data: ListEmployeesData): Promise<[number, EmployeeWithDetails[]]> {
    const [items, count] = await this.employeeRepository.list(data)
    return [items, count]
  }
}
