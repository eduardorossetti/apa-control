import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listProcedureTypesSchema = apiQueryStringSchema.extend({
  name: z.string().nullish(),
  categoryIds: z
    .string()
    .transform((ids) => ids.split(',').map(String).filter(Boolean))
    .nullish(),
})
