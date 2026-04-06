import { beforeAll, describe, expect, it } from 'vitest'

import { finalDestinationRoutes } from '@/http/controllers/final-destination/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { FinalDestinationFactory } from '@/tests/factories/final-destination'
import { FinalDestinationTypeFactory } from '@/tests/factories/final-destination-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Create final-destination', () => {
  const app = createBaseApp()
  let employeeId: number
  let destinationTypeId: number

  beforeAll(async () => {
    await app.register(finalDestinationRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    const destinationType = await FinalDestinationTypeFactory.create({ active: true })
    destinationTypeId = destinationType.id
  })

  it('should create final-destination successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal = await AnimalFactory.create({ rescueAt: new Date() })

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      headers: { authorization: `Bearer ${token}` },
      payload: FinalDestinationFactory.buildCreate({ animalId: animal.id, destinationTypeId }),
    })

    const data = response.json()
    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should return 404 when animal does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      headers: { authorization: `Bearer ${token}` },
      payload: FinalDestinationFactory.buildCreate({ animalId: 99999, destinationTypeId }),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 404 when destination type does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal = await AnimalFactory.create({ rescueAt: new Date() })

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      headers: { authorization: `Bearer ${token}` },
      payload: FinalDestinationFactory.buildCreate({ animalId: animal.id, destinationTypeId: 99999 }),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when animal has no rescue', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal = await AnimalFactory.create({ rescueAt: null })

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      headers: { authorization: `Bearer ${token}` },
      payload: FinalDestinationFactory.buildCreate({ animalId: animal.id, destinationTypeId }),
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 409 when animal already has a final-destination', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal = await AnimalFactory.create({ rescueAt: new Date() })

    await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      headers: { authorization: `Bearer ${token}` },
      payload: FinalDestinationFactory.buildCreate({ animalId: animal.id, destinationTypeId }),
    })

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      headers: { authorization: `Bearer ${token}` },
      payload: FinalDestinationFactory.buildCreate({ animalId: animal.id, destinationTypeId }),
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without role', async () => {
    const token = getAuthToken({ id: employeeId })
    const animal = await AnimalFactory.create({ rescueAt: new Date() })

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      headers: { authorization: `Bearer ${token}` },
      payload: FinalDestinationFactory.buildCreate({ animalId: animal.id, destinationTypeId }),
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/final-destination.add',
      payload: FinalDestinationFactory.buildCreate(),
    })

    expect(response.statusCode).toBe(401)
  })
})
