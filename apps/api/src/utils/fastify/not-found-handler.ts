import { env } from '@/env'

import type { FastifyReply, FastifyRequest } from 'fastify'

export function notFoundHandler(_request: FastifyRequest, reply: FastifyReply) {
  reply
    .code(404)
    .type('text/html')
    .send(`<!DOCTYPE html><html lang="pt-BR"><head><title>${env.APP_NAME}</title></head></html>`)
}
