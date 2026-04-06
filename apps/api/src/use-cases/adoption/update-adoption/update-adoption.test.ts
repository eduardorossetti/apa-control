import { beforeAll, describe, expect, it } from 'vitest'

import { AdoptionStatus } from '@/database/schema/enums/adoption-status'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { adoptionRoutes } from '@/http/controllers/adoption/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AdopterFactory } from '@/tests/factories/adopter'
import { AdoptionFactory } from '@/tests/factories/adoption'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Update adoption', () => {
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
    return { id: res.json().id as number, adopter }
  }

  it('should update adoption successfully', async () => {
    const { id, adopter } = await createAdoption()
    const newAdopter = await AdopterFactory.create()

    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.update',
      headers: { authorization: `Bearer ${token}` },
      payload: AdoptionFactory.buildCreate({
        id,
        adopterId: newAdopter.id,
        status: AdoptionStatus.PROCESSING,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      } as any),
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when adoption does not exist', async () => {
    const adopter = await AdopterFactory.create()

    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.update',
      headers: { authorization: `Bearer ${token}` },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      payload: AdoptionFactory.buildCreate({ id: 99999, adopterId: adopter.id } as any),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 404 when adopter does not exist', async () => {
    const { id } = await createAdoption()

    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.update',
      headers: { authorization: `Bearer ${token}` },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      payload: AdoptionFactory.buildCreate({ id, adopterId: 99999 } as any),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.update',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      payload: AdoptionFactory.buildCreate({ id: 1 } as any),
    })

    expect(response.statusCode).toBe(401)
  })
})
