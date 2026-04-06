import { beforeAll, describe, expect, it } from 'vitest'

import { AdoptionStatus, type AdoptionStatusValue } from '@/database/schema/enums/adoption-status'
import { AnimalStatus } from '@/database/schema/enums/animal-status'
import { adoptionRoutes } from '@/http/controllers/adoption/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AdopterFactory } from '@/tests/factories/adopter'
import { AdoptionFactory } from '@/tests/factories/adoption'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Confirm adoption', () => {
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

  async function createAdoption(status: AdoptionStatusValue = AdoptionStatus.PROCESSING) {
    const animal = await AnimalFactory.create({ status: AnimalStatus.ACTIVE })
    const adopter = await AdopterFactory.create()
    const res = await app.inject({
      method: 'POST',
      url: '/adoption.add',
      headers: { authorization: `Bearer ${token}` },
      payload: AdoptionFactory.buildCreate({ animalId: animal.id, adopterId: adopter.id, status }),
    })
    return res.json().id as number
  }

  it('should confirm adoption successfully', async () => {
    const id = await createAdoption()

    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.confirm',
      headers: { authorization: `Bearer ${token}` },
      payload: { id },
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 400 when adoption is already cancelled', async () => {
    const id = await createAdoption(AdoptionStatus.CANCELLED)

    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.confirm',
      headers: { authorization: `Bearer ${token}` },
      payload: { id },
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 404 when adoption does not exist', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.confirm',
      headers: { authorization: `Bearer ${token}` },
      payload: { id: 99999 },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/adoption.confirm',
      payload: { id: 1 },
    })

    expect(response.statusCode).toBe(401)
  })
})
