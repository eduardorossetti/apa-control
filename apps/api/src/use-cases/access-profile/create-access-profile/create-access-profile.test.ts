import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { ModuleFactory } from '@/tests/factories/module'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { accessProfileRoutes } from '@/http/controllers/access-profile/routes'

describe('Create access profile', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(accessProfileRoutes)
  })

  it('should create a profile', async () => {
    const module = await ModuleFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'AccessProfiles'] })
    const profile = AccessProfileFactory.buildCreate({
      permissions: [module.id],
    })

    const response = await app.inject({
      method: 'POST',
      url: '/profile.add',
      headers: { authorization: `Bearer ${token}` },
      payload: profile,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should create a profile without permissions', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'AccessProfiles'] })
    const profile = AccessProfileFactory.buildCreate({
      permissions: [],
    })

    const response = await app.inject({
      method: 'POST',
      url: '/profile.add',
      headers: { authorization: `Bearer ${token}` },
      payload: profile,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/profile.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/profile.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
