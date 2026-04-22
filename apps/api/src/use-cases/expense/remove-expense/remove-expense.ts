import { db } from '@/database/client'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import type { FinancialTransactionRepository } from '@/repositories/financial-transaction.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import { ApiError } from '@/utils/api-error'
import { removeUploadFile } from '@/utils/files/remove-upload-file'
import type { RemoveExpenseData } from './remove-expense.dto'

export class RemoveExpenseUseCase {
  constructor(
    private financialTransactionRepository: FinancialTransactionRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async execute(data: RemoveExpenseData): Promise<void> {
    const expense = await this.financialTransactionRepository.findExpenseById(data.id)
    if (!expense) throw new ApiError('Despesa não encontrada.', 404)
    if (expense.status === 'confirmado') throw new ApiError('Não é possível remover uma despesa confirmada.', 409)

    await db.transaction(async (tx) => {
      await this.reminderRepository.deleteByEntity(ReminderEntityType.FINANCIAL_TRANSACTION, [data.id], tx)
      await this.financialTransactionRepository.delete(data.id, tx)
    })

    await removeUploadFile(expense.proof)
  }
}
