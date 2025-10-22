export class FinalDestination {
  id?: number
  animalId: number
  destinationTypeId: number
  employeeId: number
  destinationDate: string
  reason: string
  observations?: string | null
  proof?: string | null
  createdAt: Date

  constructor(props: Omit<FinalDestination, 'id'>, id?: number) {
    this.id = id
    this.animalId = props.animalId
    this.destinationTypeId = props.destinationTypeId
    this.employeeId = props.employeeId
    this.destinationDate = props.destinationDate
    this.reason = props.reason
    this.observations = props.observations
    this.proof = props.proof
    this.createdAt = props.createdAt
  }
}
