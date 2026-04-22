import { ReminderRepository } from '@/repositories/reminder.repository'
import { ListRemindersUseCase } from './list-reminders'

export function makeListRemindersUseCase() {
  return new ListRemindersUseCase(new ReminderRepository())
}
