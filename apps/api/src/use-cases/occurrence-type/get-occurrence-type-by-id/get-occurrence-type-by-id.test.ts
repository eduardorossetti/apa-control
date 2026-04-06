import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceTypeRoutes } from '@/http/controllers/occurrence-type/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Get occurrence-type by id', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(occurrenceTypeRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should return occurrence-type by id', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations'] })
    const created = await OccurrenceTypeFactory.create()

    const response = await app.inject({
      method: 'GET',
      url: `/occurrence-type.key/${created.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id', created.id)
  })

  it('should return 404 when occurrence-type does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations'] })

    const response = await app.inject({
      method: 'GET',
      url: '/occurrence-type.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/occurrence-type.key/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
