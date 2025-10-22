export class Appointment {
  id?: number
  animalId: number
  appointmentTypeId: number
  clinicId?: number | null
  employeeId: number
  appointmentDate: Date
  consultationType: string
  status: string
  observations?: string | null
  createdAt: Date
  updatedAt?: Date | null

  constructor(props: Omit<Appointment, 'id'>, id?: number) {
    this.id = id
    this.animalId = props.animalId
    this.appointmentTypeId = props.appointmentTypeId
    this.clinicId = props.clinicId
    this.employeeId = props.employeeId
    this.appointmentDate = props.appointmentDate
    this.consultationType = props.consultationType
    this.status = props.status
    this.observations = props.observations
    this.createdAt = props.createdAt
    this.updatedAt = props.updatedAt
  }
}
