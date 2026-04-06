import { beforeAll, describe, expect, it } from 'vitest'

import { TransactionCategory } from '@/database/schema/enums/transaction-category'
import { expenseRoutes } from '@/http/controllers/expense/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { ExpenseFactory } from '@/tests/factories/expense'
import { TransactionTypeFactory } from '@/tests/factories/transaction-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Update expense', () => {
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

  async function createExpense() {
    const res = await app.inject({
      method: 'POST',
      url: '/expense.add',
      headers: { authorization: `Bearer ${token}` },
      payload: ExpenseFactory.buildCreate({ transactionTypeId: expenseTypeId }),
    })
    return res.json().id as number
  }

  it('should update expense successfully', async () => {
    const id = await createExpense()

    const response = await app.inject({
      method: 'PUT',
      url: '/expense.update',
      headers: { authorization: `Bearer ${token}` },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      payload: ExpenseFactory.buildCreate({ id, transactionTypeId: expenseTypeId } as any),
    })

    expect(response.statusCode).toBe(204)
  })

  it('should return 404 when expense does not exist', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/expense.update',
      headers: { authorization: `Bearer ${token}` },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      payload: ExpenseFactory.buildCreate({ id: 99999, transactionTypeId: expenseTypeId } as any),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should return 404 when transaction type does not exist', async () => {
    const id = await createExpense()

    const response = await app.inject({
      method: 'PUT',
      url: '/expense.update',
      headers: { authorization: `Bearer ${token}` },
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      payload: ExpenseFactory.buildCreate({ id, transactionTypeId: 99999 } as any),
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/expense.update',
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      payload: ExpenseFactory.buildCreate({ id: 1, transactionTypeId: expenseTypeId } as any),
    })

    expect(response.statusCode).toBe(401)
  })
})
