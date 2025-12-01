import { beforeAll, describe, expect, it } from 'vitest'

import { CampaignTypeFactory } from '@/tests/factories/campaign-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { campaignTypeRoutes } from '@/http/controllers/campaign-type/routes'

describe('List campaign-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(campaignTypeRoutes)
  })

  it('should list campaign-type', async () => {
    await CampaignTypeFactory.create()
    await CampaignTypeFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'CampaignTypes'] })
    const response = await app.inject({
      method: 'GET',
      url: '/campaign-type.list',
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
      url: '/campaign-type.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/campaign-type.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
