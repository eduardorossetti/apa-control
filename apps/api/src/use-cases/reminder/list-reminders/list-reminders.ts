import type { ReminderRepository } from '@/repositories/reminder.repository'
import type { ListRemindersData, ReminderWithDetails } from './list-reminders.dto'

export class ListRemindersUseCase {
  constructor(private reminderRepository: ReminderRepository) {}

  async execute(data: ListRemindersData): Promise<[number, ReminderWithDetails[]]> {
    return await this.reminderRepository.listByEmployee(data)
  }
}
