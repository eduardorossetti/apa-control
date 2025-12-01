import { beforeAll, describe, expect, it } from 'vitest'

import { AdopterFactory } from '@/tests/factories/adopter'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { adopterRoutes } from '@/http/controllers/adopter/routes'

describe('Get adopter by id', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(adopterRoutes)
  })

  it('should get adopter by id', async () => {
    const adopter = await AdopterFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })

    const response = await app.inject({
      method: 'GET',
      url: `/adopter.key/${adopter.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(adopter.id)
    expect(data).toHaveProperty('name')
    expect(data).toHaveProperty('cpf')
  })

  it('should return 404 when adopter not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Adopters'] })
    const response = await app.inject({
      method: 'GET',
      url: '/adopter.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/adopter.key/1',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })
})
