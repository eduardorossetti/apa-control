import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AdopterFactory } from '@/tests/factories/adopter'
import { AdoptionFactory } from '@/tests/factories/adoption'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { adoptionRoutes } from '@/http/controllers/adoption/routes'

describe('Create adoption', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(adoptionRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should create adoption successfully', async () => {
    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const adopter = await AdopterFactory.create()
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })
    const payload = AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter.id })

    const response = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should return 404 when animal does not exist', async () => {
    const adopter = await AdopterFactory.create()
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })
    const payload = AdoptionFactory.buildCreate({ animalId: 99999, adopterId: adopter.id })

    const response = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload,
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 404 when adopter does not exist', async () => {
    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })
    const payload = AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: 99999 })

    const response = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload,
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 409 when animal already has an adoption', async () => {
    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const adopter1 = await AdopterFactory.create()
    const adopter2 = await AdopterFactory.create()
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })

    await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload: AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter1.id }),
    })

    const response = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload: AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter2.id }),
    })

    expect(response.statusCode).toBe(409)
  })

  it('should return 409 when animal is inactive', async () => {
    const animal = await AnimalFactory.create({ status: AnimalStatus.INACTIVE })
    const adopter = await AdopterFactory.create()
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })
    const payload = AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter.id })

    const response = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload,
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without role', async () => {
    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const adopter = await AdopterFactory.create()
    const token = getAuthToken({ id: employeeId })
    const payload = AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter.id })

    const response = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload,
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      payload: AdoptionFactory.buildCreate(),
    })

    expect(response.statusCode).toBe(401)
  })
})
