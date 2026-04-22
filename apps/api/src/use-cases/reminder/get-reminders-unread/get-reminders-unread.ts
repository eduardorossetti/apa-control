import type { ReminderRepository } from '@/repositories/reminder.repository'

export class GetRemindersUnreadUseCase {
  constructor(private reminderRepository: ReminderRepository) {}

  async execute(employeeId: number): Promise<number> {
    return await this.reminderRepository.countUnreadByEmployee(employeeId)
  }
}
