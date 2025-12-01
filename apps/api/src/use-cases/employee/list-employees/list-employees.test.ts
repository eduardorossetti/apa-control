import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { employeeRoutes } from '@/http/controllers/employee/routes'

describe('List employees', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(employeeRoutes)
  })

  it('should list employees', async () => {
    const profile = await AccessProfileFactory.create()
    await EmployeeFactory.create({ profileId: profile.id })
    await EmployeeFactory.create({ profileId: profile.id })

    const token = getAuthToken({ roles: ['AdminPanel', 'Employees'] })
    const response = await app.inject({
      method: 'GET',
      url: '/employee.list',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(2)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/employee.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/employee.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
