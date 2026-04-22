import { ReminderRepository } from '@/repositories/reminder.repository'
import { ReadRemindersUseCase } from './read-reminders'

export function makeReadRemindersUseCase() {
  return new ReadRemindersUseCase(new ReminderRepository())
}
