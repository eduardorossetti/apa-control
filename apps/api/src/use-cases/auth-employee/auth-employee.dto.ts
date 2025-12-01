import type { authEmployeeSchema } from '@/http/controllers/auth/auth-employee/auth-employee.schema'
import type z from 'zod'

export type AuthEmployeeData = z.infer<typeof authEmployeeSchema>

export interface AuthEmployeeUser {
  id: number
  name: string
  profileName: string
  permissions: string[]
}

export interface AuthEmployeeDTO {
  accessToken: string
  user: AuthEmployeeUser
}
