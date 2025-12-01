import { beforeAll, describe, expect, it } from 'vitest'

import { FinalDestinationTypeFactory } from '@/tests/factories/final-destination-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { finalDestinationTypeRoutes } from '@/http/controllers/final-destination-type/routes'

describe('List final-destination-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(finalDestinationTypeRoutes)
  })

  it('should list final-destination-type', async () => {
    await FinalDestinationTypeFactory.create()
    await FinalDestinationTypeFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'FinalDestinationTypes'] })
    const response = await app.inject({
      method: 'GET',
      url: '/final-destination-type.list',
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
      url: '/final-destination-type.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/final-destination-type.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
