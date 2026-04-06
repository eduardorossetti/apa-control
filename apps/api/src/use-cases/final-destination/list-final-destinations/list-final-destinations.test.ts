import { beforeAll, describe, expect, it } from 'vitest'

import { finalDestinationRoutes } from '@/http/controllers/final-destination/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { FinalDestinationFactory } from '@/tests/factories/final-destination'
import { FinalDestinationTypeFactory } from '@/tests/factories/final-destination-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('List final-destinations', () => {
  const app = createBaseApp()
  let employeeId: number
  let token: string

  beforeAll(async () => {
    await app.register(finalDestinationRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'FinalDestinations'] })

    const animal = await AnimalFactory.create()
    const destinationType = await FinalDestinationTypeFactory.create()
    await FinalDestinationFactory.create({ animalId: animal.id, destinationTypeId: destinationType.id, employeeId })
  })

  it('should list final-destinations', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/final-destination.list?page=1&perPage=10',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(1)
    expect(response.headers['x-total-count']).toBeDefined()
  })

  it('should not access without role', async () => {
    const noRoleToken = getAuthToken({ id: employeeId })

    const response = await app.inject({
      method: 'GET',
      url: '/final-destination.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/final-destination.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
