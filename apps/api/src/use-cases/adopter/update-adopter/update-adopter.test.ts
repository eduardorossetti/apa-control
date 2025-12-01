import { beforeAll, describe, expect, it } from 'vitest'

import { AdopterFactory } from '@/tests/factories/adopter'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { adopterRoutes } from '@/http/controllers/adopter/routes'

describe('Update adopter', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(adopterRoutes)
  })

  it('should update adopter', async () => {
    const adopter = await AdopterFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })
    const updatedData = AdopterFactory.buildCreate()

    const response = await app.inject({
      method: 'PUT',
      url: '/adopter.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: adopter.id,
        ...updatedData,
      },
    })

    expect(response.statusCode).toBe(204)

    const getResponse = await app.inject({
      method: 'GET',
      url: `/adopter.key/${adopter.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = getResponse.json()
    expect(data.name).toBe(updatedData.name)
  })

  it('should not update adopter with duplicate CPF', async () => {
    const adopter1 = await AdopterFactory.create()
    const adopter2 = await AdopterFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })

    const getResponse = await app.inject({
      method: 'GET',
      url: `/adopter.key/${adopter2.id}`,
      headers: { authorization: `Bearer ${token}` },
    })
    const adopter2Data = getResponse.json()

    const updateData = AdopterFactory.buildCreate()
    const response = await app.inject({
      method: 'PUT',
      url: '/adopter.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: adopter1.id,
        ...updateData,
        cpf: adopter2Data.cpf,
      },
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('CPF')
  })

  it('should return 404 when adopter not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })
    const response = await app.inject({
      method: 'PUT',
      url: '/adopter.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: 99999,
        ...AdopterFactory.buildCreate(),
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'PUT',
      url: '/adopter.update',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {
        id: 99999,
        ...AdopterFactory.buildCreate(),
      },
    })

    expect(response.statusCode).toBe(403)
  })
})
