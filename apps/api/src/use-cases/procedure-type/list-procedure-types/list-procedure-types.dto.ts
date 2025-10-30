import type { listProcedureTypesSchema } from '@/http/controllers/procedure-type/list-procedure-types/list-procedure-types.schema'
import type Decimal from 'decimal.js'
import type z from 'zod'

export type ListProcedureTypesData = z.infer<typeof listProcedureTypesSchema>

export type ListProcedureTypesDTO = {
  id: number
  name: string
  category: string
  averageCost: Decimal
  active: boolean
}
