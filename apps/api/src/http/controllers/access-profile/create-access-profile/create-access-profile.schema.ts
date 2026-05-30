import { z } from 'zod'

export const createAccessProfileSchema = z.object({
  description: z.string({ error: 'A descrição do perfil é obrigatória.' }).trim(),
  permissions: z.array(z.coerce.number()).default([]),
})
