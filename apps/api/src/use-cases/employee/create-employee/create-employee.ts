import { Employee } from '@/entities'
import type { EmployeeRepository } from '@/repositories/employee.repository'
import { ApiError } from '@/utils/api-error'
import { hashPassword } from '@/utils/password'
import type { CreateEmployeeData } from './create-employee.dto'

export class CreateEmployeeUseCase {
  constructor(private employeeRepository: EmployeeRepository) {}

  async validate(data: Pick<CreateEmployeeData, 'login'>) {
    if (await this.employeeRepository.hasLogin(data.login)) {
      throw new ApiError('Já existe um operador cadastrado com o login informado na cidade informada.', 409)
    }
  }

  async execute(data: CreateEmployeeData) {
    await this.validate(data)

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
