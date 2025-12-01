import { beforeAll, describe, expect, it } from 'vitest'

import { FinalDestinationTypeFactory } from '@/tests/factories/final-destination-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { finalDestinationTypeRoutes } from '@/http/controllers/final-destination-type/routes'

describe('Create final-destination-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(finalDestinationTypeRoutes)
  })

  it('should create a final-destination-type', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'FinalDestinationTypes'] })
    const finalDestinationType = FinalDestinationTypeFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: finalDestinationType,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not create final-destination-type with duplicate name', async () => {
    const existingType = await FinalDestinationTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'FinalDestinationTypes'] })
    const newType = FinalDestinationTypeFactory.buildCreate({
      name: existingType.name,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/final-destination-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: newType,
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('Já existe um tipo de destino final cadastrado com o nome informado')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/final-destination-type.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/final-destination-type.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
