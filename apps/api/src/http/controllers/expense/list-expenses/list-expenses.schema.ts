import { TransactionStatusValues } from '@/database/schema/enums/transaction-status'
import { isDateRangeValid } from '@/utils/date-range'
import { apiQueryStringSchema } from '@/utils/drizzle/api-query-schema'
import { z } from 'zod'

export const listExpensesSchema = apiQueryStringSchema
  .extend({
    description: z.string().optional(),
    animalName: z.string().optional(),
    transactionTypeId: z.coerce.number().int().positive().optional(),
    campaignId: z.coerce.number().int().positive().optional(),
    animalId: z.coerce.number().int().positive().optional(),
    employeeId: z.coerce.number().int().positive().optional(),
    status: z.enum([...TransactionStatusValues, 'vencido'] as [string, ...string[]]).optional(),
    createdAtStart: z.string().optional(),
    createdAtEnd: z.string().optional(),
    dueDateStart: z.string().optional(),
    dueDateEnd: z.string().optional(),
    paymentDateStart: z.string().optional(),
    paymentDateEnd: z.string().optional(),
    reversalDateStart: z.string().optional(),
    reversalDateEnd: z.string().optional(),
  })
  .refine((data) => isDateRangeValid(data.createdAtStart, data.createdAtEnd), {
    message: 'A data inicial deve ser menor ou igual à data final.',
    path: ['createdAtEnd'],
  })
  .refine((data) => isDateRangeValid(data.dueDateStart, data.dueDateEnd), {
    message: 'A data inicial de vencimento deve ser menor ou igual à data final.',
    path: ['dueDateEnd'],
  })
  .refine((data) => isDateRangeValid(data.paymentDateStart, data.paymentDateEnd), {
    message: 'A data inicial de pagamento deve ser menor ou igual à data final.',
    path: ['paymentDateEnd'],
  })
  .refine((data) => isDateRangeValid(data.reversalDateStart, data.reversalDateEnd), {
    message: 'A data inicial de estorno deve ser menor ou igual à data final.',
    path: ['reversalDateEnd'],
  })
