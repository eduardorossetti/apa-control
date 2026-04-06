import { beforeAll, describe, expect, it } from 'vitest'

import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { adoptionRoutes } from '@/http/controllers/adoption/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AdopterFactory } from '@/tests/factories/adopter'
import { AdoptionFactory } from '@/tests/factories/adoption'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('List adoptions', () => {
  const app = createBaseApp()
  let employeeId: number
  let token: string

  beforeAll(async () => {
    await app.register(adoptionRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })

    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const adopter = await AdopterFactory.create()
    await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload: AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter.id }),
    })
  })

  it('should list adoptions', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/adoption.list?page=1&perPage=10&adoptionDateStart=2020-01-01&adoptionDateEnd=2100-12-31',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(1)
    expect(response.headers['x-total-count']).toBeDefined()
  })

  it('should filter by animalName returning empty', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/adoption.list?page=1&perPage=10&adoptionDateStart=2020-01-01&adoptionDateEnd=2100-12-31&animalName=xyz-nonexistent',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it('should return 422 when adoptionDateStart is after adoptionDateEnd', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/adoption.list?page=1&perPage=10&adoptionDateStart=2100-01-01&adoptionDateEnd=2020-12-31',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(422)
  })

  it('should not access without role', async () => {
    const noRoleToken = getAuthToken({ id: employeeId })
    const response = await app.inject({
      method: 'GET',
      url: '/adoption.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/adoption.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
