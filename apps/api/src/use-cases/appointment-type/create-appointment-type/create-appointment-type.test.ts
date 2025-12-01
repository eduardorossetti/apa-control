import { beforeAll, describe, expect, it } from 'vitest'

import { AppointmentTypeFactory } from '@/tests/factories/appointment-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { appointmentTypeRoutes } from '@/http/controllers/appointment-type/routes'

describe('Create appointment-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(appointmentTypeRoutes)
  })

  it('should create a appointment-type', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'AppointmentTypes'] })
    const appointmentType = AppointmentTypeFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/appointment-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: appointmentType,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not create appointment-type with duplicate name', async () => {
    const existingType = await AppointmentTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'AppointmentTypes'] })
    const newType = AppointmentTypeFactory.buildCreate({
      name: existingType.name,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/appointment-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: newType,
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('Já existe um tipo de consulta cadastrado com o nome informado')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/appointment-type.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/appointment-type.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
