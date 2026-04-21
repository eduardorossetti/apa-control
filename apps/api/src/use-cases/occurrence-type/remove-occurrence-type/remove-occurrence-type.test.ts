import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceTypeRoutes } from '@/http/controllers/occurrence-type/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceFactory } from '@/tests/factories/occurrence'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Remove occurrence-type', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(occurrenceTypeRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should remove occurrence-type successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations', 'OccurrenceTypes'] })
    const created = await OccurrenceTypeFactory.create()

    const response = await app.inject({
      method: 'DELETE',
      url: `/occurrence-type.delete/${created.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when occurrence-type does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations', 'OccurrenceTypes'] })

    const response = await app.inject({
      method: 'DELETE',
      url: '/occurrence-type.delete/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 409 when occurrence-type is in use', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations', 'OccurrenceTypes'] })
    const occurrenceTypeRecord = await OccurrenceTypeFactory.create()
    const animal = await AnimalFactory.create()
    await OccurrenceFactory.create({
      animalId: animal.id,
      occurrenceTypeId: occurrenceTypeRecord.id,
      employeeId,
    })

    const response = await app.inject({
      method: 'DELETE',
      url: `/occurrence-type.delete/${occurrenceTypeRecord.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/occurrence-type.delete/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
