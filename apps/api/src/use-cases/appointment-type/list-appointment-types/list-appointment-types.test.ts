import { beforeAll, describe, expect, it } from 'vitest'

import { AppointmentTypeFactory } from '@/tests/factories/appointment-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { appointmentTypeRoutes } from '@/http/controllers/appointment-type/routes'

describe('List appointment-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(appointmentTypeRoutes)
  })

  it('should list appointment-type', async () => {
    await AppointmentTypeFactory.create()
    await AppointmentTypeFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'AppointmentTypes'] })
    const response = await app.inject({
      method: 'GET',
      url: '/appointment-type.list',
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
      url: '/appointment-type.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/appointment-type.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
