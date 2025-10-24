import type { createEmployeeSchema } from '@/http/controllers/employee/create-employee/create-employee.schema'
import type z from 'zod'

export type CreateEmployeeData = z.infer<typeof createEmployeeSchema>

export interface CreateEmployeeDTO {
  id: number
}
