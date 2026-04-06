import { beforeAll, describe, expect, it } from 'vitest'

import { finalDestinationRoutes } from '@/http/controllers/final-destination/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { FinalDestinationFactory } from '@/tests/factories/final-destination'
import { FinalDestinationTypeFactory } from '@/tests/factories/final-destination-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Update final-destination', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(finalDestinationRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should update final-destination successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal = await AnimalFactory.create()
    const destinationType = await FinalDestinationTypeFactory.create()
    const created = await FinalDestinationFactory.create({
      animalId: animal.id,
      destinationTypeId: destinationType.id,
      employeeId,
    })

    const response = await app.inject({
      method: 'PUT',
      url: '/final-destination.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: created.id,
        animalId: animal.id,
        destinationTypeId: destinationType.id,
        destinationDate: new Date().toISOString().split('T')[0],
        reason: 'Motivo atualizado',
      },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when final-destination does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal = await AnimalFactory.create()
    const destinationType = await FinalDestinationTypeFactory.create()

    const response = await app.inject({
      method: 'PUT',
      url: '/final-destination.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: 99999,
        animalId: animal.id,
        destinationTypeId: destinationType.id,
        destinationDate: new Date().toISOString().split('T')[0],
        reason: 'Inexistente',
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 409 when trying to assign another animal that already has a final-destination', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal1 = await AnimalFactory.create()
    const animal2 = await AnimalFactory.create()
    const destinationType = await FinalDestinationTypeFactory.create()
    const fd1 = await FinalDestinationFactory.create({
      animalId: animal1.id,
      destinationTypeId: destinationType.id,
      employeeId,
    })
    await FinalDestinationFactory.create({ animalId: animal2.id, destinationTypeId: destinationType.id, employeeId })

    const response = await app.inject({
      method: 'PUT',
      url: '/final-destination.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: fd1.id,
        animalId: animal2.id,
        destinationTypeId: destinationType.id,
        destinationDate: new Date().toISOString().split('T')[0],
        reason: 'Conflito',
      },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/final-destination.update',
      payload: { id: 1, animalId: 1, destinationTypeId: 1, destinationDate: '2024-01-01', reason: 'x' },
    })

    expect(response.statusCode).toBe(401)
  })
})
