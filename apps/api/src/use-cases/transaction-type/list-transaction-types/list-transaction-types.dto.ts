import type { listTransactionTypesSchema } from '@/http/controllers/transaction-type/list-transaction-types/list-transaction-types.schema'
import type z from 'zod'

export type ListTransactionTypesData = z.infer<typeof listTransactionTypesSchema>

export type ListTransactionTypesDTO = {
  id: number
  name: string
  category: string
  active: boolean
}
