import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listAnimalsSchema = apiQueryStringSchema.extend({
  name: z.string().optional(),
  species: z.string().optional(),
  breed: z.string().optional(),
  status: z.string().optional(),
  available: z.preprocess((v) => v === 'true' || v === true, z.boolean()).optional(),
  show: z.enum(['all', 'disabled', 'enabled']).default('all'),
  exportType: z.enum(['csv', 'xlsx', 'pdf']).optional(),
})
