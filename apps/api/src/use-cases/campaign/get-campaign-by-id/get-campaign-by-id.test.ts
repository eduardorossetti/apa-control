import { beforeAll, describe, expect, it } from 'vitest'

import { campaignRoutes } from '@/http/controllers/campaign/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { CampaignFactory } from '@/tests/factories/campaign'
import { CampaignTypeFactory } from '@/tests/factories/campaign-type'
import { EmployeeFactory } from '@/tests/factories/employee'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Get campaign by id', () => {
  const app = createBaseApp()
  let employeeId: number
  let campaignTypeId: number

  beforeAll(async () => {
    await app.register(campaignRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    const campaignType = await CampaignTypeFactory.create()
    campaignTypeId = campaignType.id
  })

  it('should return campaign by id', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Campaigns'] })

    const created = await app.inject({
      method: 'POST',
      url: '/campaign.add',
      headers: { authorization: `Bearer ${token}` },
      payload: CampaignFactory.buildCreate({ campaignTypeId }),
    })
    const { id } = created.json()

    const response = await app.inject({
      method: 'GET',
      url: `/campaign.key/${id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id', id)
  })

  it('should return 404 when campaign does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Campaigns'] })

    const response = await app.inject({
      method: 'GET',
      url: '/campaign.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/campaign.key/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
