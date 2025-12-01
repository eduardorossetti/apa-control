import { beforeAll, describe, expect, it } from 'vitest'

import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { dashboardRoutes } from '@/http/controllers/dashboard/routes'

describe('Get dashboard stats', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(dashboardRoutes)
  })

  it('should get dashboard stats', async () => {
    const token = getAuthToken({ roles: ['AdminPanel'] })
    const currentYear = new Date().getFullYear()

    const response = await app.inject({
      method: 'GET',
      url: `/dashboard.stats?year=${currentYear}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('stats')
    expect(data).toHaveProperty('monthlyStats')
    expect(data).toHaveProperty('financialStats')
  })

  it('should get dashboard stats with default year', async () => {
    const token = getAuthToken({ roles: ['AdminPanel'] })

    const response = await app.inject({
      method: 'GET',
      url: '/dashboard.stats',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('stats')
    expect(data).toHaveProperty('monthlyStats')
    expect(data).toHaveProperty('financialStats')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/dashboard.stats',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/dashboard.stats',
    })

    expect(response.statusCode).toBe(401)
  })
})
