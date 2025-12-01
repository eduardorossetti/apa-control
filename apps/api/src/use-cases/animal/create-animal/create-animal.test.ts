import { beforeAll, describe, expect, it } from 'vitest'

import { AnimalFactory } from '@/tests/factories/animal'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { animalRoutes } from '@/http/controllers/animal/routes'

describe('Create animal', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(animalRoutes)
  })

  it('should create an animal', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Animals'] })
    const animal = AnimalFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/animal.add',
      headers: { authorization: `Bearer ${token}` },
      payload: animal,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/animal.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/animal.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
