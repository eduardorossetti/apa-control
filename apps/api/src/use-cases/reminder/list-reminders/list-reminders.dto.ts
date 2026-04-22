import type { ReminderEntityTypeValue } from '@/database/schema/enums/reminder-entity-type'

export interface ListRemindersData {
  employeeId: number
  page?: number
  perPage?: number
  readStatus?: 'all' | 'read' | 'unread'
}

export interface ReminderWithDetails {
  id: number
  entityType: ReminderEntityTypeValue
  entityId: number
  employeeId: number
  title: string
  message: string
  readAt: Date | null
  createdAt: Date
  animalName: string | null
  eventDate: Date | null
}
