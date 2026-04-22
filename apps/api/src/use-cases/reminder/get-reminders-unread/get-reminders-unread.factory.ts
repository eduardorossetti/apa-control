import { ReminderRepository } from '@/repositories/reminder.repository'
import { GetRemindersUnreadUseCase } from './get-reminders-unread'

export function makeGetRemindersUnreadUseCase() {
  return new GetRemindersUnreadUseCase(new ReminderRepository())
}
