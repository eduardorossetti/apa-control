import { beforeAll, describe, expect, it } from 'vitest'

import { TransactionCategory } from '@/database/schema/enums/transaction-category'
import { expenseRoutes } from '@/http/controllers/expense/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { ExpenseFactory } from '@/tests/factories/expense'
import { TransactionTypeFactory } from '@/tests/factories/transaction-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Create expense', () => {
  const app = createBaseApp()
  let employeeId: number
  let expenseTypeId: number

  beforeAll(async () => {
    await app.register(expenseRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
    const transactionType = await TransactionTypeFactory.create({ category: TransactionCategory.EXPENSE })
    expenseTypeId = transactionType.id
  })

  it('should create expense successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Financial', 'Expenses'] })

    const response = await app.inject({
      method: 'POST',
      url: '/expense.add',
      headers: { authorization: `Bearer ${token}` },
      payload: ExpenseFactory.buildCreate({ transactionTypeId: expenseTypeId }),
    })

    const data = response.json()
    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should return 404 when transaction type does not exist', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Financial', 'Expenses'] })

    const response = await app.inject({
      method: 'POST',
      url: '/expense.add',
      headers: { authorization: `Bearer ${token}` },
      payload: ExpenseFactory.buildCreate({ transactionTypeId: 99999 }),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 400 when transaction type is not expense category', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Financial', 'Expenses'] })
    const incomeType = await TransactionTypeFactory.create({ category: TransactionCategory.INCOME })

    const response = await app.inject({
      method: 'POST',
      url: '/expense.add',
      headers: { authorization: `Bearer ${token}` },
      payload: ExpenseFactory.buildCreate({ transactionTypeId: incomeType.id }),
    })

    expect(response.statusCode).toBe(400)
  })

  it('should return 409 when transaction type is inactive', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Financial', 'Expenses'] })
    const inactiveType = await TransactionTypeFactory.create({ category: TransactionCategory.EXPENSE, active: false })

    const response = await app.inject({
      method: 'POST',
      url: '/expense.add',
      headers: { authorization: `Bearer ${token}` },
      payload: ExpenseFactory.buildCreate({ transactionTypeId: inactiveType.id }),
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without role', async () => {
    const token = getAuthToken({ id: employeeId })

    const response = await app.inject({
      method: 'POST',
      url: '/expense.add',
      headers: { authorization: `Bearer ${token}` },
      payload: ExpenseFactory.buildCreate({ transactionTypeId: expenseTypeId }),
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/expense.add',
      payload: ExpenseFactory.buildCreate({ transactionTypeId: expenseTypeId }),
    })

    expect(response.statusCode).toBe(401)
  })
})
