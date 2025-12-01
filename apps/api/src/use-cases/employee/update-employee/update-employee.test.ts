import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { employeeRoutes } from '@/http/controllers/employee/routes'

describe('Update employee', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(employeeRoutes)
  })

  it('should update employee', async () => {
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })
    const updatedData = EmployeeFactory.buildCreate({ profileId: profile.id })

    const response = await app.inject({
      method: 'PUT',
      url: '/employee.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: employee.id,
        ...updatedData,
      },
    })

    expect(response.statusCode).toBe(204)

    const getResponse = await app.inject({
      method: 'GET',
      url: `/employee.key/${employee.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = getResponse.json()
    expect(data.name).toBe(updatedData.name)
  })

  it('should not update employee with duplicate login', async () => {
    const profile = await AccessProfileFactory.create()
    const timestamp = Date.now()
    const login1 = `login1${timestamp}`
    const login2 = `login2${timestamp}`
    const employee1 = await EmployeeFactory.create({ profileId: profile.id, login: login1 })
    const employee2 = await EmployeeFactory.create({ profileId: profile.id, login: login2 })
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })

    const getResponse1 = await app.inject({
      method: 'GET',
      url: `/employee.key/${employee1.id}`,
      headers: { authorization: `Bearer ${token}` },
    })
    const employee1Data = getResponse1.json()

    const getResponse2 = await app.inject({
      method: 'GET',
      url: `/employee.key/${employee2.id}`,
      headers: { authorization: `Bearer ${token}` },
    })
    const employee2Data = getResponse2.json()

    const response = await app.inject({
      method: 'PUT',
      url: '/employee.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: employee1Data.id,
        login: employee2Data.login,
        name: employee1Data.name,
        cpf: employee1Data.cpf,
        password: 'password123',
        profileId: profile.id,
      },
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('login')
  })

  it('should not update employee with duplicate CPF', async () => {
    const profile = await AccessProfileFactory.create()
    const employee1 = await EmployeeFactory.create({ profileId: profile.id })
    const employee2 = await EmployeeFactory.create({ profileId: profile.id })
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })

    const response = await app.inject({
      method: 'PUT',
      url: '/employee.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: employee1.id,
        login: employee1.login,
        name: employee1.name,
        cpf: employee2.cpf,
        password: 'password123',
        profileId: profile.id,
      },
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('CPF')
  })

  it('should return 404 when employee not found', async () => {
    const profile = await AccessProfileFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })
    const updatedData = EmployeeFactory.buildCreate({ profileId: profile.id })

    const response = await app.inject({
      method: 'PUT',
      url: '/employee.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: 99999,
        ...updatedData,
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'PUT',
      url: '/employee.update',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {
        id: 1,
        name: 'Test',
      },
    })

    expect(response.statusCode).toBe(403)
  })
})
