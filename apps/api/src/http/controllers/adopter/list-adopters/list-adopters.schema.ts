import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listAdoptersSchema = apiQueryStringSchema.extend({
  name: z.string().nullish(),
  cpf: z.string().nullish(),
  email: z.string().nullish(),
  phone: z
    .string()
    .transform((phone) => phone.replace(/\D/g, ''))
    .nullish(),
})
