import { ProcedureStatusValues } from '@/database/schema/enums/procedure-status'
import { isDateRangeValid } from '@/utils/date-range'
import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

const procedureStatusFilterSchema = z.union([z.enum(ProcedureStatusValues), z.literal('pendente')])

export const listClinicalProceduresSchema = apiQueryStringSchema
  .extend({
    animalName: z.string().optional(),
    procedureTypeId: z.coerce.number().int().positive().optional(),
    appointmentTypeId: z.coerce.number().int().positive().optional(),
    appointmentId: z.coerce.number().int().positive().optional(),
    employeeId: z.coerce.number().int().positive().optional(),
    status: procedureStatusFilterSchema.optional(),
    procedureDateStart: z.string().min(1, 'Data inicial é obrigatória.'),
    procedureDateEnd: z.string().min(1, 'Data final é obrigatória.'),
  })
  .refine((data) => isDateRangeValid(data.procedureDateStart, data.procedureDateEnd), {
    message: 'A data inicial deve ser menor ou igual à data final.',
    path: ['procedureDateEnd'],
  })
