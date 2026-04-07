import { beforeAll, describe, expect, it } from 'vitest'

import { TransactionCategory } from '@/database/schema/enums/transaction-category'
import { revenueRoutes } from '@/http/controllers/revenue/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { AnimalFactory } from '@/tests/factories/animal'
import { EmployeeFactory } from '@/tests/factories/employee'
import { RevenueFactory } from '@/tests/factories/revenue'
import { TransactionTypeFactory } from '@/tests/factories/transaction-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('List revenues', () => {
  const app = createBaseApp()
  let employeeId: number
  let token: string

  beforeAll(async () => {
    await app.register(revenueRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Financial', 'Revenues'] })

    const transactionType = await TransactionTypeFactory.create({ category: TransactionCategory.INCOME })
    await app.inject({
      method: 'POST',
      url: '/revenue.add',
      headers: { authorization: `Bearer ${token}` },
      payload: RevenueFactory.buildCreate({ transactionTypeId: transactionType.id }),
    })
  })

  it('should list revenues', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/revenue.list?page=1&perPage=10',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThanOrEqual(1)
    expect(response.headers['x-total-count']).toBeDefined()
  })

  it('should filter by description returning empty', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/revenue.list?page=1&perPage=10&description=xyz-nonexistent',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
  })

  it('should filter by animalName', async () => {
    const animal = await AnimalFactory.create({ name: 'Filtro Receita Animal' })
    const transactionType = await TransactionTypeFactory.create({ category: TransactionCategory.INCOME })

    await app.inject({
      method: 'POST',
      url: '/revenue.add',
      headers: { authorization: `Bearer ${token}` },
      payload: RevenueFactory.buildCreate({ transactionTypeId: transactionType.id, animalId: animal.id }),
    })

    const response = await app.inject({
      method: 'GET',
      url: '/revenue.list?page=1&perPage=10&animalName=Filtro%20Receita',
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.some((item: { animalName?: string | null }) => item.animalName?.includes('Filtro Receita'))).toBe(true)
  })

  it('should not access without role', async () => {
    const noRoleToken = getAuthToken({ id: employeeId })
    const response = await app.inject({
      method: 'GET',
      url: '/revenue.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/revenue.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
