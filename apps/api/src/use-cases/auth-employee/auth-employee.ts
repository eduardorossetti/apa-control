import jwt from 'jsonwebtoken'

import { env } from '@/env'
import type { EmployeeRepository } from '@/repositories/employee.repository'
import type { PermissionRepository } from '@/repositories/permission.repository'
import { ApiError } from '@/utils/api-error'
import { compare } from 'bcryptjs'
import type { AuthEmployeeDTO, AuthEmployeeData } from './auth-employee.dto'

export class AuthEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private permissionRepository: PermissionRepository,
  ) {}

  async execute(data: AuthEmployeeData): Promise<AuthEmployeeDTO> {
    const employee = await this.employeeRepository.findByLogin(data.login, [
      'id',
      'name',
      'profileId',
      'blockedAt',
      'passwordHash',
    ])

    if (!employee) {
      throw new ApiError('Login ou senha está incorreto.', 422)
    }

    if (employee.blockedAt) {
      throw new ApiError('Funcionário bloqueado.', 422)
    }

    const permissions = await this.permissionRepository.getPermissionRoles(employee.profileId)

    const roles = ['Employee', ...permissions]
    const isValid = await compare(data.password, employee.passwordHash)

    if (!isValid) {
      throw new ApiError('Login ou senha está incorreto.', 422)
    }

    const payload: TokenOperator = {
      id: employee.id,
      name: employee.name,
      roles,
    }

    const accessToken = jwt.sign(payload, env.APP_SECRET, { expiresIn: '24h' })

    return {
      accessToken,
      user: {
        id: employee.id,
        name: employee.name,
        permissions: roles,
      },
    }
  }
}
