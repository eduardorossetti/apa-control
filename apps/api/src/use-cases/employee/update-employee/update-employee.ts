import type { Employee } from '@/entities'
import type { EmployeeRepository } from '@/repositories/employee.repository'
import { ApiError } from '@/utils/api-error'
import { hashPassword } from '@/utils/password'
import type { UpdateEmployeeData } from './update-employee.dto'

export class UpdateEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async execute(data: UpdateEmployeeData): Promise<void> {
    const oldData = await this.employeeRepository.findById(data.id)

    if (!oldData) {
      throw new ApiError('Funcionário não encontrado.', 404)
    }

    if (oldData.login !== data.login && (await this.employeeRepository.hasLogin(data.login))) {
      throw new ApiError('Já existe um funcionário cadastrado com o login.', 409)
    }

    if (oldData.cpf !== data.cpf && (await this.employeeRepository.hasCpf(data.cpf))) {
      throw new ApiError('Já existe um funcionário cadastrado com o CPF informado.', 409)
    }

    if (data.password) {
      oldData.passwordHash = await hashPassword(data.password)
    }

    const changedData = Object.entries(data).reduce((acc, [key, value]) => {
      const oldValue = oldData[key as keyof Employee] ?? null
      const newValue = typeof value !== 'undefined' ? value : oldValue
      const shouldIgnoreKey = key === 'profileName' || (key === 'password' && newValue === '')

      if (shouldIgnoreKey) {
        return acc
      }

      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        return { ...acc, [key]: key === 'password' ? '******' : newValue }
      }

      return acc
    }, {}) as Employee & { password: string }

    const { password: _, ...changedDataWithoutPassword } = changedData

    await this.employeeRepository.update(data.id, { ...changedDataWithoutPassword, passwordHash: oldData.passwordHash })
  }
}
