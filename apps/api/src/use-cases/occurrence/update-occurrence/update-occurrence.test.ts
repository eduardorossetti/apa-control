import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceRoutes } from '@/http/controllers/occurrence/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceFactory } from '@/tests/factories/occurrence'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Update occurrence', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(occurrenceRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should update occurrence successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const animal = await AnimalFactory.create()
    const occurrenceType = await OccurrenceTypeFactory.create({ active: true })
    const created = await OccurrenceFactory.create({
      animalId: animal.id,
      occurrenceTypeId: occurrenceType.id,
      employeeId,
    })

    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: created.id,
        animalId: animal.id,
        occurrenceTypeId: occurrenceType.id,
        occurrenceDate: new Date().toISOString(),
        description: 'Descrição atualizada',
      },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when occurrence does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const animal = await AnimalFactory.create()
    const occurrenceType = await OccurrenceTypeFactory.create({ active: true })

    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: 99999,
        animalId: animal.id,
        occurrenceTypeId: occurrenceType.id,
        occurrenceDate: new Date().toISOString(),
        description: 'Inexistente',
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 409 when occurrence-type is inactive', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })
    const animal = await AnimalFactory.create()
    const activeType = await OccurrenceTypeFactory.create({ active: true })
    const inactiveType = await OccurrenceTypeFactory.create({ active: false })
    const created = await OccurrenceFactory.create({ animalId: animal.id, occurrenceTypeId: activeType.id, employeeId })

    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: created.id,
        animalId: animal.id,
        occurrenceTypeId: inactiveType.id,
        occurrenceDate: new Date().toISOString(),
        description: 'Atualização',
      },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/occurrence.update',
      payload: { id: 1, animalId: 1, occurrenceTypeId: 1, occurrenceDate: new Date().toISOString(), description: 'x' },
    })

    expect(response.statusCode).toBe(401)
  })
})
