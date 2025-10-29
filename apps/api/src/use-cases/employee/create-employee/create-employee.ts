import { Employee } from '@/entities'
import type { EmployeeRepository } from '@/repositories/employee.repository'
import { ApiError } from '@/utils/api-error'
import { hashPassword } from '@/utils/password'
import type { CreateEmployeeData } from './create-employee.dto'

export class CreateEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async validate(data: Pick<CreateEmployeeData, 'login' | 'cpf'>) {
    if (await this.employeeRepository.hasLogin(data.login)) {
      throw new ApiError('Já existe um funcionário cadastrado com o login informado.', 409)
    }

    if (await this.employeeRepository.hasCpf(data.cpf)) {
      throw new ApiError('Já existe um funcionário cadastrado com o CPF informado.', 409)
    }
  }

  async execute(data: CreateEmployeeData) {
    const { login, cpf } = data
    await this.validate({ login, cpf })

    const { password, ...employeeData } = data
    const passwordHash = await hashPassword(password)
    const [employee] = await this.employeeRepository.create(
      new Employee({
        ...employeeData,
        createdAt: new Date(),
        passwordHash,
      }),
      null,
    )

    return employee.id
  }
}
