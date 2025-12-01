import type { DrizzleTransaction } from '@/database/types'
import type { TransactionTypeRepository } from '@/repositories/transaction-type.repository'
import { ApiError } from '@/utils/api-error'
import type { RemoveTransactionTypeData } from './remove-transaction-type.dto'

export class RemoveTransactionTypeUseCase {
  constructor(private transactionTypeRepository: TransactionTypeRepository) {}

  async execute(data: RemoveTransactionTypeData, dbTransaction: DrizzleTransaction) {
    const transactionType = await this.transactionTypeRepository.findById(data.id)

    if (!transactionType) {
      throw new ApiError('Nenhum tipo de transação encontrado.', 404)
    }

    const financialTransactionCount = await this.transactionTypeRepository.countByTransactionTypeId(
      transactionType.id,
      dbTransaction,
    )

    if (financialTransactionCount > 0) {
      throw new ApiError(
        `Não é possível excluir o tipo de transação pois existem ${financialTransactionCount} transação(ões) financeira(s) vinculada(s) a ele.`,
        400,
      )
    }

    await this.transactionTypeRepository.remove(transactionType.id, dbTransaction)
  }
}
