import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listRevenuesSchema = apiQueryStringSchema
  .extend({
    description: z.string().optional(),
    animalName: z.string().optional(),
    transactionTypeId: z.coerce.number().int().positive().optional(),
    campaignId: z.coerce.number().int().positive().optional(),
    animalId: z.coerce.number().int().positive().optional(),
    employeeId: z.coerce.number().int().positive().optional(),
    status: z.enum(['confirmado', 'estornado']).optional(),
    createdAtStart: z.string().optional(),
    createdAtEnd: z.string().optional(),
    dueDateStart: z.string().optional(),
    dueDateEnd: z.string().optional(),
    reversalDateStart: z.string().optional(),
    reversalDateEnd: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.createdAtStart || !data.createdAtEnd) return true
      return new Date(data.createdAtStart) <= new Date(data.createdAtEnd)
    },
    {
      message: 'A data inicial deve ser menor ou igual à data final.',
      path: ['createdAtEnd'],
    },
  )
  .refine(
    (data) => {
      if (!data.dueDateStart || !data.dueDateEnd) return true
      return new Date(data.dueDateStart) <= new Date(data.dueDateEnd)
    },
    {
      message: 'A data inicial de vencimento deve ser menor ou igual à data final.',
      path: ['dueDateEnd'],
    },
  )
  .refine(
    (data) => {
      if (!data.reversalDateStart || !data.reversalDateEnd) return true
      return new Date(data.reversalDateStart) <= new Date(data.reversalDateEnd)
    },
    {
      message: 'A data inicial de estorno deve ser menor ou igual à data final.',
      path: ['reversalDateEnd'],
    },
  )
