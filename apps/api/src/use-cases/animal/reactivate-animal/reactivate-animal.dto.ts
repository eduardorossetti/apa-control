export interface ReactivateAnimalRescueData {
  rescueDate: string
  locationFound: string
  circumstances: string
  foundConditions: string
  immediateProcedures?: string | null
  observations?: string | null
}

export interface ReactivateAnimalData {
  id: number
  employeeId: number
  rescue?: ReactivateAnimalRescueData
}
