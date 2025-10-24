import type { disableEmployeeSchema } from '@/http/controllers/employee/disable-employee/disable-employee.schema'
import type z from 'zod'

export type DisableEmployeeData = z.infer<typeof disableEmployeeSchema>
