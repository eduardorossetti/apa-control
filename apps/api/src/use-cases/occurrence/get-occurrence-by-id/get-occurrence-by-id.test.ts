import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceRoutes } from '@/http/controllers/occurrence/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceFactory } from '@/tests/factories/occurrence'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Get occurrence by id', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(occurrenceRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should return occurrence by id', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const animal = await AnimalFactory.create()
    const occurrenceType = await OccurrenceTypeFactory.create({ active: true })
    const created = await OccurrenceFactory.create({
      animalId: animal.id,
      occurrenceTypeId: occurrenceType.id,
      employeeId,
    })

    const response = await app.inject({
      method: 'GET',
      url: `/occurrence.key/${created.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id', created.id)
  })

  it('should return 404 when occurrence does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })

    const response = await app.inject({
      method: 'GET',
      url: '/occurrence.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/occurrence.key/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
