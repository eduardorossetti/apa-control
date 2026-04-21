import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceTypeRoutes } from '@/http/controllers/occurrence-type/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Update occurrence-type', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(occurrenceTypeRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should update occurrence-type successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations', 'OccurrenceTypes'] })
    const created = await OccurrenceTypeFactory.create()

    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence-type.update',
      headers: { authorization: `Bearer ${token}` },
      payload: { id: created.id, name: `Nome Atualizado ${Date.now()}`, active: false },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when occurrence-type does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations', 'OccurrenceTypes'] })

    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence-type.update',
      headers: { authorization: `Bearer ${token}` },
      payload: { id: 99999, name: 'Inexistente', active: true },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 409 when name conflicts with another occurrence-type', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations', 'OccurrenceTypes'] })
    const other = await OccurrenceTypeFactory.create()
    const target = await OccurrenceTypeFactory.create()

    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence-type.update',
      headers: { authorization: `Bearer ${token}` },
      payload: { id: target.id, name: other.name, active: true },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence-type.update',
      payload: { id: 1, name: 'Sem Token', active: true },
    })

    expect(response.statusCode).toBe(401)
  })
})
