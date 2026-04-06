import { beforeAll, describe, expect, it } from 'vitest'

import { TransactionCategory } from '@/database/schema/enums/transaction-category'
import { expenseRoutes } from '@/http/controllers/expense/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { ExpenseFactory } from '@/tests/factories/expense'
import { TransactionTypeFactory } from '@/tests/factories/transaction-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Get expense by id', () => {
  const app = createBaseApp()
  let employeeId: number
  let expenseTypeId: number
  let token: string

  beforeAll(async () => {
    await app.register(expenseRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Financial', 'Expenses'] })
    const transactionType = await TransactionTypeFactory.create({ category: TransactionCategory.EXPENSE })
    expenseTypeId = transactionType.id
  })

  it('should return expense by id', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/expense.add',
      headers: { authorization: `Bearer ${token}` },
      payload: ExpenseFactory.buildCreate({ transactionTypeId: expenseTypeId }),
    })
    const { id } = created.json()

    const response = await app.inject({
      method: 'GET',
      url: `/expense.key/${id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()
    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id', id)
  })

  it('should return 404 when expense does not exist', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/expense.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/expense.key/1',
    })

    expect(response.statusCode).toBe(401)
  })
})
