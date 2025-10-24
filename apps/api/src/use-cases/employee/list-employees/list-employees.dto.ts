import type { Employee } from '@/entities'
import type { listEmployeesSchema } from '@/http/controllers/employee/list-employees/list-employees.schema'
import type z from 'zod'

export type ListEmployeesData = z.infer<typeof listEmployeesSchema>

export type EmployeeWithDetails = Employee & {
  id: number
  profileName?: string
}
