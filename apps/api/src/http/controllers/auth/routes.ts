import type { FastifyInstance } from 'fastify'
import { authEmployeeController } from './auth-employee/auth-employee.controller'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth.employee', { config: { rateLimit: { max: 5, timeWindow: '1 minute' } } }, authEmployeeController)
}
