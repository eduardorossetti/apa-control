import { AdoptionStatusValues } from '@/database/schema/enums/adoption-status'
import { z } from 'zod'

export const updateAdoptionSchema = z.object({
  id: z.coerce.number().int().positive('ID deve ser um número positivo'),
  adopterId: z.coerce.number().int().positive('Adotante é obrigatório'),
  adoptionDate: z.string().min(1, 'Data da adoção é obrigatória'),
  status: z.enum(AdoptionStatusValues),
  observations: z.string().nullish(),
  proof: z.string().nullish(),
})
