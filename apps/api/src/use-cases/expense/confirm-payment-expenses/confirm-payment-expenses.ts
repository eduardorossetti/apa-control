import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import { AnimalHistory } from '@/entities'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { FinancialTransactionRepository } from '@/repositories/financial-transaction.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import type { ConfirmPaymentExpensesData } from './confirm-payment-expenses.dto'

export class ConfirmPaymentExpensesUseCase {
  constructor(
    private financialTransactionRepository: FinancialTransactionRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async execute(data: ConfirmPaymentExpensesData, employeeId: number): Promise<void> {
    await db.transaction(async (tx) => {
      const transactions = await this.financialTransactionRepository.findByIds(data.ids, tx)
      await this.financialTransactionRepository.confirmTransactionByIds(data.ids, tx)
      await this.reminderRepository.deleteByEntity(ReminderEntityType.FINANCIAL_TRANSACTION, data.ids, tx)

      for (const transaction of transactions) {
        if (transaction.animalId) {
          await this.animalHistoryRepository.create(
            new AnimalHistory({
              animalId: transaction.animalId,
              rescueId: null,
              employeeId,
              type: AnimalHistoryType.EXPENSE,
              action: 'expense.confirmed',
              description: `Despesa ${transaction.description} confirmada`,
              oldValue: null,
              newValue: null,
              createdAt: new Date(),
            }),
            tx,
          )
        }
      }
    })
  }
}
