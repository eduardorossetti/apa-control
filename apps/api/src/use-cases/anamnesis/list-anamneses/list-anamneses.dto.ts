export interface ListAnamnesesData {
  animalName?: string
  appointmentTypeId?: number
  appointmentId?: number
  employeeId?: number
  createdDateStart?: string
  createdDateEnd?: string
  page?: number
  perPage?: number
  sort?: Array<{ name: string; order: string }>
  fields?: string[]
}

export interface AnamnesisWithDetails {
  id: number
  appointmentId: number
  symptomsPresented: string | null
  dietaryHistory: string | null
  behavioralHistory: string | null
  requestedExams: string | null
  presumptiveDiagnosis: string | null
  observations: string | null
  proof: string | null
  createdAt: Date
  appointmentTypeName?: string | null
  animalName?: string | null
  appointmentDate?: Date | null
  employeeName?: string | null
}
