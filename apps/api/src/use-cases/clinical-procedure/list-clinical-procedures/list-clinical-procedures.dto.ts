import type Decimal from 'decimal.js'

export interface ListClinicalProceduresData {
  animalName?: string
  procedureTypeId?: number
  appointmentTypeId?: number
  appointmentId?: number
  employeeId?: number
  status?: string
  procedureDateStart?: string
  procedureDateEnd?: string
  page?: number
  perPage?: number
  sort?: Array<{ name: string; order: string }>
  fields?: string[]
}

export interface ClinicalProcedureWithDetails {
  id: number
  animalId: number
  procedureTypeId: number
  appointmentId: number | null
  employeeId: number
  procedureDate: Date
  description: string
  proof: string | null
  actualCost: Decimal | null
  observations: string | null
  status: string
  createdAt: Date
  animalName?: string | null
  procedureTypeName?: string | null
  appointmentTypeName?: string | null
  appointmentDate?: Date | null
  employeeName?: string | null
}
