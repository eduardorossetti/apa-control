import { beforeAll, describe, expect, it } from 'vitest'

import { VeterinaryClinicFactory } from '@/tests/factories/veterinary-clinic'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { veterinaryClinicRoutes } from '@/http/controllers/veterinary-clinic/routes'

describe('Get veterinary-clinic by id', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(veterinaryClinicRoutes)
  })

  it('should get veterinary-clinic by id', async () => {
    const veterinaryClinic = await VeterinaryClinicFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })

    const response = await app.inject({
      method: 'GET',
      url: `/veterinary-clinic.key/${veterinaryClinic.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('id')
    expect(data.id).toBe(veterinaryClinic.id)
    expect(data).toHaveProperty('name')
  })

  it('should return 404 when veterinary-clinic not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })
    const response = await app.inject({
      method: 'GET',
      url: '/veterinary-clinic.key/99999',
      headers: { authorization: `Bearer ${token}` },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'GET',
      url: '/veterinary-clinic.key/1',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })
})
