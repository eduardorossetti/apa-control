import { AdoptionStatusValues } from '@/database/schema/enums/adoption-status'
import { isDateRangeValid } from '@/utils/date-range'
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
  .refine((data) => isDateRangeValid(data.adoptionDateStart, data.adoptionDateEnd), {
    message: 'A data inicial deve ser menor ou igual à data final.',
    path: ['adoptionDateEnd'],
  })
  .refine((data) => isDateRangeValid(data.animalDepartureDateStart, data.animalDepartureDateEnd), {
    message: 'A data inicial de saída deve ser menor ou igual à data final de saída.',
    path: ['animalDepartureDateEnd'],
  })
