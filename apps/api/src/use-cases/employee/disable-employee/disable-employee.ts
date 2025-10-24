import type { EmployeeRepository } from '@/repositories/employee.repository'
import { ApiError } from '@/utils/api-error'
import type { DisableEmployeeData } from './disable-employee.dto'

export class DisableEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(data: DisableEmployeeData): Promise<void> {
    const employee = await this.employeeRepository.findById(data.id)

    if (!employee) {
      throw new ApiError('Funcionário não encontrado.', 404)
    }

    await this.employeeRepository.update(data.id, {
      disabledAt: data.disabled ? new Date() : null,
    })
  }
}
