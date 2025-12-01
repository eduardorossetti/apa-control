import { beforeAll, describe, expect, it } from 'vitest'

import { ProcedureTypeFactory } from '@/tests/factories/procedure-type'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { procedureTypeRoutes } from '@/http/controllers/procedure-type/routes'

describe('Create procedure-type', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(procedureTypeRoutes)
  })

  it('should create a procedure-type', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'ProcedureTypes'] })
    const procedureType = ProcedureTypeFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/procedure-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: procedureType,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not create procedure-type with duplicate name', async () => {
    const existingType = await ProcedureTypeFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'ProcedureTypes'] })
    const newType = ProcedureTypeFactory.buildCreate({
      name: existingType.name,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/procedure-type.add',
      headers: { authorization: `Bearer ${token}` },
      payload: newType,
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('Já existe um tipo de procedimento cadastrado com o nome informado')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/procedure-type.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/procedure-type.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
