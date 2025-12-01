import bcrypt from 'bcryptjs'
import { beforeAll, describe, expect, it } from 'vitest'

import { AccessProfileFactory } from '@/tests/factories/access-profile'
import { EmployeeFactory } from '@/tests/factories/employee'
import { createBaseApp } from '@/utils/fastify/create-base-app'

import { authRoutes } from '@/http/controllers/auth/routes'

describe('Auth employee', () => {
  const app = createBaseApp()

  beforeAll(async () => {
    await app.register(authRoutes)
  })

  it('should authenticate employee with valid credentials', async () => {
    const profile = await AccessProfileFactory.create()
    const uniqueLogin = `authuser${Date.now()}`
    const employee = await EmployeeFactory.create({
      profileId: profile.id,
      login: uniqueLogin,
      passwordHash: bcrypt.hashSync('password123', 10),
    })

    const response = await app.inject({
      method: 'POST',
      url: '/auth.employee',
      payload: {
        login: employee.login,
        password: 'password123',
      },
    })

    const data = response.json()

    expect(response.statusCode).toBe(200)
    expect(data).toHaveProperty('accessToken')
    expect(data).toHaveProperty('user')
    expect(data.user).toHaveProperty('id')
    expect(data.user).toHaveProperty('name')
    expect(data.user).toHaveProperty('permissions')
    expect(typeof data.accessToken).toBe('string')
  })

  it('should not authenticate with invalid login', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/auth.employee',
      payload: {
        login: 'nonexistent',
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(422)
    const data = response.json()
    expect(data.message).toContain('Login ou senha está incorreto')
  })

  it('should not authenticate with invalid password', async () => {
    const profile = await AccessProfileFactory.create()
    const uniqueLogin = `wrongpass${Date.now()}`
    const employee = await EmployeeFactory.create({
      profileId: profile.id,
      login: uniqueLogin,
    })

    const response = await app.inject({
      method: 'POST',
      url: '/auth.employee',
      payload: {
        login: employee.login,
        password: 'wrongpassword',
      },
    })

    expect(response.statusCode).toBe(422)
    const data = response.json()
    expect(data.message).toContain('Login ou senha está incorreto')
  })

  it('should not authenticate disabled employee', async () => {
    const profile = await AccessProfileFactory.create()
    const uniqueLogin = `disabled${Date.now()}`
    const employee = await EmployeeFactory.create({
      profileId: profile.id,
      login: uniqueLogin,
      disabledAt: new Date(),
      passwordHash: bcrypt.hashSync('password123', 10),
    })

    const response = await app.inject({
      method: 'POST',
      url: '/auth.employee',
      payload: {
        login: employee.login,
        password: 'password123',
      },
    })

    expect(response.statusCode).toBe(422)
    const data = response.json()
    expect(data.message).toContain('bloqueado')
  })
})
