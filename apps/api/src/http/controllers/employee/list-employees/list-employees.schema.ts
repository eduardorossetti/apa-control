import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listEmployeesSchema = apiQueryStringSchema.extend({
  name: z.string().optional(),
  login: z.string().optional(),
  cpf: z
    .string()
    .transform((cpf) => cpf.replace(/\D/g, ''))
    .optional(),
  profileIds: z
    .string()
    .transform((ids) => ids.split(',').map(Number).filter(Boolean))
    .optional(),
  show: z.enum(['all', 'disabled', 'enabled']).default('all'),
})
