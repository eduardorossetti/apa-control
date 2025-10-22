import { z } from 'zod'

export const updateAccessProfileSchema = z.object({
  id: z.number({ error: 'O código do perfil é obrigatório.' }),
  description: z.string({ error: 'A descrição do perfil é obrigatória.' }).trim(),
  permissions: z.number().array().default([]).nullish(),
})
