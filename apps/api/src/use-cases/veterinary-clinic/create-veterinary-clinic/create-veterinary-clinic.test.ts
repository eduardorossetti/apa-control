import { beforeAll, describe, expect, it } from 'vitest'

import { VeterinaryClinicFactory } from '@/tests/factories/veterinary-clinic'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { veterinaryClinicRoutes } from '@/http/controllers/veterinary-clinic/routes'

describe('Create veterinary-clinic', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(veterinaryClinicRoutes)
  })

  it('should create a veterinary-clinic', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })
    const veterinaryClinic = VeterinaryClinicFactory.buildCreate()

    const response = await app.inject({
      method: 'POST',
      url: '/veterinary-clinic.add',
      headers: { authorization: `Bearer ${token}` },
      payload: veterinaryClinic,
    })

    const data = response.json()

    expect(response.statusCode).toBe(201)
    expect(data).toHaveProperty('id')
    expect(typeof data.id).toBe('number')
  })

  it('should not create veterinary-clinic with duplicate CNPJ', async () => {
    const existingClinic = await VeterinaryClinicFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })
    const newClinic = VeterinaryClinicFactory.buildCreate({
      cnpj: existingClinic.cnpj,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/veterinary-clinic.add',
      headers: { authorization: `Bearer ${token}` },
      payload: newClinic,
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('CNPJ')
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'POST',
      url: '/veterinary-clinic.add',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {},
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/veterinary-clinic.add',
      payload: {},
    })

    expect(response.statusCode).toBe(401)
  })
})
