import type { EmployeeRepository } from '@/repositories/employee.repository'
import { ApiError } from '@/utils/api-error'
import type { GetEmployeeByIdDTO, GetEmployeeByIdData } from './get-employee-by-id.dto'

export class GetEmployeeByIdUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(data: GetEmployeeByIdData): Promise<GetEmployeeByIdDTO> {
    const employee = await this.employeeRepository.findById(data.id)

    if (!employee) {
      throw new ApiError('Nenhum funcionário encontrado.', 404)
    }

    return employee
  }
}
