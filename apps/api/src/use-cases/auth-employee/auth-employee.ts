import jwt from 'jsonwebtoken'

import { env } from '@/env'
import type { AccessProfileRepository } from '@/repositories/access-profile.repository'
import type { EmployeeRepository } from '@/repositories/employee.repository'
import type { PermissionRepository } from '@/repositories/permission.repository'
import { ApiError } from '@/utils/api-error'
import { compare } from 'bcryptjs'
import type { AuthEmployeeDTO, AuthEmployeeData, AuthEmployeeUser } from './auth-employee.dto'

export class AuthEmployeeUseCase {
  constructor(
    private employeeRepository: EmployeeRepository,
    private permissionRepository: PermissionRepository,
    private accessProfileRepository: AccessProfileRepository,
  ) {}

  async execute(data: AuthEmployeeData): Promise<AuthEmployeeDTO> {
    const employee = await this.employeeRepository.findByLogin(data.login, [
      'id',
      'name',
      'profileId',
      'disabledAt',
      'passwordHash',
    ])

    if (!employee) {
      throw new ApiError('Login ou senha está incorreto.', 422)
    }

    if (employee.disabledAt) {
      throw new ApiError('Funcionário bloqueado.', 422)
    }

    const [permissions, profile] = await Promise.all([
      this.permissionRepository.getPermissionRoles(employee.profileId),
      this.accessProfileRepository.findById(employee.profileId, null),
    ])

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

    const user: AuthEmployeeUser = {
      id: employee.id,
      name: employee.name,
      profileName: profile?.description || '',
      permissions: roles,
    }

    const accessToken = jwt.sign(payload, env.APP_SECRET, { expiresIn: '24h' })

    return {
      accessToken,
      user,
    }
  }
}
