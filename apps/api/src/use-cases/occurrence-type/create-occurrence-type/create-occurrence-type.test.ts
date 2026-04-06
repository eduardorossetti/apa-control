import { beforeAll, describe, expect, it } from 'vitest'

import { occurrenceTypeRoutes } from '@/http/controllers/occurrence-type/routes'
import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { OccurrenceTypeFactory } from '@/tests/factories/occurrence-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

describe('Create occurrence-type', () => {
  const app = createBaseApp()
  let employeeId: number

  beforeAll(async () => {
    await app.register(occurrenceTypeRoutes)
    const profile = await AccessProfileFactory.create()
    const employee = await EmployeeFactory.create({ profileId: profile.id })
    employeeId = employee.id
  })

  it('should create occurrence-type successfully', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations'] })

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: `Tipo Único ${Date.now()}`, description: 'Descrição', active: true },
    })

    const data = response.json()
    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should return 409 when name already exists', async () => {
    const token = getAuthToken({ id: employeeId, roles: ['AdminPanel', 'Registrations'] })
    const existing = await OccurrenceTypeFactory.create()

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: existing.name, active: true },
    })

    expect(response.statusCode).toBe(409)
  })

  it('should not access without role', async () => {
    const token = getAuthToken({ id: employeeId })

    const response = await app.inject({
      method: 'POST',
      url: '/occurrence-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Sem Role', active: true },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/occurrence-type.add',
      payload: { name: 'Sem Token', active: true },
    })

    expect(response.statusCode).toBe(401)
  })
})
