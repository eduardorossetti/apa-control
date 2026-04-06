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

describe('Remove adoption', () => {
  const app = createBaseApp()
  let employeeId: number
  let token: string

  beforeAll(async () => {
    await app.register(adoptionRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Adoptions'] })
  })

  async function createAdoption() {
    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const adopter = await AdopterFactory.create()
    const res = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload: AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter.id }),
    })
    return res.json().id as number
  }

  it('should remove adoption successfully', async () => {
    const id = await createAdoption()

    const response = await app.inject({
      method: 'DELETE',
      url: `/adoption.delete/${id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(200)
  })

  it('should return 404 when adoption does not exist', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/adoption.delete/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/adoption.delete/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
