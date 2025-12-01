import { beforeAll, describe, expect, it } from 'vitest'

import { FinalDestinationTypeFactory } from '@/tests/factories/final-destination-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { finalDestinationTypeRoutes } from '@/http/controllers/final-destination-type/routes'

describe('Get final-destination-type by id', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(finalDestinationTypeRoutes)
  })

  it('should get final-destination-type by id', async () => {
    const finalDestinationType = await FinalDestinationTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'FinalDestinationTypes'] })

    const response = await app.inject({
      method: 'GET',
      url: `/final-destination-type.key/${finalDestinationType.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(finalDestinationType.id)
    expect(data).toHaveProperty('name')
  })

  it('should return 404 when final-destination-type not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'FinalDestinationTypes'] })
    const response = await app.inject({
      method: 'GET',
      url: '/final-destination-type.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/final-destination-type.key/1',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })
})
