import type { RateLimitPluginOptions } from '@fastify/rate-limit'
import type { FastifyRequest } from 'fastify'

export const rateLimitOptions: RateLimitPluginOptions = {
  global: false,
  max: 20,
  timeWindow: '1 day',
  nameSpace: 'ratelimit:',
  keyGenerator: (request: FastifyRequest) => request.ip || '127.0.0.1',
}
