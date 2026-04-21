import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceRoutes } from '@/http/controllers/occurrence/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceFactory } from '@/tests/factories/occurrence'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Create occurrence', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(occurrenceRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should create occurrence successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const animal = await AnimalFactory.create()
    const occurrenceType = await OccurrenceTypeFactory.create({ active: true })

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence.add',
      headers: { authorization: `Bearer ${token}` },
      payload: OccurrenceFactory.buildCreate({
        animalId: animal.id,
        occurrenceTypeId: occurrenceType.id,
      }),
    })

    const data = response.json()
    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should return 404 when animal does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const occurrenceType = await OccurrenceTypeFactory.create({ active: true })

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence.add',
      headers: { authorization: `Bearer ${token}` },
      payload: OccurrenceFactory.buildCreate({ animalId: 99999, occurrenceTypeId: occurrenceType.id }),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 404 when occurrence-type does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const animal = await AnimalFactory.create()

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence.add',
      headers: { authorization: `Bearer ${token}` },
      payload: OccurrenceFactory.buildCreate({ animalId: animal.id, occurrenceTypeId: 99999 }),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 409 when occurrence-type is inactive', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const animal = await AnimalFactory.create()
    const occurrenceType = await OccurrenceTypeFactory.create({ active: false })

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence.add',
      headers: { authorization: `Bearer ${token}` },
      payload: OccurrenceFactory.buildCreate({ animalId: animal.id, occurrenceTypeId: occurrenceType.id }),
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without role', async () => {
    const token = getAuthToken({ id: employeeId })
    const animal = await AnimalFactory.create()
    const occurrenceType = await OccurrenceTypeFactory.create({ active: true })

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence.add',
      headers: { authorization: `Bearer ${token}` },
      payload: OccurrenceFactory.buildCreate({ animalId: animal.id, occurrenceTypeId: occurrenceType.id }),
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/occurrence.add',
      payload: OccurrenceFactory.buildCreate(),
    })

    expect(response.statusCode).toBe(401)
  })
})
