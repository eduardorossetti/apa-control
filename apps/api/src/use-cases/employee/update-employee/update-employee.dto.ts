import type { updateEmployeeSchema } from '@/http/controllers/employee/update-employee/update-employee.schema'
import type z from 'zod'

export type UpdateEmployeeData = z.infer<typeof updateEmployeeSchema>
