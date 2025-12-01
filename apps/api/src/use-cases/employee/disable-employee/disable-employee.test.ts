import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { employeeRoutes } from '@/http/controllers/employee/routes'

describe('Disable employee', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(employeeRoutes)
  })

  it('should disable employee', async () => {
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })

    const response = await app.inject({
      method: 'POST',
      url: '/employee.disable',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: employee.id,
        disabled: true,
      },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should enable employee', async () => {
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id, disabledAt: new Date() })
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })

    const response = await app.inject({
      method: 'POST',
      url: '/employee.disable',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: employee.id,
        disabled: false,
      },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when employee not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })
    const response = await app.inject({
      method: 'POST',
      url: '/employee.disable',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: 99999,
        disabled: true,
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/employee.disable',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {
        id: 1,
        disabled: true,
      },
    })

    expect(response.statusCode).toBe(403)
  })
})
