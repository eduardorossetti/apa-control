import { beforeAll, describe, expect, it } from 'vitest'

import { AdopterFactory } from '@/tests/factories/adopter'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { adopterRoutes } from '@/http/controllers/adopter/routes'

describe('List adopters', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(adopterRoutes)
  })

  it('should list adopters', async () => {
    await AdopterFactory.create()
    await AdopterFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })
    const response = await app.inject({
      method: 'GET',
      url: '/adopter.list',
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
      url: '/adopter.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/adopter.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
