import cookies from '@fastify/cookie'
import cors from '@fastify/cors'
import formBody from '@fastify/formbody'
import multiPart from '@fastify/multipart'
import { Decimal } from 'decimal.js'
import fastify from 'fastify'

import { env } from '@/env'
import { exceptionHandler } from '@/utils/fastify/exception-handler'
import { notFoundHandler } from '@/utils/fastify/not-found-handler'
import { getLocalhostIPs } from '@/utils/get-localhost-ips'

export function createBaseApp() {
  Decimal.prototype.toJSON = function () {
    return this.toNumber() as unknown as string
  }

  const app = fastify({
    trustProxy: getLocalhostIPs(),
    requestTimeout: 60e3 * 5,
    routerOptions: { ignoreTrailingSlash: true, caseSensitive: false },
  })

  app.setErrorHandler(exceptionHandler)
  app.setNotFoundHandler(notFoundHandler)
  app.register(cors, {
    exposedHeaders: ['X-Total-Count'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
  app.register(cookies, { secret: env.APP_SECRET, hook: 'onRequest', parseOptions: {} })
  app.register(formBody)
  app.register(multiPart, { limits: { fileSize: 15 * 1024 * 1024 } })

  return app
}
