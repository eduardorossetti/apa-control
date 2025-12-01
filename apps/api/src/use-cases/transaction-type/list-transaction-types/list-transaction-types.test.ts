import { beforeAll, describe, expect, it } from 'vitest'

import { TransactionTypeFactory } from '@/tests/factories/transaction-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { transactionTypeRoutes } from '@/http/controllers/transaction-type/routes'

describe('List transaction-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(transactionTypeRoutes)
  })

  it('should list transaction-type', async () => {
    await TransactionTypeFactory.create()
    await TransactionTypeFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'TransactionTypes'] })
    const response = await app.inject({
      method: 'GET',
      url: '/transaction-type.list',
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
      url: '/transaction-type.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/transaction-type.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
