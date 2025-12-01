import { beforeAll, describe, expect, it } from 'vitest'

import { VeterinaryClinicFactory } from '@/tests/factories/veterinary-clinic'
import { getAuthToken } from '@/tests/utils'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { veterinaryClinicRoutes } from '@/http/controllers/veterinary-clinic/routes'

describe('Update veterinary-clinic', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(veterinaryClinicRoutes)
  })

  it('should update veterinary-clinic', async () => {
    const veterinaryClinic = await VeterinaryClinicFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })
    const updatedData = VeterinaryClinicFactory.buildCreate()

    const response = await app.inject({
      method: 'PUT',
      url: '/veterinary-clinic.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: veterinaryClinic.id,
        ...updatedData,
      },
    })

    expect(response.statusCode).toBe(204)

    const getResponse = await app.inject({
      method: 'GET',
      url: `/veterinary-clinic.key/${veterinaryClinic.id}`,
      headers: { authorization: `Bearer ${token}` },
    })

    const data = getResponse.json()
    expect(data.name).toBe(updatedData.name)
  })

  it('should not update veterinary-clinic with duplicate CNPJ', async () => {
    const clinic1 = await VeterinaryClinicFactory.create()
    const clinic2 = await VeterinaryClinicFactory.create()
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })

    const getResponse = await app.inject({
      method: 'GET',
      url: `/veterinary-clinic.key/${clinic2.id}`,
      headers: { authorization: `Bearer ${token}` },
    })
    const clinic2Data = getResponse.json()

    const updateData = VeterinaryClinicFactory.buildCreate()
    const response = await app.inject({
      method: 'PUT',
      url: '/veterinary-clinic.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: clinic1.id,
        ...updateData,
        cnpj: clinic2Data.cnpj,
      },
    })

    expect(response.statusCode).toBe(409)
    const data = response.json()
    expect(data.message).toContain('CNPJ')
  })

  it('should return 404 when veterinary-clinic not found', async () => {
    const token = getAuthToken({ roles: ['AdminPanel', 'Registrations', 'VeterinaryClinics'] })
    const response = await app.inject({
      method: 'PUT',
      url: '/veterinary-clinic.update',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        id: 99999,
        ...VeterinaryClinicFactory.buildCreate(),
      },
    })

    expect(response.statusCode).toBe(404)
  })

  it('should not access without token roles', async () => {
    const noRoleToken = getAuthToken()
    const response = await app.inject({
      method: 'PUT',
      url: '/veterinary-clinic.update',
      headers: { authorization: `Bearer ${noRoleToken}` },
      payload: {
        id: 99999,
        ...VeterinaryClinicFactory.buildCreate(),
      },
    })

    expect(response.statusCode).toBe(403)
  })
})
