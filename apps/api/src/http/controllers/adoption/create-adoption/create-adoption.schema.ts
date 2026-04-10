import { AdoptionStatusValues } from '@/database/schema/enums/adoption-status'
import { z } from 'zod'

export const createAdoptionSchema = z.object({
  animalId: z.coerce.number().int().positive('Animal é obrigatório'),
  adopterId: z.coerce.number().int().positive('Adotante é obrigatório'),
  adoptionDate: z.string().min(1, 'Data da adoção é obrigatória'),
  status: z.enum(AdoptionStatusValues).optional(),
  observations: z.string().nullish(),
  proof: z.string().nullish(),
})
