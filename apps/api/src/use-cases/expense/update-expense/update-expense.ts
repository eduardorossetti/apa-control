import Decimal from 'decimal.js'

import { db } from '@/database/client'
import { AnimalHistoryType } from '@/database/schema/enums/animal-history-type'
import { ReminderEntityType } from '@/database/schema/enums/reminder-entity-type'
import { TransactionCategory } from '@/database/schema/enums/transaction-category'
import { AnimalHistory, Reminder } from '@/entities'
import type { AnimalHistoryRepository } from '@/repositories/animal-history.repository'
import type { AnimalRepository } from '@/repositories/animal.repository'
import type { CampaignRepository } from '@/repositories/campaign.repository'
import type { FinancialTransactionRepository } from '@/repositories/financial-transaction.repository'
import type { ReminderRepository } from '@/repositories/reminder.repository'
import type { TransactionTypeRepository } from '@/repositories/transaction-type.repository'
import { ApiError } from '@/utils/api-error'
import { removeUploadFile } from '@/utils/files/remove-upload-file'
import { buildFinancialTransactionReminderMessage } from '../../reminder/builders'
import type { UpdateExpenseData } from './update-expense.dto'

export class UpdateExpenseUseCase {
  constructor(
    private financialTransactionRepository: FinancialTransactionRepository,
    private transactionTypeRepository: TransactionTypeRepository,
    private campaignRepository: CampaignRepository,
    private animalRepository: AnimalRepository,
    private animalHistoryRepository: AnimalHistoryRepository,
    private reminderRepository: ReminderRepository,
  ) {}

  async execute(data: UpdateExpenseData, employeeId: number): Promise<void> {
    const existing = await this.financialTransactionRepository.findExpenseById(data.id)
    if (!existing) throw new ApiError('Despesa não encontrada.', 404)
    if (existing.status === 'confirmado') throw new ApiError('Não é possível editar uma despesa confirmada.', 409)

    const transactionType = await this.transactionTypeRepository.findById(data.transactionTypeId)
    if (!transactionType) throw new ApiError('Tipo de lançamento não encontrado.', 404)
    if (!transactionType.active) throw new ApiError('Tipo de lançamento inativo.', 409)
    if (transactionType.category !== TransactionCategory.EXPENSE) {
      throw new ApiError('O tipo selecionado não é de despesa.', 400)
    }

    if (data.campaignId) {
      const campaign = await this.campaignRepository.findById(data.campaignId)
      if (!campaign) throw new ApiError('Campanha não encontrada.', 404)
    }

    if (data.animalId) {
      const animal = await this.animalRepository.findById(data.animalId)
      if (!animal) throw new ApiError('Animal não encontrado.', 404)
    }

    const proof = data.proof ?? null

    const trackedFields: (keyof UpdateExpenseData)[] = [
      'transactionTypeId',
      'description',
      'value',
      'dueDate',
      'observations',
    ]

    const oldValues: Record<string, unknown> = {}
    const newValues: Record<string, unknown> = {}

    for (const key of trackedFields) {
      const oldVal = (existing as Record<string, unknown>)[key] ?? null
      const newVal = data[key] ?? null
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        oldValues[key] = oldVal
        newValues[key] = newVal
      }
    }

    await db.transaction(async (tx) => {
      await this.financialTransactionRepository.update(
        data.id,
        {
          transactionTypeId: data.transactionTypeId,
          campaignId: data.campaignId ?? null,
          animalId: data.animalId ?? null,
          description: data.description,
          value: new Decimal(data.value),
          proof,
          observations: data.observations ?? null,
          dueDate: data.dueDate ?? null,
        },
        tx,
      )

      if (data.dueDate) {
        const reminderMsg = buildFinancialTransactionReminderMessage({
          description: data.description,
          dueDate: data.dueDate,
        })
        await this.reminderRepository.upsertByEntity(
          ReminderEntityType.FINANCIAL_TRANSACTION,
          data.id,
          existing.employeeId,
          { title: reminderMsg.title, message: reminderMsg.message },
          tx,
        )
      } else {
        await this.reminderRepository.deleteByEntity(ReminderEntityType.FINANCIAL_TRANSACTION, [data.id], tx)
      }

      const animalId = data.animalId ?? existing.animalId
      if (animalId && Object.keys(newValues).length > 0) {
        await this.animalHistoryRepository.create(
          new AnimalHistory({
            animalId,
            rescueId: null,
            employeeId,
            type: AnimalHistoryType.EXPENSE,
            action: 'expense.updated',
            description: `Despesa ${data.description} atualizada`,
            oldValue: JSON.stringify(oldValues),
            newValue: JSON.stringify(newValues),
            createdAt: new Date(),
          }),
          tx,
        )
      }
    })

    if (existing.proof && existing.proof !== proof) {
      await removeUploadFile(existing.proof)
    }
  }
}
