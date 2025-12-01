import { beforeAll, describe, expect, it } from 'vitest'

import { CampaignTypeFactory } from '@/tests/factories/campaign-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { campaignTypeRoutes } from '@/http/controllers/campaign-type/routes'

describe('Create campaign-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(campaignTypeRoutes)
  })

  it('should create a campaign-type', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'CampaignTypes'] })
    const campaignType = CampaignTypeFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/campaign-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: campaignType,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not create campaign-type with duplicate name', async () => {
    const existingType = await CampaignTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'CampaignTypes'] })
    const newType = CampaignTypeFactory.buildCreate({
      name: existingType.name,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/campaign-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: newType,
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('Já existe um tipo de campanha cadastrado com o nome informado')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/campaign-type.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/campaign-type.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
