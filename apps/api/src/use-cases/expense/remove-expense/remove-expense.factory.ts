import { FinancialTransactionRepository } from '@/repositories/financial-transaction.repository'
import { ReminderRepository } from '@/repositories/reminder.repository'
import { RemoveExpenseUseCase } from './remove-expense'

export function makeRemoveExpenseUseCase() {
  return new RemoveExpenseUseCase(new FinancialTransactionRepository(), new ReminderRepository())
}
