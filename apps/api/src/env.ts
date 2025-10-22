import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().transform(Number).optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_URL: z.string(),
  APP_SECRET: z.string(),
  APP_NAME: z.string(),
  APP_LOG_DIR: z.string().optional(),
  DATABASE_URL: z.string(),
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().transform(Number),
  EMAIL_USER: z.string(),
  EMAIL_PASSWORD: z.string(),
  OVERRIDE_EMAIL: z.string().optional(),
})

export const env = envSchema.parse(process.env)
