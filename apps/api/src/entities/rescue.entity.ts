export class Rescue {
  id?: number
  animalId: number
  employeeId: number
  rescueDate: Date
  locationFound: string
  circumstances: string
  foundConditions: string
  immediateProcedures?: string | null
  observations?: string | null
  createdAt: Date

  constructor(props: Omit<Rescue, 'id'>, id?: number) {
    this.id = id
    this.animalId = props.animalId
    this.employeeId = props.employeeId
    this.rescueDate = props.rescueDate
    this.locationFound = props.locationFound
    this.circumstances = props.circumstances
    this.foundConditions = props.foundConditions
    this.immediateProcedures = props.immediateProcedures
    this.observations = props.observations
    this.createdAt = props.createdAt
  }
}
