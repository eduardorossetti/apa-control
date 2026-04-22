import type { ReminderEntityTypeValue } from '@/database/schema/enums/reminder-entity-type'

export class Reminder {
  id?: number
  entityType: ReminderEntityTypeValue
  entityId: number
  employeeId: number
  title: string
  message: string
  readAt?: Date | null
  createdAt: Date

  constructor(props: Omit<Reminder, 'id'>, id?: number) {
    this.id = id
    this.entityType = props.entityType
    this.entityId = props.entityId
    this.employeeId = props.employeeId
    this.title = props.title
    this.message = props.message
    this.readAt = props.readAt ?? null
    this.createdAt = props.createdAt
  }
}
