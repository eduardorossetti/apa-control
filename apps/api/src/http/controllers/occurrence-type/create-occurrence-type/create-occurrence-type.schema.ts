import { z } from 'zod'

export const createOccurrenceTypeSchema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório'),
  description: z.string().nullish(),
  active: z.coerce.boolean().optional().default(false),
})
