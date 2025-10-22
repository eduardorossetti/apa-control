import * as Sentry from '@sentry/node'
import { ZodError } from 'zod'

import { logError } from '@/logger'

import type { ApiError } from '@/utils/api-error'
import type { FastifyReply, FastifyRequest } from 'fastify'

export function exceptionHandler(error: ApiError, request: FastifyRequest, reply: FastifyReply) {
  if (error.statusCode === 429) {
    return reply.status(429).send({ message: 'Muitas solicitações, tente novamente mais tarde.' })
  }

  const statusCode = error instanceof ZodError ? 422 : error.statusCode || 500
  const message = error instanceof ZodError ? error.issues[0].message : error.message
  const errorPayload = { message }

  if (statusCode === 500) {
    Sentry.captureException(error, {
      extra: {
        user: request.user,
        body: request.body,
        params: request.params,
        query: request.query,
        ipAddress: request.ip,
        userAgent: request.headers['user-agent'],
      },
    })

    logError(error, {
      user: request.user,
      body: request.body,
      params: request.params,
      query: request.query,
      ipAddress: request.ip,
      userAgent: request.headers['user-agent'],
    })
  }

  return reply.status(statusCode).send(errorPayload)
}
