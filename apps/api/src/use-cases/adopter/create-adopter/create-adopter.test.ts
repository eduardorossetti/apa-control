import { beforeAll, describe, expect, it } from 'vitest'

import { AdopterFactory } from '@/tests/factories/adopter'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { adopterRoutes } from '@/http/controllers/adopter/routes'

describe('Create adopter', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(adopterRoutes)
  })

  it('should create an adopter', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })
    const adopter = AdopterFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/adopter.add',
      headers: { authorization: `Bearer ${token}` },
      payload: adopter,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not create adopter with duplicate CPF', async () => {
    const existingAdopter = await AdopterFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })
    const newAdopter = AdopterFactory.buildCreate({
      cpf: existingAdopter.cpf,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/adopter.add',
      headers: { authorization: `Bearer ${token}` },
      payload: newAdopter,
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('CPF')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/adopter.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/adopter.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
