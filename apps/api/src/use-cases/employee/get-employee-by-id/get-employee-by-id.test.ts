import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { employeeRoutes } from '@/http/controllers/employee/routes'

describe('Get employee by id', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(employeeRoutes)
  })

  it('should get employee by id', async () => {
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })

    const response = await app.inject({
      method: 'GET',
      url: `/employee.key/${employee.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(employee.id)
    expect(data).toHaveProperty('name')
  })

  it('should return 404 when employee not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })
    const response = await app.inject({
      method: 'GET',
      url: '/employee.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/employee.key/1',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })
})
