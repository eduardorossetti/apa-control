import { beforeAll, describe, expect, it } from 'vitest'

import { ModuleFactory } from '@/tests/factories/module'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { accessProfileRoutes } from '@/http/controllers/access-profile/routes'

describe('List modules', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(accessProfileRoutes)
  })

  it('should list modules', async () => {
    await ModuleFactory.create()
    await ModuleFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'AccessProfiles'] })
    const response = await app.inject({
      method: 'GET',
      url: '/profile.modules',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id')
      expect(data[0]).toHaveProperty('title')
    }
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/profile.modules',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/profile.modules',
    })

    expect(response.statusCode).toBe(401)
  })
})
