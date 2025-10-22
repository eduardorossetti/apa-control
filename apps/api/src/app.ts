import rateLimit from '@fastify/rate-limit'

import { rateLimitOptions } from './config/rate-limit'
import { accessProfileRoutes } from './http/controllers/access-profile/routes'
import { authRoutes } from './http/controllers/auth/routes'
import { createBaseApp } from './utils/fastify/create-base-app'

const app = createBaseApp()

app.register(rateLimit, rateLimitOptions)
app.register(authRoutes)
app.register(accessProfileRoutes)

export { app }
