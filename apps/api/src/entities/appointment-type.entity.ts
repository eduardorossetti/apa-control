export class AppointmentType {
  id?: number
  name: string
  description?: string | null
  urgency: string
  active: boolean
  createdAt: Date

  constructor(props: Omit<AppointmentType, 'id'>, id?: number) {
    this.id = id
    this.name = props.name
    this.description = props.description
    this.urgency = props.urgency
    this.active = props.active
    this.createdAt = props.createdAt
  }
}
