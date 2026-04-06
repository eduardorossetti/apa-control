import { beforeAll, describe, expect, it } from 'vitest'

import { finalDestinationRoutes } from '@/http/controllers/final-destination/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { FinalDestinationFactory } from '@/tests/factories/final-destination'
import { FinalDestinationTypeFactory } from '@/tests/factories/final-destination-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Remove final-destination', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(finalDestinationRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should remove final-destination successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })
    const animal = await AnimalFactory.create()
    const destinationType = await FinalDestinationTypeFactory.create()
    const created = await FinalDestinationFactory.create({
      animalId: animal.id,
      destinationTypeId: destinationType.id,
      employeeId,
    })

    const response = await app.inject({
      method: 'DELETE',
      url: `/final-destination.delete/${created.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
  })

  it('should return 404 when final-destination does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })

    const response = await app.inject({
      method: 'DELETE',
      url: '/final-destination.delete/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/final-destination.delete/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
