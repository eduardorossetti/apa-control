import { z } from 'zod'

export const updateAccessProfileSchema = z.object({
  id: z.coerce.number({ error: 'O código do perfil é obrigatório.' }),
  description: z.string({ error: 'A descrição do perfil é obrigatória.' }).trim(),
  permissions: z.array(z.coerce.number()).default([]).nullish(),
})
