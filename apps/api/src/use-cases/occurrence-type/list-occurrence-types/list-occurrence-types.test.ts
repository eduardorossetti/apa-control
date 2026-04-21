import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceTypeRoutes } from '@/http/controllers/occurrence-type/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('List occurrence-types', () => {
  const app = createBaseApp()
  let employeeId: number
  let token: string

  beforeAll(async () => {
    await app.register(occurrenceTypeRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations', 'OccurrenceTypes'] })
    await OccurrenceTypeFactory.create()
  })

  it('should list occurrence-types', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/occurrence-type.list?page=1&perPage=10',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(1)
  })

  it('should not access without role', async () => {
    const noRoleToken = getAuthToken({ id: employeeId })

    const response = await app.inject({
      method: 'GET',
      url: '/occurrence-type.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/occurrence-type.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
