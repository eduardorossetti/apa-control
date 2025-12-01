import { beforeAll, describe, expect, it } from 'vitest'

import { TransactionTypeFactory } from '@/tests/factories/transaction-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { transactionTypeRoutes } from '@/http/controllers/transaction-type/routes'

describe('Create transaction-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(transactionTypeRoutes)
  })

  it('should create a transaction-type', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'TransactionTypes'] })
    const transactionType = TransactionTypeFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/transaction-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: transactionType,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not create transaction-type with duplicate name', async () => {
    const existingType = await TransactionTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'TransactionTypes'] })
    const newType = TransactionTypeFactory.buildCreate({
      name: existingType.name,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/transaction-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: newType,
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('Já existe um tipo de transação cadastrado com o nome informado')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/transaction-type.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/transaction-type.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
