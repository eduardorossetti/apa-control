import type { ReminderRepository } from '@/repositories/reminder.repository'

export class ReadRemindersUseCase {
  constructor(private reminderRepository: ReminderRepository) {}

  async execute(employeeId: number, reminderIds: number[]): Promise<void> {
    await this.reminderRepository.markAsRead(employeeId, reminderIds)
  }
}
