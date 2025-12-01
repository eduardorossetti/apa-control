import { beforeAll, describe, expect, it } from 'vitest'

import { AnimalFactory } from '@/tests/factories/animal'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { animalRoutes } from '@/http/controllers/animal/routes'

describe('List animals', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(animalRoutes)
  })

  it('should list animals', async () => {
    await AnimalFactory.create()
    await AnimalFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'Animals'] })
    const response = await app.inject({
      method: 'GET',
      url: '/animal.list',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(2)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/animal.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/animal.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
