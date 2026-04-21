import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceRoutes } from '@/http/controllers/occurrence/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceFactory } from '@/tests/factories/occurrence'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('List occurrences', () => {
  const app = createBaseApp()
  let employeeId: number
  let token: string

  beforeAll(async () => {
    await app.register(occurrenceRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Occurrences'] })

    const animal = await AnimalFactory.create()
    const occurrenceType = await OccurrenceTypeFactory.create({ active: true })
    await OccurrenceFactory.create({ animalId: animal.id, occurrenceTypeId: occurrenceType.id, employeeId })
  })

  it('should list occurrences', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/occurrence.list?page=1&perPage=10',
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
      url: '/occurrence.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/occurrence.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
