import { isDateRangeValid } from '@/utils/date-range'
import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listOccurrencesSchema = apiQueryStringSchema
  .extend({
    animalName: z.string().optional(),
    occurrenceTypeId: z.coerce.number().int().positive().optional(),
    employeeId: z.coerce.number().int().positive().optional(),
    occurrenceDateStart: z.string().optional(),
    occurrenceDateEnd: z.string().optional(),
  })
  .refine((data) => isDateRangeValid(data.occurrenceDateStart, data.occurrenceDateEnd), {
    message: 'A data inicial deve ser menor ou igual à data final.',
    path: ['occurrenceDateEnd'],
  })
