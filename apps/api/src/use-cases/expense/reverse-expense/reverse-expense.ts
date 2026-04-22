import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import { AnimalHistory } from '@/entities'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { FinancialTransactionRepository } from '@/repositories/financial-transaction.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import type { ReverseExpenseData } from './reverse-expense.dto'

export class ReverseExpenseUseCase {
  constructor(
    private financialTransactionRepository: FinancialTransactionRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async execute(data: ReverseExpenseData, employeeId: number): Promise<void> {
    const transaction = await this.financialTransactionRepository.findExpenseByIdOrThrow(data.id)

    await db.transaction(async (tx) => {
      await this.financialTransactionRepository.reverseById(data.id, tx)
      await this.reminderRepository.deleteByEntity(ReminderEntityType.FINANCIAL_TRANSACTION, [data.id], tx)

      if (transaction.animalId) {
        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId: transaction.animalId,
            rescueId: null,
            employeeId,
            type: AnimalHistoryType.EXPENSE,
            action: 'expense.reversed',
            description: `Despesa ${transaction.description} estornada`,
            oldValue: null,
            newValue: null,
            createdAt: new Date(),
          }),
          tx,
        )
      }
    })
  }
}
