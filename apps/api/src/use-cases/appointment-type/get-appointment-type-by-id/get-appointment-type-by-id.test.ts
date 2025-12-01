import { beforeAll, describe, expect, it } from 'vitest'

import { AppointmentTypeFactory } from '@/tests/factories/appointment-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { appointmentTypeRoutes } from '@/http/controllers/appointment-type/routes'

describe('Get appointment-type by id', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(appointmentTypeRoutes)
  })

  it('should get appointment-type by id', async () => {
    const appointmentType = await AppointmentTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'AppointmentTypes'] })

    const response = await app.inject({
      method: 'GET',
      url: `/appointment-type.key/${appointmentType.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(appointmentType.id)
    expect(data).toHaveProperty('name')
  })

  it('should return 404 when appointment-type not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'AppointmentTypes'] })
    const response = await app.inject({
      method: 'GET',
      url: '/appointment-type.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/appointment-type.key/1',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })
})
