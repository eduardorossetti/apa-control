import { beforeAll, describe, expect, it } from 'vitest'

import { AnimalFactory } from '@/tests/factories/animal'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { animalRoutes } from '@/http/controllers/animal/routes'

describe('Get animal by id', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(animalRoutes)
  })

  it('should get animal by id', async () => {
    const animal = await AnimalFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Animals'] })

    const response = await app.inject({
      method: 'GET',
      url: `/animal.key/${animal.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(animal.id)
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('species')
  })

  it('should return 404 when animal not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Animals'] })
    const response = await app.inject({
      method: 'GET',
      url: '/animal.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/animal.key/1',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })
})
