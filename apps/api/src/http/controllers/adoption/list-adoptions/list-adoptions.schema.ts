import { AdoptionStatusValues } from '@/database/schema/enums/adoption-status'
import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listAdoptionsSchema = apiQueryStringSchema
  .extend({
    animalName: z.string().optional(),
    adopterName: z.string().optional(),
    status: z.enum(AdoptionStatusValues).optional(),
    employeeId: z.coerce.number().int().positive().optional(),
    adoptionDateStart: z.string().min(1, 'Data inicial é obrigatória.'),
    adoptionDateEnd: z.string().min(1, 'Data final é obrigatória.'),
    animalDepartureDateStart: z.string().optional(),
    animalDepartureDateEnd: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.adoptionDateStart || !data.adoptionDateEnd) return true
      return new Date(data.adoptionDateStart) <= new Date(data.adoptionDateEnd)
    },
    {
      message: 'A data inicial deve ser menor ou igual à data final.',
      path: ['adoptionDateEnd'],
    },
  )
  .refine(
    (data) => {
      if (!data.animalDepartureDateStart || !data.animalDepartureDateEnd) return true
      return new Date(data.animalDepartureDateStart) <= new Date(data.animalDepartureDateEnd)
    },
    {
      message: 'A data inicial de saída deve ser menor ou igual à data final de saída.',
      path: ['animalDepartureDateEnd'],
    },
  )
