import { beforeAll, describe, expect, it } from 'vitest'

import { CampaignTypeFactory } from '@/tests/factories/campaign-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { campaignTypeRoutes } from '@/http/controllers/campaign-type/routes'

describe('Get campaign-type by id', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(campaignTypeRoutes)
  })

  it('should get campaign-type by id', async () => {
    const campaignType = await CampaignTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'CampaignTypes'] })

    const response = await app.inject({
      method: 'GET',
      url: `/campaign-type.key/${campaignType.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(campaignType.id)
    expect(data).toHaveProperty('name')
  })

  it('should return 404 when campaign-type not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'CampaignTypes'] })
    const response = await app.inject({
      method: 'GET',
      url: '/campaign-type.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/campaign-type.key/1',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })
})
