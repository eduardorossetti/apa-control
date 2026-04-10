import type { Decimal } from 'decimal.js'

export class ClinicalProcedure {
  id?: number
  animalId: number
  procedureTypeId: number
  appointmentId?: number | null
  employeeId: number
  procedureDate: Date
  description: string
  proof?: string | null
  actualCost: Decimal | null
  observations?: string | null
  status: string
  createdAt: Date

  constructor(props: Omit<ClinicalProcedure, 'id'>, id?: number) {
    this.id = id
    this.animalId = props.animalId
    this.procedureTypeId = props.procedureTypeId
    this.appointmentId = props.appointmentId
    this.employeeId = props.employeeId
    this.procedureDate = props.procedureDate
    this.description = props.description
    this.proof = props.proof
    this.actualCost = props.actualCost
    this.observations = props.observations
    this.status = props.status
    this.createdAt = props.createdAt
  }
}
