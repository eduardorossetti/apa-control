import type { getEmployeeByIdSchema } from '@/http/controllers/employee/get-employee-by-id/get-employee-by-id.schema'
import type z from 'zod'

export type GetEmployeeByIdData = z.infer<typeof getEmployeeByIdSchema>

export interface GetEmployeeByIdDTO {
  id: number
  name: string
  login: string
  cpf: string
  email: string | null
  streetName: string | null
  streetNumber: string | null
  district: string | null
  city: string | null
  state: string | null
  postalCode: string | null
  complement: string | null
  phone1: string | null
  phone2: string | null
  profileId: number
  createdAt: Date
  activedAt: Date | null
  disabledAt: Date | null
}
