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

describe('Confirm adoptions (batch)', () => {
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

  it('should confirm multiple adoptions', async () => {
    const id1 = await createAdoption()
    const id2 = await createAdoption()

    const response = await app.inject({
      method: 'POST',
      url: '/adoption.confirmBatch',
      headers: { authorization: `Bearer ${token}` },
      payload: { ids: [id1, id2] },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 422 when ids is empty', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/adoption.confirmBatch',
      headers: { authorization: `Bearer ${token}` },
      payload: { ids: [] },
    })

    expect(response.statusCode).toBe(422)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/adoption.confirmBatch',
      payload: { ids: [1] },
    })

    expect(response.statusCode).toBe(401)
  })
})
