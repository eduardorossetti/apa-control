import { beforeAll, describe, expect, it } from 'vitest'

import { VeterinaryClinicFactory } from '@/tests/factories/veterinary-clinic'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { veterinaryClinicRoutes } from '@/http/controllers/veterinary-clinic/routes'

describe('List veterinary-clinic', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(veterinaryClinicRoutes)
  })

  it('should list veterinary-clinic', async () => {
    await VeterinaryClinicFactory.create()
    await VeterinaryClinicFactory.create()

    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })
    const response = await app.inject({
      method: 'GET',
      url: '/veterinary-clinic.list',
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
      url: '/veterinary-clinic.list',
      headers: { authorization: `Bearer ${noRoleToken}` },
    })

    expect(response.statusCode).toBe(403)
  })

  it('should not access without token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/veterinary-clinic.list',
    })

    expect(response.statusCode).toBe(401)
  })
})
