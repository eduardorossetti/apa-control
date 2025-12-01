import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { accessProfileRoutes } from '@/http/controllers/access-profile/routes'

describe('List access profiles', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(accessProfileRoutes)
  })

  it('should list access profiles', async () => {
    await AccessProfileFactory.create()
    await AccessProfileFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'AccessProfiles'] })
    const response = await app.inject({
      method: 'GET',
      url: '/profile.list',
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
      url: '/profile.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/profile.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
