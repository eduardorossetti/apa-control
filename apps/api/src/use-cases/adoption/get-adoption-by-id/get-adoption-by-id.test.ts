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

describe('Get adoption by id', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(adoptionRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should return adoption by id', async () => {
    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const adopter = await AdopterFactory.create()
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })

    const created = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload: AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter.id }),
    })
    const { id } = created.json()

    const response = await app.inject({
      method: 'GET',
      url: `/adoption.key/${id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id', id)
  })

  it('should return 404 when adoption does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })

    const response = await app.inject({
      method: 'GET',
      url: '/adoption.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/adoption.key/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
